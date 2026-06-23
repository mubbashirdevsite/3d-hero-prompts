/**
 * prompts.js
 * Fetches prompts.json, renders prompt cards into #prompt-grid,
 * and wires up the copy-to-clipboard buttons.
 */

(function () {
  'use strict';

  /* ── HTML escape helpers ── */
  function escHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escAttr(s) {
    return s.replace(/"/g, '&quot;');
  }

  /* ── Build a single card element ── */
  function buildCard(p) {
    const card = document.createElement('div');
    card.className = 'prompt-card reveal';

    card.innerHTML = `
      <div class="card-tag ${p.tag}">${escHtml(p.tagLabel)}</div>
      <div class="card-title">${escHtml(p.title)}</div>
      <div class="card-desc">${escHtml(p.desc)}</div>
      <div class="card-prompt">${escHtml(p.prompt)}</div>
      <button class="copy-btn" data-prompt="${escAttr(p.prompt)}">
        ${copyIcon()}
        Copy prompt
      </button>
    `;

    return card;
  }

  /* ── SVG icons ── */
  function copyIcon() {
    return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
      <path d="M2 10V2h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function checkIcon() {
    return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  /* ── Copy button handler ── */
  async function handleCopy(btn) {
    const text = btn.dataset.prompt;

    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.innerHTML = `${checkIcon()} Copied!`;
    } catch {
      // Fallback for browsers without clipboard API
      btn.textContent = 'Select & copy manually';
    }

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `${copyIcon()} Copy prompt`;
    }, 2000);
  }

  /* ── Render cards into the grid ── */
  function renderCards(prompts) {
    const grid = document.getElementById('prompt-grid');
    if (!grid) return;

    prompts.forEach(p => grid.appendChild(buildCard(p)));

    // Trigger scroll reveal after insert
    if (typeof observeReveal === 'function') observeReveal();
  }

  /* ── Delegated click listener for all copy buttons ── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.copy-btn');
    if (btn) handleCopy(btn);
  });

  /* ── Load data ── */
  fetch('data/prompts.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(renderCards)
    .catch(err => {
      console.error('Failed to load prompts.json:', err);
      const grid = document.getElementById('prompt-grid');
      if (grid) {
        grid.innerHTML = `<p style="color:var(--muted); grid-column:1/-1;">
          Could not load prompts. Make sure you're running this via a local server
          (e.g. <code>npx serve .</code>) so fetch() can read the JSON file.
        </p>`;
      }
    });
})();
