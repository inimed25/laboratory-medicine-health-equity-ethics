// Optional participation recognition. No names or responses are transmitted.
(() => {
  const release = window.moduleRelease;
  document.querySelector('#release-label').textContent = `Version ${release.version} · Revised ${release.revisedLabel}`;
  const completion = document.querySelector('#completion-card');
  const mark = document.querySelector('#mark-complete');
  const status = document.querySelector('#acknowledgment-status');
  const dateText = iso => new Date(iso).toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'});
  function currentCompletion() {
    const value = progress.completion;
    return value?.version === release.version && Number.isFinite(Date.parse(value.date)) ? value : null;
  }
  window.renderParticipation = () => {
    completion.hidden = active !== sections.length - 1;
    const done = currentCompletion();
    document.querySelector('#completion-message').hidden = !done;
    document.querySelector('#acknowledgment-options').hidden = !done;
    mark.hidden = !!done;
    document.querySelector('#completion-date').textContent = done ? `Participation marked ${dateText(done.date)} · Version ${done.version}` : '';
    if (!done) { document.querySelector('#participant-name').value = ''; status.textContent = ''; }
  };
  mark.onclick = () => {
    progress.completion = {version:release.version,date:new Date().toISOString()};
    persist(); renderParticipation();
  };
  const esc = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function acknowledgmentHTML() {
    const done = currentCompletion();
    if (!done) return null;
    const name = document.querySelector('#participant-name').value.trim();
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acknowledgment of participation</title><style>body{font:18px/1.7 Georgia,serif;color:#172a3a;background:#f4f7fa;margin:0;padding:40px}main{max-width:760px;margin:24px auto;background:white;border:1px solid #cbd9dd;padding:48px}h1{font-size:30px;line-height:1.25;color:#172a3a}h2{font-size:24px;line-height:1.3}small{font:14px/1.6 system-ui,sans-serif}.name{font-size:28px;overflow-wrap:anywhere}.note{border-top:1px solid #cbd9dd;padding-top:20px}button{font:16px system-ui;padding:12px;background:#0f655f;color:white;border:0;border-radius:6px;cursor:pointer}button:focus-visible{outline:3px solid #9b5c00;outline-offset:3px}@media(max-width:600px){body{padding:12px}main{padding:24px}}@media print{@page{size:letter portrait;margin:.7in}body{background:white;padding:0}main{margin:0;border:0;padding:0;max-width:none}.no-print{display:none}}</style></head><body><main><h1>Acknowledgment of participation</h1>${name ? `<p class="name">${esc(name)}</p>` : '<p>The participant</p>'}<p>Reported completing their review of</p><h2>Laboratory Medicine, Health Equity, and Ethics</h2><p>A case-based educational module exploring diagnostic access, testing decisions, interpretation, and laboratory workflows.</p><p>Date: ${esc(dateText(done.date))}<br>Module version: ${esc(done.version)}<br>Module revised: ${esc(release.revisedLabel)}</p><p class="note"><small>This acknowledgment records self-reported participation. Completion and identity have not been independently verified. It does not confer CME credit or certify clinical competency. No minimum practice score is required.</small></p><p><small>Module: https://inimed25.github.io/laboratory-medicine-health-equity-ethics/</small></p><button class="no-print" onclick="window.print()">Print or save as PDF</button></main></body></html>`;
  }
  window.acknowledgmentHTML = acknowledgmentHTML;
  function download(text, type, filename) {
    const url = URL.createObjectURL(new Blob([text], {type}));
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  document.querySelector('#download-acknowledgment').onclick = () => {
    const html = acknowledgmentHTML(); if (!html) return;
    download(html, 'text/html;charset=utf-8', `laboratory-equity-participation-${release.version}.html`);
    status.textContent = 'Acknowledgment downloaded. Open it to read, print, or save as PDF.';
  };
  document.querySelector('#print-acknowledgment').onclick = () => {
    const html = acknowledgmentHTML(); if (!html) return;
    const preview = window.open('', '_blank');
    if (!preview) { status.textContent = 'The print window was blocked. Download the acknowledgment, open it, and choose Print or save as PDF.'; return; }
    preview.opener = null;
    preview.document.open(); preview.document.write(html); preview.document.close();
    status.textContent = 'Acknowledgment opened in a new window. Choose Print or save as PDF there.';
  };
  const feedbackDialog = document.querySelector('#feedback-dialog');
  function feedbackTemplate() {
    return `Module feedback or correction\n\nModule version: ${release.version}\nRevised: ${release.revisedLabel}\nSection: ${sections[active].label}\nQuestion (if applicable): \n\nWhat was unclear, incorrect, or difficult to use?\n\nSuggested improvement:\n\nSupporting source (optional):\n\nPlease do not include patient information, names, or private details.\nThis template has not been submitted. Share it with the person who provided the module or use the public GitHub issue tracker.\n`;
  }
  document.querySelector('#feedback-open').onclick = () => {
    document.querySelector('#feedback-context').textContent = `Current section: ${sections[active].label} · Version ${release.version}`;
    const url = new URL('https://github.com/inimed25/laboratory-medicine-health-equity-ethics/issues/new');
    url.searchParams.set('title', `Module feedback · ${sections[active].label}`);
    url.searchParams.set('body', feedbackTemplate());
    document.querySelector('#feedback-github').href = url.toString();
    feedbackDialog.showModal();
  };
  document.querySelector('#feedback-close').onclick = () => {feedbackDialog.close();document.querySelector('#feedback-open').focus();};
  document.querySelector('#download-feedback').onclick = () => download(feedbackTemplate(),'text/plain;charset=utf-8','laboratory-equity-feedback.txt');
  renderParticipation();
})();
