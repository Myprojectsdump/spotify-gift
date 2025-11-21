// assets/js/common.js
// Shared helpers: confetti, simple navigation, small visual tools.
// Drop this on every page <script src="D:/spotify-gift/assets/js/common.js"></script>

(function () {
  // --- Confetti system (robust, full-window, rAF)
  const Confetti = (function () {
    let canvas, ctx, pieces = [], animId = null, running = false;

    function createCanvas() {
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "confetti-full";
        canvas.style.position = "fixed";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "9999";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        resize();
        window.addEventListener("resize", resize);
      }
    }

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makePieces(count) {
      pieces = [];
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const palette = ["#FFD400", "#FFE54D", "#FFB400", "#000000", "#FFF8BF"];
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * w,
          y: Math.random() * -h,
          w: 6 + Math.random() * 12,
          h: 8 + Math.random() * 14,
          vy: 2 + Math.random() * 6,
          vx: -2 + Math.random() * 4,
          rot: Math.random() * 360,
          rv: -6 + Math.random() * 12,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rv;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        // recycle
        if (p.y > canvas.clientHeight + 40 || p.x < -40 || p.x > canvas.clientWidth + 40) {
          p.y = -20 - Math.random() * 200;
          p.x = Math.random() * canvas.clientWidth;
        }
      }
      animId = requestAnimationFrame(step);
    }

    function start({count = 120, duration = 3000} = {}) {
      createCanvas();
      if (running) return;
      makePieces(count);
      running = true;
      animId = requestAnimationFrame(step);
      // Auto-stop after duration
      setTimeout(() => stop(), duration);
    }

    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animId);
      animId = null;
      if (ctx) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    return { start, stop };
  })();

  // Attach to window
  window.ConfettiSystem = Confetti;

  // --- Tiny page helper: animated route push
  window.goTo = function (href) {
    document.documentElement.style.transition = "opacity 280ms ease";
    document.documentElement.style.opacity = "0";
    setTimeout(() => {
      window.location.href = href;
    }, 280);
  };

  // On initial load fade in
  window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.opacity = "0";
    setTimeout(() => {
      document.documentElement.style.transition = "opacity 420ms ease";
      document.documentElement.style.opacity = "1";
    }, 30);
  });

  // small escape helper for insertion-safe text
  window.esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
})();
