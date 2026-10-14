"""Export the full current learner text from the editable section HTML."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
ROOT = Path(__file__).resolve().parents[1]
class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.root = Node(); self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in {'meta','link','input','br','hr','img','source','wbr'}: self.stack.append(n)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]; break
    def handle_data(self, data): self.stack[-1].children.append(data)
def descendants(node, tag):
    result=[]
    for child in node.children:
        if isinstance(child,Node):
            if child.tag == tag: result.append(child)
            else: result.extend(descendants(child,tag))
    return result
def render(node):
    if isinstance(node,str): return re.sub(r'\s+',' ',node)
    tag=node.tag; attrs=node.attrs
    if tag == 'br': return ' '
    if tag in {'script','style','title','button','nav','select','input','legend','footer'}: return ''
    if attrs.get('class') in {'eyebrow','footer','verdict'}: return ''
    text=''.join(render(child) for child in node.children).strip()
    if not text: return ''
    if tag == 'table':
        rows=[]
        for tr in descendants(node,'tr'):
            cells=[render(c).replace('\n',' ').replace('|','\\|').strip() for c in tr.children if isinstance(c,Node) and c.tag in {'th','td'}]
            if cells: rows.append('| '+' | '.join(cells)+' |')
        if len(rows): rows.insert(1,'| '+' | '.join(['---']*rows[0].count(' |'))+' |')
        return '\n\n'+'\n'.join(rows)+'\n\n'
    if tag in {'h1','h2','h3','h4'}: return '\n\n'+'#'*int(tag[1])+' '+text+'\n\n'
    if tag == 'a': return '['+text+']('+attrs.get('href','')+')'
    if tag in {'b','strong'}: return '**'+text+'** '
    if tag in {'i','em'}: return '*'+text+'* '
    if tag == 'li': return '\n- '+text+'\n'
    if tag == 'form' and attrs.get('class') == 'match':
        text += '\n\n**Matching key:** 1. Health disparity; 2. Health care disparity; 3. Health inequity; 4. Social determinants of health.\n'
    if tag == 'label': return '\n\n'+text+'\n\n'
    if tag == 'summary': return '\n\n**'+text+'**\n\n'
    if tag == 'br': return ' '
    if tag in {'p','section','div','form','details','ul','ol','fieldset','header','main'}: return '\n\n'+text+'\n\n'
    return text
parts=['<!-- Generated from site/sections/*.html by scripts/export_draft.py. Edit the HTML sources, then rebuild. -->']
for item in json.loads((ROOT/'site/sections.json').read_text()):
    parser=Parser();parser.feed((ROOT/'site'/item['file']).read_text());parts.append(render(parser.root))
text='\n\n'.join(parts)
text=re.sub(r'\n[ \t]+','\n',text)
text=re.sub(r'\n{3,}','\n\n',text)
(ROOT/'curriculum/health-equity-learner-draft.md').write_text(text.strip()+'\n')
