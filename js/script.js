/**
 * script.js
 * General UI behaviour:
 *  - Scroll-reveal (IntersectionObserver)
 *  - Active nav link highlighting
 *  - Mobile nav toggle (if hamburger is added later)
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     SCROLL REVEAL
     Adds .visible to any element with .reveal
     when it enters the viewport.
  ══════════════════════════════════════════ */
  let revealObserver;

  function observeReveal() {
    const targets = document.querySelectorAll('.reveal:not(.visible)');
    if (!targets.length) return;

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }

    targets.forEach(el => revealObserver.observe(el));
  }

  // Expose for prompts.js to call after cards are inserted
  window.observeReveal = observeReveal;

  // Observe elements already in the DOM on load
  document.addEventListener('DOMContentLoaded', observeReveal);


  /* ══════════════════════════════════════════
     ACTIVE NAV HIGHLIGHTING
     Highlights the nav link whose section
     is currently in view.
  ══════════════════════════════════════════ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const isActive = link.getAttribute('href') === `#${id}`;
              link.style.color = isActive ? 'var(--text)' : '';
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => sectionObserver.observe(s));
  }


  /* ══════════════════════════════════════════
     SMOOTH SCROLL — polyfill fallback
     (handles browsers without CSS scroll-behavior)
  ══════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }


  /* ══════════════════════════════════════════
     NAV SCROLL SHADOW
     Adds a stronger shadow to nav once user
     has scrolled past the hero.
  ══════════════════════════════════════════ */
  function initNavShadow() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initActiveNav();
    initSmoothScroll();
    initNavShadow();
  });
})();
