/**
 * particles.js
 * Canvas 2D particle field — floating dots with mouse-repulsion
 * and connecting lines for the hero background.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Particle class ── */
  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.z     = Math.random();                              // depth 0..1
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = -(0.15 + Math.random() * 0.35) * (0.4 + this.z * 0.6);
      this.r     = 0.8 + this.z * 2;
      this.alpha = 0.15 + this.z * 0.5;
      const hues = [260, 320, 170];
      this.hue   = hues[Math.floor(Math.random() * hues.length)];
    }

    step() {
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion
      if (dist < 120) {
        const force = ((120 - dist) / 120) * 0.4;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      // Recycle off-screen
      if (this.y < -20 || this.x < -20 || this.x > W + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
      ctx.fill();
    }
  }

  /* ── Init ── */
  function initParticles() {
    const count = Math.min(200, Math.floor(W * H / 8000));
    particles   = Array.from({ length: count }, () => new Particle());
  }

  /* ── Connection lines ── */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 109, 250, ${(1 - d / 90) * 0.12})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Animation loop ── */
  let lastTime = 0;

  function loop(ts) {
    // Cap to ~60 fps
    if (ts - lastTime < 16) { requestAnimationFrame(loop); return; }
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  }

  /* ── Events ── */
  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) lastTime = performance.now();
  });

  /* ── Boot ── */
  resize();
  initParticles();
  requestAnimationFrame(loop);
})();
