// Structural inventory; source presence does not establish source accuracy.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname,'..');
const sections = JSON.parse(fs.readFileSync(path.join(root,'site/sections.json'),'utf8'));
const rows = []; const counts = {A:0,B:0,C:0,D:0};
for (const [i,section] of sections.entries()) {
  const doc = new JSDOM(fs.readFileSync(path.join(root,'site',section.file),'utf8')).window.document;
  const ids = [...doc.querySelectorAll('[id]')].map(x=>x.id);
  assert.equal(ids.length,new Set(ids).size,`Duplicate IDs: ${section.file}`);
  for (const f of doc.querySelectorAll('form[data-key]')) {
    const choices = [...f.querySelectorAll('input[type=radio]')].map(x=>x.value);
    assert.deepEqual([...choices].sort(),['A','B','C','D']);
    assert(choices.includes(f.dataset.key));
    assert(f.querySelector('.feedback'));
    const sourcePanel = f.querySelector('.answer-sources');
    assert(sourcePanel,`Missing evidence note: ${section.file}`);
    const rationales = [...f.querySelectorAll('.option-rationales li[data-option]')];
    assert.equal(rationales.length,3,`Missing distractor explanation: ${section.file}`);
    assert.deepEqual(rationales.map(x=>x.dataset.option).sort(),choices.filter(x=>x!==f.dataset.key).sort());
    assert(rationales.every(x=>x.textContent.trim().length>30));
    counts[f.dataset.key]++;
    const links = [...sourcePanel.querySelectorAll('a')].map(a=>`[${a.textContent.trim()}](${a.href})`);
    rows.push(`| ${i}.${f.dataset.number} | ${f.querySelector('h3')?.textContent.trim() || 'Question'} | ${f.dataset.key} | ${links.join('; ') || 'Case-based reasoning; source scope stated in explanation'} | Pending |`);
  }
}
assert.equal(rows.length,23);
const report = `# Question audit register\n\nGenerated from current source with scripts/audit_content.js. Structural checks pass: 23 four-option questions, valid keys, three distractor explanations per question, feedback and evidence notes, unique IDs within each section. Key distribution: ${JSON.stringify(counts)}. This checks structure, not factual correctness or item validity.\n\nEach row needs independent review of the stem, one-best-answer defensibility, distractor plausibility, source support and scope, and alignment with an objective. “Pending” means independent item review has not been documented. Targeted source checks are recorded separately in publication-readiness-2026-10-21.md.\n\n| Item (section.question) | Label | Key | Explanation sources | Independent item review |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
fs.writeFileSync(path.join(root,'curriculum/audits/question-register.md'),report);
console.log(`Structural audit passed: ${rows.length} questions; keys ${JSON.stringify(counts)}.`);
