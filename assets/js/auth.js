/* Authentication + ballot storage helpers shared across pages.

   Backend strategy:
     - If window.AIE_CONFIG.BALLOT_ENDPOINT is set, ballots are POSTed
       there (Apps Script web app — see tools/apps_script/SETUP.md) and
       the voter list is fetched from the same endpoint.
     - If it's empty, everything stays in localStorage so local dev still
       works without the backend.

   Local storage keys:
     aie.user    = { name, email, signedInAt }
     aie.ballots = { [email]: { name, votes, submittedAt } }   (fallback)
*/
(function () {
  "use strict";

  const USER_KEY = "aie.user";
  const BALLOTS_KEY = "aie.ballots";

  function endpoint() {
    const url = (window.AIE_CONFIG && window.AIE_CONFIG.BALLOT_ENDPOINT) || "";
    return url.trim();
  }
  function hasBackend() { return !!endpoint(); }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  /* ------------------------------------------------------------------
     Identity (always local — backend doesn't track sessions)
     ------------------------------------------------------------------ */
  function user() { return readJSON(USER_KEY, null); }

  function signIn({ name, email }) {
    const trimmedName = String(name || "").trim();
    const trimmedEmail = String(email || "").trim().toLowerCase();
    if (!trimmedName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error("Please enter a valid name and work email.");
    }
    const u = {
      name: trimmedName,
      email: trimmedEmail,
      signedInAt: new Date().toISOString()
    };
    writeJSON(USER_KEY, u);
    return u;
  }

  function signOut() {
    try { localStorage.removeItem(USER_KEY); } catch {}
  }

  function requireUser(redirect = "index.html") {
    const u = user();
    if (!u) window.location.href = redirect;
    return u;
  }

  /* ------------------------------------------------------------------
     Ballots — backend-aware
     ------------------------------------------------------------------ */

  /** Submit a ballot. Returns a Promise<{ success: boolean, error?: string }>. */
  async function submitBallot(email, payload) {
    const cleanEmail = String(email || "").toLowerCase().trim();
    const body = {
      name: payload.name,
      email: cleanEmail,
      votes: payload.votes
    };

    if (hasBackend()) {
      try {
        const res = await fetch(endpoint(), {
          method: "POST",
          /* Apps Script returns JSON regardless of Content-Type. We use
             text/plain to avoid the CORS preflight (Apps Script doesn't
             support OPTIONS). */
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(body),
          redirect: "follow"
        });
        const json = await res.json();
        if (!json.success) return { success: false, error: json.error || "Server rejected the ballot." };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Network error: " + err.message };
      }
    }

    /* Local fallback */
    const all = readJSON(BALLOTS_KEY, {});
    if (all[cleanEmail]) return { success: false, error: "You have already voted." };
    all[cleanEmail] = {
      name: payload.name,
      votes: payload.votes,
      submittedAt: new Date().toISOString()
    };
    writeJSON(BALLOTS_KEY, all);
    return { success: true };
  }

  /** Returns Promise<Array<{name, email, submittedAt}>>. */
  async function voterList() {
    if (hasBackend()) {
      try {
        const res = await fetch(endpoint() + "?action=voters", { redirect: "follow" });
        const json = await res.json();
        if (json && json.success && Array.isArray(json.voters)) {
          return json.voters.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
        }
        return [];
      } catch {
        return [];
      }
    }

    /* Local fallback */
    const all = readJSON(BALLOTS_KEY, {});
    return Object.keys(all).map(e => ({
      name: all[e].name,
      email: e,
      submittedAt: all[e].submittedAt
    })).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  /** Returns Promise<boolean>. */
  async function hasVoted(email) {
    const cleanEmail = String(email || "").toLowerCase().trim();
    const list = await voterList();
    return list.some(v => String(v.email || "").toLowerCase() === cleanEmail);
  }

  /** Returns Promise<{ open, closed, reason?, totalBallots, expected, closesAt? }>.
   *  Without a backend, voting is always "open" with localStorage state. */
  async function votingStatus() {
    if (hasBackend()) {
      try {
        const res = await fetch(endpoint() + "?action=status", { redirect: "follow" });
        const json = await res.json();
        if (json && json.success) return json;
      } catch {}
      return { open: true, closed: false, totalBallots: 0, expected: 10 };
    }
    const all = readJSON(BALLOTS_KEY, {});
    return { open: true, closed: false, totalBallots: Object.keys(all).length, expected: 10 };
  }

  /** Returns Promise<{ winners, tally, totalBallots, ... } | { error }>. */
  async function votingResults() {
    if (hasBackend()) {
      try {
        const res = await fetch(endpoint() + "?action=results", { redirect: "follow" });
        return await res.json();
      } catch (err) {
        return { success: false, error: "Network error: " + err.message };
      }
    }
    return { success: false, error: "Backend not configured" };
  }

  window.Auth = {
    user, signIn, signOut, requireUser,
    submitBallot, voterList, hasVoted, hasBackend,
    votingStatus, votingResults
  };
})();
