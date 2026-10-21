// Runs inside each same-origin section frame after its interaction handlers.
(() => {
  const generation = parent.moduleGeneration;
  const section = Number(document.documentElement.dataset.section);
  const elements = [...document.querySelectorAll('body *')];
  const controls = [...document.querySelectorAll('input, select')];
  const forms = [...document.querySelectorAll('form')];
  let restoring = true;
  const saved = parent.readSection(section);
  const submittedChoices = [...(saved?.submittedChoices || [])];
  if (saved) {
    controls.forEach((el, i) => {
      const value = saved.controls?.[i];
      if (!value) return;
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = !!value.checked;
      else el.value = value.value;
    });
    forms.forEach((form, i) => {
      if (saved.submitted?.[i]) {
        const choice = [...form.querySelectorAll('input')].find(el => el.value === submittedChoices[i]);
        if (choice) choice.checked = true;
        form.requestSubmit();
      }
    });
    // Preserve a changed but unsubmitted selection without rescoring it.
    controls.forEach((el, i) => {
      if ((el.type === 'radio' || el.type === 'checkbox') && saved.controls?.[i]) el.checked = !!saved.controls[i].checked;
    });
    if (section === 1 && Number.isInteger(saved.beat)) show(saved.beat);
    // Reapply the revealed stages after regenerating answer/matching feedback.
    elements.forEach((el, i) => {
      if (saved.revision === document.documentElement.dataset.revision && Array.isArray(saved.hidden)) el.hidden = !!saved.hidden[i];
      if (saved.revision === document.documentElement.dataset.revision && el.tagName === 'DETAILS') el.open = !!saved.open?.[i];
    });
    requestAnimationFrame(() => window.scrollTo(0, saved.scroll || 0));
  }
  restoring = false;
  function save() {
    if (restoring) return;
    parent.saveSection(section, {
      revision: document.documentElement.dataset.revision,
      controls: controls.map(el => ({ value: el.value, checked: el.checked })),
      submittedChoices,
      results: forms.map(form => form.matches('[data-key]') ? (form.dataset.result || null) : null),
      submitted: forms.map(form => !!form.dataset.result || !!form.querySelector('.match-feedback:not([hidden])')),
      hidden: elements.map(el => el.hidden),
      open: elements.map(el => el.tagName === 'DETAILS' && el.open),
      beat: section === 1 ? current : undefined,
      scroll: window.scrollY
    }, generation);
  }
  let timer;
  function queueSave() { clearTimeout(timer); timer = setTimeout(save, 80); }
  document.addEventListener('change', queueSave);
  document.addEventListener('click', queueSave);
  document.addEventListener('submit', event => {
    const i = forms.indexOf(event.target);
    const choice = event.target.querySelector('input:checked');
    if (i >= 0 && choice && event.target.dataset.result) submittedChoices[i] = choice.value;
    queueSave();
  });
  document.addEventListener('toggle', queueSave, true);
  window.addEventListener('scroll', queueSave, { passive: true });
  window.addEventListener('pagehide', save);
  // Flush before the parent hides the frame, including very recent input.
  window.saveModuleProgress = save;
})();
