// Supply names, semantics and focus after a staged interaction.
(() => {
  document.querySelectorAll('th').forEach(th => { if (!th.hasAttribute('scope')) th.scope = 'col'; });
  document.querySelectorAll('.table-wrap').forEach((el, i) => {
    el.tabIndex = 0; el.setAttribute('role', 'region');
    el.setAttribute('aria-label', `Case table ${i + 1}; scroll horizontally if needed`);
  });
  document.querySelectorAll('.question').forEach((form, i) => {
    const heading = form.querySelector('h3');
    if (heading) { heading.id ||= `question-heading-${i + 1}`; form.setAttribute('aria-labelledby', heading.id); }
    const legend = form.querySelector('legend');
    const stem = form.querySelector('h3 + p');
    if (legend && stem) legend.textContent = stem.textContent + ' Choose one answer.';
  });
  document.querySelectorAll('.feedback,.match-feedback').forEach(el => {
    el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
  });
  const main = document.querySelector('main');
  if (main && parent.moduleRelease) {
    const note = document.createElement('p'); note.className = 'module-version';
    note.textContent = `Version ${parent.moduleRelease.version} · Revised ${parent.moduleRelease.revisedLabel}`;
    main.appendChild(note);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !(button.matches('.skip-question,.continue,#reveal,#follow') || button.dataset.next)) return;
    // Existing handlers reveal the next stage before the bubbling event arrives.
    // Prefer the newly available stage or the next visible question after this form.
    requestAnimationFrame(() => {
      if (document.activeElement !== button && document.activeElement !== document.body && !button.hidden) return;
      let candidates = [...document.querySelectorAll('h2,h3,button')].filter(el=>el.getClientRects().length && (button.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
      const next = candidates.find(el=>el.matches('h2,h3')) || candidates[0];
      if (next) { if (!next.matches('button')) next.tabIndex = -1; next.focus({preventScroll:true}); }
    });
  });
})();
