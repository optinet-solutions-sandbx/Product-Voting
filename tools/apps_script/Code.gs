/**
 * AI Engineering — Weekend Challenge · Ballot Backend
 * ----------------------------------------------------------------
 * Endpoints (all on the same deployment URL):
 *   POST  body = { name, email, votes }      → records ballot
 *   GET   ?action=voters                     → public roster (name + timestamp)
 *   GET   ?action=status                     → { open, closed, totalBallots, expected, closesAt }
 *   GET   ?action=results                    → winners + tally (only when closed)
 *   GET   ?action=tally&token=ADMIN_TOKEN    → raw tally any time (admin only)
 *
 * Sheet structure (auto-created on first call):
 *   "Ballots" sheet
 *     timestamp | voter_email | voter_name | jose | ianjay | revo | jas | cathy | ralph | ciri | leo | ivan | john
 */

/* ===== CONFIG ============================================================ */

/** Order of submitter slugs — MUST match window.SUBMITTERS in data.js */
const SUBMITTER_ORDER = [
  "jose", "ianjay", "revo", "jas", "cathy",
  "ralph", "ciri", "leo", "ivan", "john"
];

/** Email → submitter slug. Used to reject self-votes server-side.
 *  Keep in sync with the `email` field on each entry in data.js. */
const SUBMITTER_EMAILS = {
  "jose@optinetsolutions.com":     "jose",
  "ian@optinetsolutions.com":      "ianjay",
  "revo@optinetsolutions.com":     "revo",
  "jas@optinetsolutions.com":      "jas",
  "cathylyn@optinetsolutions.com": "cathy",
  "raphael@optinetsolutions.com":  "ralph",
  "cirilo@optinetsolutions.com":   "ciri",
  "leo@optinetsolutions.com":      "leo",
  "ivan@optinetsolutions.com":     "ivan",
  "john@optinetsolutions.com":     "john"
};

/** Sheet tab name */
const SHEET_NAME = "Ballots";

/** Admin token — read from Script Properties so it's never in source.
 *  Set in Apps Script: Project Settings → Script Properties → add
 *  property "ADMIN_TOKEN" with your secret value. */
function getAdminToken_() {
  return PropertiesService.getScriptProperties().getProperty("ADMIN_TOKEN") || "";
}

/** Optional email-domain allow-list. Empty array = allow any email. */
const ALLOWED_EMAIL_DOMAINS = []; // e.g. ["optinetsolutions.com"]

/** Voting window.
 *  STARTS_AT is read from Script Properties so you can start the clock
 *  without editing source. Two ways to set it:
 *    1. Hit GET ?action=start&token=ADMIN_TOKEN  (records "now")
 *    2. Project Settings → Script Properties → set STARTS_AT manually
 *
 *  Voting closes WINDOW_HOURS after STARTS_AT — automatically. If STARTS_AT
 *  is unset, the deadline trigger is disabled (voting stays open until
 *  quorum / EXPECTED_VOTERS ballots / FORCE_CLOSED). */
const WINDOW_HOURS = 24;
const EXPECTED_VOTERS = 10;
const FORCE_CLOSED = false;

function getStartsAt_() {
  return PropertiesService.getScriptProperties().getProperty("STARTS_AT") || "";
}

/* ===== HELPERS =========================================================== */

function ensureSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "voter_email", "voter_name", ...SUBMITTER_ORDER]);
    sheet.getRange("1:1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedDomain_(email) {
  if (!ALLOWED_EMAIL_DOMAINS.length) return true;
  const domain = email.split("@")[1].toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

function readBallotRows_() {
  const sheet = ensureSheet_();
  const data = sheet.getDataRange().getValues();
  return data.slice(1); // skip header
}

function computedClosesAt_() {
  const startsAt = getStartsAt_();
  if (!startsAt) return null;
  const start = new Date(startsAt);
  if (isNaN(start.getTime())) return null;
  return new Date(start.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
}

function votingState_(rows) {
  rows = rows || readBallotRows_();
  const totalBallots = rows.length;
  const reachedQuorum = totalBallots >= EXPECTED_VOTERS;
  const startsAt = getStartsAt_();
  const closesAt = computedClosesAt_();
  const pastDeadline = closesAt && new Date() >= closesAt;
  const closed = FORCE_CLOSED || reachedQuorum || pastDeadline;
  let reason = null;
  if (closed) {
    reason = FORCE_CLOSED ? "manual"
           : reachedQuorum ? "all_voted"
           : "deadline";
  }
  return {
    open: !closed,
    closed,
    reason,
    totalBallots,
    expected: EXPECTED_VOTERS,
    startsAt: startsAt || null,
    closesAt: closesAt ? closesAt.toISOString() : null,
    windowHours: WINDOW_HOURS
  };
}

function computeTally_(rows) {
  const tally = {};
  SUBMITTER_ORDER.forEach((slug, idx) => {
    tally[slug] = {};
    rows.forEach(r => {
      const ideaId = String(r[idx + 3] || "").trim();
      if (ideaId) tally[slug][ideaId] = (tally[slug][ideaId] || 0) + 1;
    });
  });
  return tally;
}

function computeWinners_(tally) {
  /* Per submitter: the idea with the highest count wins.
     Ties broken alphabetically by idea_id (deterministic). */
  const winners = {};
  SUBMITTER_ORDER.forEach(slug => {
    const counts = tally[slug] || {};
    const entries = Object.entries(counts);
    if (!entries.length) {
      winners[slug] = { ideaId: null, votes: 0, tie: false };
      return;
    }
    entries.sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
    const topCount = entries[0][1];
    const tied = entries.filter(([, c]) => c === topCount).map(([id]) => id);
    winners[slug] = { ideaId: entries[0][0], votes: topCount, tie: tied.length > 1, tiedIds: tied };
  });
  return winners;
}

/* ===== GET handlers ====================================================== */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "voters";
  const rows = readBallotRows_();

  if (action === "voters") {
    const voters = rows.map(r => ({
      name: r[2],
      email: r[1],
      submittedAt: new Date(r[0]).toISOString()
    }));
    return jsonResponse_({ success: true, voters, total: voters.length });
  }

  if (action === "status") {
    return jsonResponse_({ success: true, ...votingState_(rows) });
  }

  if (action === "results") {
    const state = votingState_(rows);
    if (!state.closed) {
      return jsonResponse_({ success: false, error: "Voting still open", ...state });
    }
    const tally = computeTally_(rows);
    const winners = computeWinners_(tally);
    return jsonResponse_({ success: true, ...state, tally, winners });
  }

  if (action === "tally") {
    const token = (e.parameter && e.parameter.token) || "";
    const adminToken = getAdminToken_();
    if (!adminToken || token !== adminToken) {
      return jsonResponse_({ success: false, error: "Unauthorized" });
    }
    const tally = computeTally_(rows);
    return jsonResponse_({ success: true, tally, totalBallots: rows.length });
  }

  /* Admin: start the 24-hour countdown.
     Records the current timestamp as STARTS_AT in Script Properties.
     Refuses to overwrite an existing start unless &force=1 is passed. */
  if (action === "start") {
    const token = (e.parameter && e.parameter.token) || "";
    const adminToken = getAdminToken_();
    if (!adminToken || token !== adminToken) {
      return jsonResponse_({ success: false, error: "Unauthorized" });
    }
    const props = PropertiesService.getScriptProperties();
    const existing = props.getProperty("STARTS_AT");
    const force = e.parameter.force === "1";
    if (existing && !force) {
      const closesAt = computedClosesAt_();
      return jsonResponse_({
        success: false,
        error: "Voting has already started. Add &force=1 to reset.",
        startsAt: existing,
        closesAt: closesAt ? closesAt.toISOString() : null
      });
    }
    const now = new Date();
    props.setProperty("STARTS_AT", now.toISOString());
    return jsonResponse_({
      success: true,
      startsAt: now.toISOString(),
      closesAt: new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000).toISOString(),
      windowHours: WINDOW_HOURS
    });
  }

  /* Admin: clear STARTS_AT so voting falls back to no-deadline mode. */
  if (action === "reset_start") {
    const token = (e.parameter && e.parameter.token) || "";
    const adminToken = getAdminToken_();
    if (!adminToken || token !== adminToken) {
      return jsonResponse_({ success: false, error: "Unauthorized" });
    }
    PropertiesService.getScriptProperties().deleteProperty("STARTS_AT");
    return jsonResponse_({ success: true, cleared: true });
  }

  return jsonResponse_({ success: false, error: "Unknown action" });
}

/* ===== POST handler ====================================================== */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ success: false, error: "Empty request body" });
    }
    const body = JSON.parse(e.postData.contents);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const votes = body.votes || {};

    if (!name) return jsonResponse_({ success: false, error: "Missing name" });
    if (!isValidEmail_(email)) return jsonResponse_({ success: false, error: "Invalid email" });
    if (!isAllowedDomain_(email)) {
      return jsonResponse_({ success: false, error: "Email domain not allowed" });
    }

    /* If this voter is themselves a submitter, drop any vote they've sent
       for their own slot and skip the missing-vote check for it. */
    const ownSlug = SUBMITTER_EMAILS[email] || null;
    if (ownSlug && votes[ownSlug]) {
      delete votes[ownSlug];
    }

    for (const slug of SUBMITTER_ORDER) {
      if (slug === ownSlug) continue;
      if (!votes[slug]) {
        return jsonResponse_({ success: false, error: "Missing vote for " + slug });
      }
    }

    const sheet = ensureSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(8000);
    try {
      const rows = readBallotRows_();

      // Reject if voting has closed
      const state = votingState_(rows);
      if (state.closed) {
        return jsonResponse_({
          success: false,
          error: "Voting has closed.",
          reason: state.reason
        });
      }

      // Reject duplicate
      const existingEmails = rows.map(r => String(r[1]).toLowerCase());
      if (existingEmails.includes(email)) {
        return jsonResponse_({ success: false, error: "You have already voted." });
      }

      sheet.appendRow([
        new Date(),
        email,
        name,
        ...SUBMITTER_ORDER.map(slug => votes[slug])
      ]);

      // After append: include the new state so client can redirect to results
      const newState = votingState_();
      return jsonResponse_({ success: true, state: newState });
    } finally {
      lock.releaseLock();
    }

  } catch (err) {
    return jsonResponse_({ success: false, error: String(err) });
  }
}
