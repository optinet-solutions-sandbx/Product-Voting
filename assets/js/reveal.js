/* Reveal page — dramatic post-voting showcase.
   Renders top 3 winners (by vote count) on a podium, then the rest in
   a grid. Two modes:
     • ?preview=1 — bake mock data, no backend call. For local previews.
     • default   — fetch from the backend; redirect to vote.html if voting
                   is still open.                                         */
(function () {
  "use strict";

  const submitters = window.SUBMITTERS;

  /* Lookups */
  const bySlug = {};
  submitters.forEach(s => { bySlug[s.id] = s; });
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
     Mock payload — used when ?preview=1 in URL.
     Mirrors the shape the backend returns from ?action=results.
     Vote counts roughly match the master's "strongest contest picks"
     so the podium order is realistic.
     ------------------------------------------------------------------ */
  function buildMockPayload() {
    const winnerByLine = {
      jose:   { ideaId: "jose-02",       votes: 6 },  // NoShowGuard
      ianjay: { ideaId: "ianjay-permit", votes: 8 },  // PermitProfit
      revo:   { ideaId: "revo-promo",    votes: 4 },  // Promo Page Generator
      jas:    { ideaId: "jas-list",      votes: 7 },  // List Liquidator
      cathy:  { ideaId: "cathy-02",      votes: 5 },  // LeakyFunnel
      ralph:  { ideaId: "ralph-ghost",   votes: 9 },  // Ghost Job Detector
      sere:   { ideaId: "sere-01",       votes: 6 },  // Auto-Reputation Manager
      leo:    { ideaId: "leo-02",        votes: 5 },  // BrokenBonus Detector
      ivan:   { ideaId: "ivan-01",       votes: 4 },  // DentalDesk
      john:   { ideaId: "john-menu",     votes: 10 }, // MenuLift (top pick)
      chris:  { ideaId: "chris-03",      votes: 8 }   // Website Redesign
    };
    const winners = {};
    Object.entries(winnerByLine).forEach(([slug, w]) => {
      winners[slug] = { ideaId: w.ideaId, votes: w.votes, tie: false, tiedIds: [w.ideaId] };
    });
    return {
      success: true,
      closed: true,
      reason: "all_voted",
      totalBallots: 11,
      expected: 11,
      winners
    };
  }

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  function rankReason(reason) {
    if (reason === "all_voted") return "— All ballots cast —";
    if (reason === "deadline")  return "— Deadline reached —";
    if (reason === "manual")    return "— Voting closed —";
    return "— The verdict is in —";
  }

  function podiumCard(rank, slug, w) {
    const idea = ideaBySlug[w.ideaId];
    const submitter = bySlug[slug];
    const medal = rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze";

    if (!idea) {
      return `
        <article class="reveal-podium-card" data-rank="${rank}">
          <div class="reveal-podium-rank"><span class="reveal-medal">${medal}</span><span class="reveal-rank-num">${pad2(rank)}</span></div>
          <span class="reveal-pill">Winner</span>
          <h3 class="reveal-podium-title">${escapeHtml(w.ideaId)}</h3>
          <div class="reveal-podium-votes">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></div>
        </article>
      `;
    }

    const img = idea.image
      ? `<button class="reveal-podium-img" data-zoom="${idea.image}" data-zoom-title="${escapeHtml(idea.title)}" data-zoom-tag="${escapeHtml(idea.tagline || '')}" aria-label="View full pitch">
           <img src="${idea.image}" alt="" loading="lazy" />
           <span class="reveal-podium-img-cta">View full pitch ⤢</span>
         </button>`
      : "";

    return `
      <article class="reveal-podium-card" data-rank="${rank}">
        <div class="reveal-podium-rank">
          <span class="reveal-medal">${medal}</span>
          <span class="reveal-rank-num">${pad2(rank)}</span>
        </div>
        ${img}
        <div class="reveal-podium-body">
          <span class="reveal-pill">${escapeHtml(idea.category || "Winner")}</span>
          <h3 class="reveal-podium-title">${escapeHtml(idea.title)}</h3>
          <div class="reveal-podium-tagline">${escapeHtml(idea.tagline || "")}</div>
          <div class="reveal-podium-meta">
            <span class="reveal-podium-submitter">Pitched by <strong>${escapeHtml(submitter.name)}</strong></span>
            <span class="reveal-podium-votes">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></span>
          </div>
        </div>
      </article>
    `;
  }

  function gridCard(rank, slug, w) {
    const idea = ideaBySlug[w.ideaId];
    const submitter = bySlug[slug];
    if (!idea) {
      return `
        <article class="reveal-card">
          <div class="reveal-card-head">
            <span class="reveal-card-rank">${pad2(rank)}</span>
            <span class="reveal-card-submitter">${escapeHtml(submitter ? submitter.name : slug)}</span>
          </div>
          <h3 class="reveal-card-title">${escapeHtml(w.ideaId)}</h3>
          <div class="reveal-card-foot">
            <span class="reveal-card-votes">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></span>
          </div>
        </article>
      `;
    }
    const pitchBtn = idea.image
      ? `<button class="reveal-card-pitch" data-zoom="${idea.image}" data-zoom-title="${escapeHtml(idea.title)}" data-zoom-tag="${escapeHtml(idea.tagline || '')}">View pitch ⤢</button>`
      : "";
    return `
      <article class="reveal-card">
        <div class="reveal-card-head">
          <span class="reveal-card-rank">${pad2(rank)}</span>
          <span class="reveal-card-cat">${escapeHtml(idea.category || "")}</span>
        </div>
        <h3 class="reveal-card-title">${escapeHtml(idea.title)}</h3>
        <div class="reveal-card-tagline">${escapeHtml(idea.tagline || "")}</div>
        <div class="reveal-card-foot">
          <span class="reveal-card-submitter">By <strong>${escapeHtml(submitter.name)}</strong></span>
          <span class="reveal-card-votes">${w.votes} <small>${w.votes === 1 ? "vote" : "votes"}</small></span>
        </div>
        ${pitchBtn}
      </article>
    `;
  }

  function renderResults(payload) {
    document.getElementById("reveal-eyebrow").textContent = rankReason(payload.reason);
    document.getElementById("stat-ballots").textContent = pad2(payload.totalBallots || 0);

    /* Sort all winners (one per submitter) by vote count desc, tie-break
       alphabetically by submitter slug for determinism. */
    const ranked = submitters
      .filter(s => !s.pending)
      .map(s => ({ slug: s.id, w: payload.winners[s.id] || { ideaId: null, votes: 0 } }))
      .sort((a, b) => (b.w.votes - a.w.votes) || a.slug.localeCompare(b.slug));

    document.getElementById("stat-winners").textContent = String(ranked.length);

    const top3 = ranked.slice(0, 3);
    const rest = ranked.slice(3);

    document.getElementById("reveal-podium").innerHTML =
      top3.map((entry, i) => podiumCard(i + 1, entry.slug, entry.w)).join("");

    document.getElementById("reveal-grid").innerHTML =
      rest.map((entry, i) => gridCard(i + 4, entry.slug, entry.w)).join("");

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

  function renderStillOpen(state) {
    document.getElementById("reveal-eyebrow").textContent = "— Voting still open —";
    document.querySelector(".reveal-hero h1").innerHTML = `Results aren't<br /><em>in yet.</em>`;
    document.getElementById("reveal-lede").innerHTML =
      `${state.totalBallots || 0} of ${state.expected || 11} ballots cast so far. ` +
      `Once everyone votes, the top three light up here.`;
    document.getElementById("stat-ballots").textContent = pad2(state.totalBallots || 0);
    document.getElementById("reveal-podium").innerHTML = `
      <div class="reveal-loading-cta">
        <a href="vote.html" class="topbar-link" style="display:inline-flex;">
          Cast your ballot <span class="arrow">→</span>
        </a>
      </div>
    `;
    document.getElementById("reveal-grid").innerHTML = "";
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

    /* Preview mode — local previews without waiting for live vote close. */
    const params = new URLSearchParams(location.search);
    if (params.has("preview")) {
      renderResults(buildMockPayload());
      return;
    }

    /* No backend wired — show still-open with empty state. */
    if (!window.Auth.hasBackend()) {
      renderStillOpen({ totalBallots: 0, expected: 11 });
      return;
    }

    const payload = await window.Auth.votingResults();
    if (!payload || !payload.success) {
      renderStillOpen(payload || {});
      return;
    }
    renderResults(payload);
  });
})();
