/* Voting dashboard — anonymized per-row ballot.
   Each row groups one submitter's three products together (so the
   "1 product per submitter" rule is visually obvious) but the
   submitter's name and role are hidden. Row order is a deterministic
   shuffle seeded from the voter's email — same voter sees the same
   order on reload, different voters see different orderings.        */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Auth gate
     ------------------------------------------------------------------ */
  const user = window.Auth.requireUser("index.html");
  if (!user) return;

  /* ------------------------------------------------------------------
     Resolve the voter's own submitter slot (if they have one) so we
     can drop their three products from the ballot.
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

  /* ------------------------------------------------------------------
     Deterministic per-voter shuffle (djb2 → LCG).
     ------------------------------------------------------------------ */
  function seedFromEmail(email) {
    let h = 5381;
    const s = String(email || "").toLowerCase();
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) + h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) || 1;
  }
  function shuffleSeeded(arr, seed) {
    const a = arr.slice();
    let x = seed;
    for (let i = a.length - 1; i > 0; i--) {
      x = (x * 1103515245 + 12345) & 0x7fffffff;
      const j = x % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const eligibleSubmitters = submitters.filter(s => !s.pending && s.id !== ownId);
  const orderedSubmitters = shuffleSeeded(eligibleSubmitters, seedFromEmail(user.email));
  const total = orderedSubmitters.length;
  const totalProducts = orderedSubmitters.reduce((n, s) => n + s.ideas.length, 0);

  /* ------------------------------------------------------------------
     Per-voter draft (votes keyed by submitterId)
     ------------------------------------------------------------------ */
  const DRAFT_KEY = `aie.draft.${user.email}`;
  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const d = raw ? JSON.parse(raw) : {};
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

  const state = { votes: loadDraft(), locked: false };

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

  /* Click another card in the same row → silently swap. Clicking the
     already-selected card → deselect. The row layout itself enforces
     "1 vote per submitter" so no toast is needed. */
  function selectIdea(submitterId, ideaId) {
    if (state.locked) return;
    if (state.votes[submitterId] === ideaId) {
      delete state.votes[submitterId];
    } else {
      state.votes[submitterId] = ideaId;
    }
    saveDraft(state.votes);
    render();
  }

  function castCount() {
    return orderedSubmitters.filter(s => state.votes[s.id]).length;
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function renderIdeaCard(idea, i, submitterId, choice) {
    const selected = choice === idea.id;
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
      <label class="idea" data-selected="${selected}" data-idea-id="${idea.id}" data-submitter-id="${submitterId}">
        <input type="radio" name="vote-${submitterId}" value="${idea.id}" ${selected ? "checked" : ""} ${state.locked ? "disabled" : ""} />
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

  function renderRow(s, idx) {
    const choice = state.votes[s.id];
    const voted = !!choice;
    /* Shuffle the 3 ideas per (voter, submitter) pair — same voter sees
       the same order on reload, but different voters see different
       orderings even within the same row. Card position (01/02/03) no
       longer leaks "this is the submitter's first idea". */
    const rowSeed = seedFromEmail(user.email + ":" + s.id);
    const shuffledIdeas = shuffleSeeded(s.ideas, rowSeed);
    const ideas = shuffledIdeas.map((idea, i) => renderIdeaCard(idea, i, s.id, choice)).join("");
    return `
      <article class="submitter submitter-anon" data-voted="${voted}" id="s-${s.id}">
        <header class="submitter-rail">
          <div class="submitter-index">${pad2(idx + 1)}</div>
          <div class="submitter-anonhead">
            <div class="submitter-anonlabel">Pick one</div>
            <div class="submitter-anonsub">3 products · 1 vote</div>
          </div>
          <div class="submitter-status">
            <span class="dot"></span>
            <span>${voted ? "Vote cast" : "Awaiting vote"}</span>
          </div>
        </header>
        <div class="ideas">${ideas}</div>
      </article>
    `;
  }

  function render() {
    const root = document.getElementById("submitters");
    root.innerHTML = orderedSubmitters.map(renderRow).join("");

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

    const heroTotal = document.getElementById("hero-total-products");
    if (heroTotal) heroTotal.textContent = String(totalProducts);
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
