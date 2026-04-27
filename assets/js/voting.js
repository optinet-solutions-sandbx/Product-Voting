/* Voting dashboard — anonymized flat ballot.
   Names are hidden from the UI; submitter ownership is preserved in the
   underlying state so we can:
     1. Hide the voter's own three products from their ballot.
     2. Enforce a "1 vote per submitter" railguard without naming names.
                                                                          */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Auth gate
     ------------------------------------------------------------------ */
  const user = window.Auth.requireUser("index.html");
  if (!user) return;

  /* ------------------------------------------------------------------
     Resolve which submitter (if any) belongs to the signed-in voter so
     we can drop their own products from the ballot.
     ------------------------------------------------------------------ */
  const submitters = window.SUBMITTERS;
  function ownSubmitterId(email) {
    const e = String(email || "").toLowerCase().trim();
    for (const s of submitters) {
      if (s.email && String(s.email).toLowerCase() === e) return s.id;
    }
    return null;
  }
  const ownId = ownSubmitterId(user.email);

  const eligibleSubmitters = submitters.filter(s => !s.pending && s.id !== ownId);
  const total = eligibleSubmitters.length;

  /* Build a flattened, interleaved deck of ideas. Round-robin across
     submitters so two products from the same person are never adjacent. */
  function buildDeck() {
    const deck = [];
    const maxLen = eligibleSubmitters.reduce((m, s) => Math.max(m, s.ideas.length), 0);
    for (let i = 0; i < maxLen; i++) {
      eligibleSubmitters.forEach(s => {
        if (s.ideas[i]) deck.push({ ...s.ideas[i], submitterId: s.id });
      });
    }
    return deck;
  }
  const deck = buildDeck();

  /* ------------------------------------------------------------------
     Per-voter draft (votes keyed by submitterId)
     ------------------------------------------------------------------ */
  const DRAFT_KEY = `aie.draft.${user.email}`;
  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const d = raw ? JSON.parse(raw) : {};
      /* Drop any drafted vote for the voter's own ideas (defensive). */
      if (ownId && d[ownId]) delete d[ownId];
      return d;
    } catch { return {}; }
  }
  function saveDraft(d) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }

  const state = {
    votes: loadDraft(),
    locked: false
  };

  (async () => {
    try {
      const status = await window.Auth.votingStatus();
      if (status && status.closed) {
        window.location.href = "results.html";
        return;
      }
      if (await window.Auth.hasVoted(user.email)) {
        state.locked = true;
        render();
      }
    } catch {}
  })();

  function castCount() {
    return eligibleSubmitters.filter(s => state.votes[s.id]).length;
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  /* ------------------------------------------------------------------
     Selection handler with 1-per-submitter railguard
     ------------------------------------------------------------------ */
  let warnTimer = null;
  function showWarning(msg) {
    const el = document.getElementById("vote-warning");
    if (!el) return;
    el.querySelector(".vote-warning-text").textContent = msg;
    el.dataset.show = "true";
    if (warnTimer) clearTimeout(warnTimer);
    warnTimer = setTimeout(() => { el.dataset.show = "false"; }, 4500);
  }
  function hideWarning() {
    const el = document.getElementById("vote-warning");
    if (el) el.dataset.show = "false";
  }

  function selectIdea(submitterId, ideaId) {
    if (state.locked) return;

    const current = state.votes[submitterId];

    /* Click the same card again → deselect. */
    if (current === ideaId) {
      delete state.votes[submitterId];
      saveDraft(state.votes);
      hideWarning();
      render();
      return;
    }

    /* Different idea, same submitter → railguard, do not change vote. */
    if (current && current !== ideaId) {
      showWarning("Only 1 product per person — you've already voted for one of this submitter's products. Please pick from a different submitter, or unselect your previous choice first.");
      flashLockedCard(submitterId, current);
      return;
    }

    /* Fresh selection. */
    state.votes[submitterId] = ideaId;
    saveDraft(state.votes);
    hideWarning();
    render();
  }

  /* Briefly highlight the user's existing pick so they can find/unselect it. */
  function flashLockedCard(submitterId, ideaId) {
    const el = document.querySelector(`.idea[data-submitter-id="${submitterId}"][data-idea-id="${ideaId}"]`);
    if (!el) return;
    el.classList.remove("idea-flash");
    void el.offsetWidth;
    el.classList.add("idea-flash");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function renderCard(idea, i) {
    const selected = state.votes[idea.submitterId] === idea.id;
    const tagline = idea.tagline ? `<div class="idea-tagline">${escapeHtml(idea.tagline)}</div>` : "";
    const teaser = idea.teaser
      ? `<p class="idea-teaser">${escapeHtml(idea.teaser)}</p>`
      : (idea.summary ? `<p class="idea-teaser">${escapeHtml(idea.summary)}</p>` : "");
    const bullets = Array.isArray(idea.bullets) && idea.bullets.length
      ? `<ul class="idea-bullets">${idea.bullets.slice(0, 3).map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
      : "";
    const subject = idea.subjectLine
      ? `<div class="idea-subject">
           <span class="idea-subject-label">Subject Line</span>
           <span class="idea-subject-line">"${escapeHtml(idea.subjectLine)}"</span>
         </div>`
      : "";
    const pitchBtn = idea.image
      ? `<button type="button" class="idea-pitchbtn" data-zoom="${idea.image}" data-zoom-title="${escapeHtml(idea.title)}" data-zoom-tag="${escapeHtml(idea.tagline || "")}">View full pitch</button>`
      : "";

    return `
      <label class="idea" data-selected="${selected}" data-idea-id="${idea.id}" data-submitter-id="${idea.submitterId}">
        <input type="radio" name="vote-${idea.submitterId}" value="${idea.id}" ${selected ? "checked" : ""} ${state.locked ? "disabled" : ""} />
        <div class="idea-body">
          <div class="idea-card-head">
            <span class="idea-bignum">${pad2(i + 1)}</span>
            <span class="idea-cat">${escapeHtml(idea.category || "")}</span>
          </div>
          <h3 class="idea-title">${escapeHtml(idea.title)}</h3>
          ${tagline}
          ${teaser}
          ${bullets}
          ${subject}
          ${pitchBtn}
          <div class="idea-foot">
            <span class="idea-num">№ ${pad2(i + 1)}</span>
            <span class="idea-impact" data-level="${idea.impact}">${escapeHtml(idea.impact || "")} Impact</span>
            <span class="idea-mark" aria-hidden="true"></span>
          </div>
        </div>
      </label>
    `;
  }

  function render() {
    const root = document.getElementById("submitters");
    root.innerHTML = `<div class="ideas-flat">${deck.map(renderCard).join("")}</div>`;

    const cast = castCount();
    document.getElementById("progress-count").textContent =
      `${pad2(cast)} / ${pad2(total)}`;
    document.getElementById("progress-fill").style.width =
      `${total ? (cast / total) * 100 : 0}%`;

    const ready = total > 0 && cast === total;
    const btn = document.getElementById("submit-btn");
    btn.dataset.ready = ready && !state.locked;
    btn.disabled = !(ready && !state.locked);
    btn.innerHTML = state.locked
      ? `Ballot locked <span class="arrow">✓</span>`
      : `Submit votes <span class="arrow">→</span>`;

    const status = document.getElementById("submit-status");
    if (state.locked) {
      status.innerHTML = `<span style="color:var(--gold)">●</span> Ballot recorded as <strong>${escapeHtml(user.name)}</strong>`;
    } else if (ready) {
      status.innerHTML = `<span style="color:var(--gold)">●</span> All votes cast — <strong>ready to submit</strong>`;
    } else {
      status.innerHTML = `<strong>${cast}</strong> of ${total} voted`;
    }

    /* Update sidebar meta if present. */
    const heroTotal = document.getElementById("hero-total-products");
    if (heroTotal) heroTotal.textContent = String(deck.length);
    const heroVotes = document.getElementById("hero-required-votes");
    if (heroVotes) heroVotes.textContent = `${total} required`;

    document.querySelectorAll(".idea").forEach(el => {
      el.addEventListener("click", evt => {
        if (evt.target.closest(".idea-zoom") || evt.target.closest(".idea-pitchbtn")) return;
        evt.preventDefault();
        selectIdea(el.dataset.submitterId, el.dataset.ideaId);
      });
    });

    document.querySelectorAll("[data-zoom]").forEach(el => {
      el.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        openLightbox(el.dataset.zoom, el.dataset.zoomTitle, el.dataset.zoomTag);
      });
      let preloaded = false;
      const prefetch = () => {
        if (preloaded) return;
        preloaded = true;
        const img = new Image();
        img.src = el.dataset.zoom;
      };
      el.addEventListener("mouseenter", prefetch);
      el.addEventListener("focus", prefetch);
    });
  }

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */
  function openLightbox(src, title, tag) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    document.getElementById("lightbox-title").textContent = title || "";
    document.getElementById("lightbox-tag").textContent = tag || "";
    lb.dataset.open = "true";
    lb.dataset.loading = "true";
    img.onload = () => { lb.dataset.loading = "false"; };
    img.onerror = () => { lb.dataset.loading = "false"; };
    img.src = src;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    lb.dataset.open = "false";
    document.getElementById("lightbox-img").src = "";
    document.body.style.overflow = "";
  }

  /* ------------------------------------------------------------------
     Submission
     ------------------------------------------------------------------ */
  async function onSubmit() {
    if (state.locked) return;
    if (castCount() !== total) return;

    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    btn.innerHTML = `Submitting <span class="arrow">...</span>`;

    /* Defense in depth: never submit a vote for the voter's own slot. */
    const cleanVotes = { ...state.votes };
    if (ownId) delete cleanVotes[ownId];

    const result = await window.Auth.submitBallot(user.email, {
      name: user.name,
      votes: cleanVotes
    });

    if (!result.success) {
      const status = document.getElementById("submit-status");
      status.innerHTML = `<span style="color:var(--rust)">●</span> ${result.error || "Submit failed"}`;
      btn.disabled = false;
      btn.innerHTML = `Try again <span class="arrow">→</span>`;
      return;
    }

    state.locked = true;
    clearDraft();
    document.getElementById("modal").dataset.open = "true";
    render();
  }
  async function closeModal() {
    document.getElementById("modal").dataset.open = "false";
    try {
      const status = await window.Auth.votingStatus();
      window.location.href = status && status.closed ? "results.html" : "prize.html";
    } catch {
      window.location.href = "prize.html";
    }
  }

  /* ------------------------------------------------------------------
     Identity chip
     ------------------------------------------------------------------ */
  function wireIdentity() {
    document.getElementById("identity-name").textContent = user.name;
    document.getElementById("signout").addEventListener("click", () => {
      window.Auth.signOut();
      window.location.href = "index.html";
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    wireIdentity();
    render();
    document.getElementById("submit-btn").addEventListener("click", onSubmit);
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal").addEventListener("click", e => {
      if (e.target.id === "modal") closeModal();
    });

    const dismiss = document.getElementById("vote-warning-dismiss");
    if (dismiss) dismiss.addEventListener("click", hideWarning);

    const lb = document.getElementById("lightbox");
    if (lb) {
      lb.addEventListener("click", e => {
        if (e.target === lb || e.target.id === "lightbox-close") closeLightbox();
      });
    }
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });
  });
})();
