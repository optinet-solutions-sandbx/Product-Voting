/* Prize page — confetti burst + countdown timer. */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
     Confetti burst on load (canvas)
     ------------------------------------------------------------------- */

  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const colors = [
    "#D4A85A",
    "#F4C76E",
    "#FFF5D4",
    "#B6451E",
    "#F2EDE4",
    "#8A6A2C"
  ];

  const particles = [];

  function burst(originX, originY, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (0.5 + Math.random() * 0.6),
        vy: Math.sin(angle) * speed * (0.5 + Math.random() * 0.6) - 8,
        g: 0.22 + Math.random() * 0.12,
        size: 4 + Math.random() * 8,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.55 ? "rect" : "circle",
        alpha: 1,
        decay: 0.004 + Math.random() * 0.006
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.g;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > H + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }

  /* Multi-stage burst sequence */
  function launch() {
    const cx = W / 2;
    const cy = H * 0.35;
    burst(cx, cy, 140);
    setTimeout(() => burst(W * 0.2, cy, 60), 200);
    setTimeout(() => burst(W * 0.8, cy, 60), 380);
    setTimeout(() => burst(cx, cy + 80, 80), 700);
  }

  /* Allow re-trigger via "Trigger again" button */
  const reTrigger = document.getElementById("retrigger");
  if (reTrigger) reTrigger.addEventListener("click", launch);

  /* -------------------------------------------------------------------
     Number ticker — €1,000 counts up on first reveal
     ------------------------------------------------------------------- */

  const amountEl = document.getElementById("amount");
  if (amountEl) {
    const target = 1000;
    let current = 0;
    const duration = 1600;
    const start = performance.now() + 700; // delay so it lines up with fadeUp

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
      const elapsed = now - start;
      if (elapsed < 0) {
        amountEl.innerHTML = `<sup>€</sup>0`;
        requestAnimationFrame(step);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      current = Math.round(easeOutCubic(t) * target);
      amountEl.innerHTML = `<sup>€</sup>${current.toLocaleString("en-US")}`;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    launch();
    requestAnimationFrame(tick);
  });
})();
