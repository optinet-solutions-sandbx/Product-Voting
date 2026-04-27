/* Voting dashboard — selection state + render + ballot recording per voter.
   Cards now show a hero pitch image, a numbered badge, and open the full
   pitch in a lightbox. Pending submitters render as placeholder slots.   */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Auth gate
     ------------------------------------------------------------------ */
  const user = window.Auth.requireUser("index.html");
  if (!user) return;

  /* ------------------------------------------------------------------
     Per-voter draft + total (excludes pending submitters).
     ------------------------------------------------------------------ */
  const DRAFT_KEY = `aie.draft.${user.email}`;
  const submitters = window.SUBMITTERS;
  const activeSubmitters = submitters.filter(s => !s.pending);
  const total = activeSubmitters.length;

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveDraft(d) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }

  /* Lock check: if backend is configured, see if this email already voted
     OR if voting has closed entirely. */
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

  function selectIdea(submitterId, ideaId) {
    if (state.locked) return;
    state.votes[submitterId] = ideaId;
    saveDraft(state.votes);
    render();
  }

  function castCount() {
    return activeSubmitters.filter(s => state.votes[s.id]).length;
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  /* Numbered glyphs for the image badge. */
  const numGlyph = ["①", "②", "③"];

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function renderPending(s, idx) {
    return `
      <article class="submitter" data-pending="true" id="s-${s.id}">
        <header class="submitter-rail">
          <div class="submitter-index">${pad2(idx + 1)}</div>
          <div>
            <div class="submitter-name">Awaiting submission</div>
            <div class="submitter-role">— pending —</div>
          </div>
          <div class="submitter-status">
            <span class="dot"></span>
            <span>Slot reserved</span>
          </div>
        </header>
        <div class="submitter-pending">
          <span>Submission pending.</span>
          <span>Once received, three pitch cards will appear here.</span>
        </div>
      </article>
    `;
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

  function renderActive(s, idx) {
    const choice = state.votes[s.id];
    const voted = !!choice;
    const ideas = s.ideas.map((idea, i) => renderIdeaCard(idea, i, s.id, choice)).join("");
    const role = s.role ? `<div class="submitter-role">${escapeHtml(s.role)}</div>` : "";
    return `
      <article class="submitter" data-voted="${voted}" id="s-${s.id}">
        <header class="submitter-rail">
          <div class="submitter-index">${pad2(idx + 1)}</div>
          <div>
            <div class="submitter-name">${escapeHtml(s.name)}</div>
            ${role}
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

  function renderSubmitter(s, idx) {
    return s.pending ? renderPending(s, idx) : renderActive(s, idx);
  }

  function render() {
    const root = document.getElementById("submitters");
    root.innerHTML = submitters.map(renderSubmitter).join("");

    const cast = castCount();
    document.getElementById("progress-count").textContent =
      `${pad2(cast)} / ${pad2(total)}`;
    document.getElementById("progress-fill").style.width =
      `${total ? (cast / total) * 100 : 0}%`;

    /* Submit is only ready when every slot is filled (no pending) and every
       active submitter has been voted on. */
    const allFilled = submitters.length === total;
    const ready = allFilled && total > 0 && cast === total;
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
      const pendingCount = submitters.length - total;
      const tail = pendingCount
        ? ` · <span style="color:var(--bone-faint)">${pendingCount} slot${pendingCount === 1 ? "" : "s"} pending</span>`
        : "";
      status.innerHTML = `<strong>${cast}</strong> of ${total} voted${tail}`;
    }

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
    });
  }

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */
  function openLightbox(src, title, tag) {
    const lb = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox-title").textContent = title || "";
    document.getElementById("lightbox-tag").textContent = tag || "";
    lb.dataset.open = "true";
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

    const result = await window.Auth.submitBallot(user.email, {
      name: user.name,
      votes: { ...state.votes }
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
    /* If the user's ballot was the one that closed voting, jump straight to
       the results page; otherwise show the prize hype page. */
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

    /* Lightbox handlers */
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
