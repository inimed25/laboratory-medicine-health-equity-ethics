const storageKey = 'lab-equity-module-progress-v1';
let progress = { active: 0, visited: [0], sections: {} };
let storageAvailable = true;
try {
  localStorage.setItem(storageKey + '-probe', '1');
  localStorage.removeItem(storageKey + '-probe');
  const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (value && value.sections && typeof value.sections === 'object') progress = value;
} catch { storageAvailable = false; }
function persist() {
  if (storageAvailable) {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); }
    catch { storageAvailable = false; }
  }
  document.querySelector('#storage-status').textContent = storageAvailable
    ? 'Progress saved in this browser' : 'Progress available for this visit only';
}
window.moduleGeneration = 0;
window.readSection = i => progress.sections[i];
window.saveSection = (i, state, generation) => {
  if (generation !== window.moduleGeneration) return;
  progress.sections[i] = state; persist(); renderScore();
};
const questionCounts = sections.map(s => (s.html.match(/<form\b[^>]*data-key=/g) || []).length);
function scoreSummary() {
  const rows = questionCounts.map((total, i) => {
    const results = progress.sections[i]?.results || [];
    const answered = Math.min(total, results.filter(r => r === 'correct' || r === 'incorrect').length);
    const correct = Math.min(answered, results.filter(r => r === 'correct').length);
    return {total, answered, correct, section: i};
  });
  return {rows, total: rows.reduce((n,r) => n+r.total,0), answered: rows.reduce((n,r) => n+r.answered,0), correct: rows.reduce((n,r) => n+r.correct,0)};
}
function renderScore() {
  const score = scoreSummary();
  document.querySelector('#score-total').textContent = score.answered
    ? `${score.correct} of ${score.answered} answered questions correct (${Math.round(100*score.correct/score.answered)}% of answered questions). ${score.total-score.answered} of ${score.total} questions unanswered.`
    : `No scored answers yet. ${score.total} multiple-choice questions available.`;
  const list = document.querySelector('#score-sections');
  list.replaceChildren();
  score.rows.filter(r => r.total).forEach(row => {
    const p = document.createElement('p');
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = sections[row.section].label; b.onclick = () => show(row.section);
    p.append(b, document.createTextNode(` — ${row.correct}/${row.answered} answered correct; ${row.total-row.answered} unanswered`));
    list.appendChild(p);
  });
}
let active = Number.isInteger(progress.active) && progress.active >= 0 && progress.active < sections.length ? progress.active : 0;
const visited = new Set((Array.isArray(progress.visited) ? progress.visited : [0]).filter(i => Number.isInteger(i) && i >= 0 && i < sections.length));
const host = document.querySelector('#frames');
const menu = document.querySelector('#menu');
const toggle = document.querySelector('#toggle');
sections.forEach((s, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = s.label; b.onclick = () => show(i);
  menu.appendChild(b);
  const frame = document.createElement('iframe');
  frame.title = s.label; frame.srcdoc = s.html; frame.hidden = i !== active;
  host.appendChild(frame);
});
function show(i) {
  host.children[active]?.contentWindow?.saveModuleProgress?.();
  active = i; visited.add(i);
  [...host.children].forEach((frame, n) => frame.hidden = n !== i);
  [...menu.children].forEach((button, n) => button.setAttribute('aria-current', n === i ? 'page' : 'false'));
  document.querySelector('#previous').disabled = i === 0;
  document.querySelector('#next').disabled = i === sections.length - 1;
  document.querySelector('#next').textContent = i === 0 ? 'Begin module' : 'Next section';
  document.querySelector('#position').textContent = sections[i].label;
  document.querySelector('#visited').textContent = [...visited].filter(n => n > 0).length + ' of ' + (sections.length - 1) + ' sections opened';
  menu.hidden = true; toggle.setAttribute('aria-expanded', 'false');
  document.querySelector('#score-summary').hidden = i !== sections.length - 1;
  renderScore();
  progress.active = active; progress.visited = [...visited]; persist();
}
toggle.onclick = () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded', String(!menu.hidden)); };
document.querySelector('#previous').onclick = () => show(active - 1);
document.querySelector('#next').onclick = () => show(active + 1);
const resetDialog = document.querySelector('#reset-dialog');
document.querySelector('#reset').onclick = () => resetDialog.showModal();
document.querySelector('#cancel-reset').onclick = () => resetDialog.close();
document.querySelector('#confirm-reset').onclick = () => {
  window.moduleGeneration += 1;
  // Rebuild frames from source: this also resets session state when storage is blocked.
  progress = { active: 0, visited: [0], sections: {} };
  visited.clear(); visited.add(0); active = 0;
  persist();
  [...host.children].forEach((frame, i) => { frame.srcdoc = sections[i].html; });
  show(0); resetDialog.close();
};
window.addEventListener('pagehide', () => {
  [...host.children].forEach(frame => frame.contentWindow?.saveModuleProgress?.());
});
show(active);
