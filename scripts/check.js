// DOM interaction regression checks. Requires jsdom in NODE_PATH.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const {JSDOM, VirtualConsole} = require('jsdom');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
assert.equal(html, fs.readFileSync(path.join(root, 'preview/index.html'), 'utf8'));
const sectionJSON = html.split('const sections=')[1];
const data = JSON.parse(sectionJSON.slice(0, sectionJSON.indexOf(';\n')));
const errors = [];
let saved = {};
const parent = { moduleGeneration: 0, readSection: i => saved[i], saveSection: (i, state, generation) => { if (generation === parent.moduleGeneration) saved[i] = state; } };
function make(source) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  return new JSDOM(source, {url: 'https://example.org/module/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window) {
      Object.defineProperty(window, 'parent', {value: parent});
      window.scrollTo = () => {};
      window.HTMLElement.prototype.scrollIntoView = () => {};
    }
  });
}
for (let section = 0; section < data.length; section++) {
  saved = {};
  const dom = make(data[section].html);
  const doc = dom.window.document;
  const forms = [...doc.querySelectorAll('form[data-key]')];
  for (const form of forms) {
    // Force form submit without an answer: no explanation should appear.
    form.dispatchEvent(new dom.window.Event('submit', {bubbles: true, cancelable: true}));
    assert(form.querySelector('.feedback').hidden, `Unanswered section ${section}`);
    const correct = form.querySelector(`input[value="${form.dataset.key}"]`);
    const wrong = [...form.querySelectorAll('input')].find(i => i !== correct);
    wrong.checked = true;
    form.requestSubmit();
    assert.equal(form.dataset.result, 'incorrect', `Incorrect feedback section ${section}`);
    correct.checked = true;
    form.requestSubmit();
    assert.equal(form.dataset.result, 'correct', `Correct feedback section ${section}`);
    assert(!form.querySelector('.feedback').hidden);
  }
  const match = doc.querySelector('.match');
  if (match) {
    [...match.querySelectorAll('select')].forEach((el,i) => el.value = String(i));
    match.requestSubmit();
    assert(!match.querySelector('.match-feedback').hidden);
  }
  if (section === 1) dom.window.show(3);
  const details = doc.querySelector('details');
  if (details) details.open = true;
  dom.window.saveModuleProgress();
  const snapshot = JSON.stringify(saved[section]);
  const restored = make(data[section].html);
  const restoredDoc = restored.window.document;
  for (const form of restoredDoc.querySelectorAll('form[data-key]')) {
    assert.equal(form.dataset.result, 'correct', `Restored feedback section ${section}`);
    assert.equal(form.querySelector('input:checked').value, form.dataset.key);
  }
  if (section === 1) {
    assert(!restoredDoc.querySelector('#beat3').hidden);
    restoredDoc.querySelector('#next').click();
    assert(!restoredDoc.querySelector('#beat4').hidden, 'Restored foundations navigation');
  }
  if (match) assert(!restoredDoc.querySelector('.match-feedback').hidden);
  if (details) assert(restoredDoc.querySelector('details').open);
  dom.window.close(); restored.window.close();
  // Exercise every skip button from the original state.
  saved = {};
  const skipped = make(data[section].html);
  for (const button of skipped.window.document.querySelectorAll('.skip-question')) button.click();
  skipped.window.saveModuleProgress();
  const skippedRestore = make(data[section].html);
  assert.equal(JSON.stringify([...skippedRestore.window.document.querySelectorAll('.feedback')].map(el=>el.hidden)),JSON.stringify([...skipped.window.document.querySelectorAll('.feedback')].map(el=>el.hidden)));
  skipped.window.close();skippedRestore.window.close();
  console.log(`Section ${section}: ${forms.length} questions; feedback, skip, and restore passed`);
}
// Compile the assembled outer runtime as well as the section scripts.
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
new vm.Script(script);
for (const section of data) for (const script of section.html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
assert.equal(errors.length, 0, errors.join('\n'));
console.log('All scripts compile; no DOM runtime errors.');
const outerErrors = [];
const outerConsole = new VirtualConsole();
outerConsole.on('jsdomError', e => outerErrors.push(e.message));
function shell(initialStorage, blocked = false) {
  return new JSDOM(html, {url:'https://example.org/module/', runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:outerConsole,
    beforeParse(w) {
      if (initialStorage) w.localStorage.setItem('lab-equity-module-progress-v1',initialStorage);
      if (blocked) Object.defineProperty(w,'localStorage',{get(){throw new Error('Storage blocked');}});
      w.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
      w.HTMLDialogElement.prototype.close = function(){this.open=false;};
    }
  });
}
const outer = shell();
outer.window.show(8);
assert.equal(outer.window.document.querySelector('#position').textContent,'8 · Quality improvement');
outer.window.saveSection(8,{controls:[{value:'B',checked:true}]},0);
const stored = outer.window.localStorage.getItem('lab-equity-module-progress-v1');
const loaded = shell(stored);
assert.equal(loaded.window.document.querySelector('#position').textContent,'8 · Quality improvement');
assert.equal(loaded.window.readSection(8).controls[0].value,'B');
loaded.window.document.querySelector('#reset').click();
loaded.window.document.querySelector('#cancel-reset').click();
assert(loaded.window.readSection(8));
loaded.window.document.querySelector('#reset').click();
loaded.window.document.querySelector('#confirm-reset').click();
assert.equal(loaded.window.readSection(8),undefined);
loaded.window.saveSection(8,{controls:[]},0); // A stale child may unload after reset.
assert.equal(loaded.window.readSection(8),undefined);
assert.equal(loaded.window.document.querySelector('#position').textContent,'Welcome');
const blocked = shell(null,true);
blocked.window.show(2);
blocked.window.saveSection(2,{controls:[]},0);
assert(blocked.window.readSection(2));
assert.match(blocked.window.document.querySelector('#storage-status').textContent,/visit only/);
for (const dom of [outer,loaded,blocked]) dom.window.close();
assert.equal(outerErrors.length,0,outerErrors.join('\n'));
console.log('Shell: section persistence, reset/cancel, stale-save protection, and blocked-storage fallback passed.');
// Learning summary uses submitted outcomes, never merely selected radio values.
const scored = shell();
assert.equal(scored.window.scoreSummary().total,23);
assert.equal(scored.window.scoreSummary().answered,0);
scored.window.saveSection(1,{results:['correct',null,'incorrect',null]},0);
scored.window.saveSection(2,{results:['correct','correct',null]},0);
assert.equal(scored.window.scoreSummary().correct,3);
assert.equal(scored.window.scoreSummary().answered,4);
scored.window.show(10);
assert(!scored.window.document.querySelector('#score-summary').hidden);
assert.match(scored.window.document.querySelector('#score-total').textContent,/3 of 4.*75%.*19 of 23/);
scored.window.show(6);
assert(scored.window.document.querySelector('#score-summary').hidden);
scored.window.document.querySelector('#confirm-reset').click();
assert.equal(scored.window.scoreSummary().answered,0);
scored.window.close();
saved = {};
const pending = make(data[6].html);
const pendingForm = pending.window.document.querySelector('form[data-key]');
const right = pendingForm.querySelector(`input[value="${pendingForm.dataset.key}"]`);
right.checked = true; pendingForm.requestSubmit();
const other = [...pendingForm.querySelectorAll('input')].find(x=>x!==right);
other.checked = true; pending.window.saveModuleProgress();
assert.equal(saved[6].results[0],'correct');
const pendingRestore = make(data[6].html);
assert.equal(pendingRestore.window.document.querySelector('form').dataset.result,'correct');
assert.equal(pendingRestore.window.document.querySelector('input:checked').value,other.value);
pending.window.close(); pendingRestore.window.close();
console.log('Learning summary: 23-item denominator, partial scoring, unanswered items, reset, and unsubmitted edits passed.');
