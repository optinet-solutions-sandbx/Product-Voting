/* Results page — fetches the closed-voting results and renders the
   winning idea per submitter. If voting is still open, redirects to
   the ballot.                                                         */
(function () {
  "use strict";

  const submitters = window.SUBMITTERS;

  /* Build a quick lookup: submitter slug → submitter object */
  const bySlug = {};
  submitters.forEach(s => { bySlug[s.id] = s; });

  /* And a lookup: idea id → idea object (with its submitter) */
  const ideaBySlug = {};
  submitters.forEach(s => {
    (s.ideas || []).forEach(i => { ideaBySlug[i.id] = { ...i, submitter: s }; });
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  /* ------------------------------------------------------------------
     Lightbox (mirrors voting.js behavior)
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
     Render
     ------------------------------------------------------------------ */
  function renderClosedReason(reason) {
    const eyebrow = document.getElementById("results-eyebrow");
    if (reason === "all_voted") eyebrow.textContent = "— All ballots cast —";
    else if (reason === "deadline") eyebrow.textContent = "— Deadline reached —";
    else if (reason === "manual") eyebrow.textContent = "— Voting closed —";
  }

  function renderStillOpen(state) {
    const root = document.getElementById("results-root");
    const cast = state.totalBallots || 0;
    const ballotWord = cast === 1 ? "ballot" : "ballots";
    document.getElementById("results-eyebrow").textContent = "— Voting still open —";
    document.querySelector(".results-hero h1").innerHTML =
      `Results aren't<br /><em>in yet.</em>`;
    document.getElementById("results-lede").textContent =
      `${cast} ${ballotWord} cast so far. When the timer runs out, this page reveals the winning idea per teammate.`;
    document.getElementById("stat-ballots").textContent = pad2(cast);

    root.innerHTML = `
      <div style="text-align:center; padding:5rem 0;">
        <a href="vote.html" class="topbar-link" style="display:inline-flex;">
          Cast your ballot <span class="arrow">→</span>
        </a>
      </div>
    `;
  }

  function renderResults(payload) {
    document.getElementById("stat-ballots").textContent = pad2(payload.totalBallots || 0);
    renderClosedReason(payload.reason);

    const winners = payload.winners || {};
    const root = document.getElementById("results-root");

    /* Maintain the submitter order from data.js (= activity order in app) */
    const cards = submitters
      .filter(s => !s.pending)
      .map((s, idx) => {
        const w = winners[s.id];
        if (!w || !w.ideaId) {
          return `
            <article class="result-card">
              <div class="result-card-head">
                <span class="result-rank">${pad2(idx + 1)}</span>
                <div class="result-submitter">
                  <div class="result-submitter-name">${escapeHtml(s.name)}</div>
                  ${s.role ? `<div class="result-submitter-role">${escapeHtml(s.role)}</div>` : ""}
                </div>
              </div>
              <span class="result-winner-tag">No votes received</span>
              <div class="result-stats">
                <span class="result-vote-count">0 <small>votes</small></span>
              </div>
            </article>
          `;
        }
        const idea = ideaBySlug[w.ideaId];
        if (!idea) {
          return `
            <article class="result-card">
              <div class="result-card-head">
                <span class="result-rank">${pad2(idx + 1)}</span>
                <div class="result-submitter">
                  <div class="result-submitter-name">${escapeHtml(s.name)}</div>
                </div>
              </div>
              <span class="result-winner-tag">Winner</span>
              <h3 class="result-title">${escapeHtml(w.ideaId)}</h3>
              <div class="result-stats">
                <span class="result-vote-count">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></span>
              </div>
            </article>
          `;
        }
        const tieBadge = w.tie ? `<span class="result-tie">Tied — alphabetical</span>` : "";
        const pitchBtn = idea.image
          ? `<button class="result-pitchbtn" data-zoom="${idea.image}" data-zoom-title="${escapeHtml(idea.title)}" data-zoom-tag="${escapeHtml(idea.tagline || '')}">View pitch ⤢</button>`
          : "";
        return `
          <article class="result-card">
            <div class="result-card-head">
              <span class="result-rank">${pad2(idx + 1)}</span>
              <div class="result-submitter">
                <div class="result-submitter-name">${escapeHtml(s.name)}</div>
                ${s.role ? `<div class="result-submitter-role">${escapeHtml(s.role)}</div>` : ""}
              </div>
            </div>
            <span class="result-winner-tag">Winner · ${escapeHtml(idea.category || "")}</span>
            <h3 class="result-title">${escapeHtml(idea.title)}</h3>
            <div class="result-tagline">${escapeHtml(idea.tagline || "")}</div>
            <div class="result-stats">
              <span class="result-vote-count">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></span>
              ${tieBadge}
              ${pitchBtn}
            </div>
          </article>
        `;
      })
      .join("");

    root.innerHTML = `<div class="results-grid">${cards}</div>`;

    /* Wire lightbox triggers + hover preload */
    document.querySelectorAll("[data-zoom]").forEach(el => {
      el.addEventListener("click", evt => {
        evt.preventDefault();
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
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", async () => {
    /* Lightbox close handlers */
    const lb = document.getElementById("lightbox");
    if (lb) {
      lb.addEventListener("click", e => {
        if (e.target === lb || e.target.id === "lightbox-close") closeLightbox();
      });
    }
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });

    /* If no backend, show the still-open state with localStorage data */
    if (!window.Auth.hasBackend()) {
      renderStillOpen({ totalBallots: 0, expected: 11 });
      return;
    }

    const payload = await window.Auth.votingResults();
    if (!payload || !payload.success) {
      /* Either still open, or error */
      renderStillOpen(payload || {});
      return;
    }
    renderResults(payload);
  });
})();
