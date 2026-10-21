"""Build identical self-contained GitHub Pages and downloadable module files."""
from pathlib import Path
import json
import hashlib
ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'site'
sections = []
for i, item in enumerate(json.loads((source / 'sections.json').read_text())):
    body = (source / item['file']).read_text()
    revision = hashlib.sha256(body.encode()).hexdigest()[:12]
    body = body.replace('<html lang="en">', f'<html lang="en" data-section="{i}" data-revision="{revision}">', 1)
    body = body.replace('</html>', '<script>' + (source / 'progress.js').read_text() + '</script></html>')
    sections.append({'label': item['label'], 'html': body})
# Escape closing tags so embedded section scripts cannot close the outer script.
data = 'const sections=' + json.dumps(sections, ensure_ascii=False).replace('</', '<\\/') + ';'
output = (source / 'shell.html').read_text().replace('/* MODULE_DATA */', data).replace('/* MODULE_RUNTIME */', (source / 'runtime.js').read_text())
for target in ['docs/index.html', 'preview/index.html']:
    (ROOT / target).write_text(output)
print(f'Built {len(sections)} sections into docs/index.html and preview/index.html')
