#!/usr/bin/env python3
"""Assemble the public site from build/partials and build/pages into the repo root.
Run from the repo root:  python3 build/assemble.py
Each page file starts with a small header block of `key: value` lines, then a blank line, then the body.
Keys: path (public route), title, description, theme (hex for theme-color), day (yes = daylight page), scripts (extra js, space separated)."""
import os, re, io, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
def read(p): return io.open(p, encoding='utf-8').read()
partials = {n[:-5]: read(P('build','partials',n)) for n in os.listdir(P('build','partials')) if n.endswith('.html')}
def fill(t, v):
    return re.sub(r'\{\{(\w+)\}\}', lambda m: v.get(m.group(1), ''), t)
built = []
for name in sorted(os.listdir(P('build','pages'))):
    if not name.endswith('.html'): continue
    src = read(P('build','pages',name))
    head, body = src.split('\n\n', 1)
    v = dict(l.split(':',1) for l in head.strip().split('\n'))
    v = {k.strip(): val.strip() for k, val in v.items()}
    v['canonical'] = 'https://executive-engagements.ethanstarke.com' + v['path']
    v['bodyattrs'] = ' data-day="always"' if v.get('day') == 'yes' else ''
    v['extrascripts'] = ''.join('<script src="%s"></script>\n' % s for s in v.get('scripts','').split())
    v['navcurrent'] = v['path']
    # the ground reaches daylight before Speak With Someone: an empty strip blends the page's last colour to cream
    gs = re.findall(r'data-g2?="(#[0-9A-Fa-f]{6})"', body)
    lastg = gs[-1] if gs else '#060A14'
    dawn = '' if lastg.upper() == '#F1E9D6' else '<section class="dawn-gap" data-g="%s" data-g2="#F1E9D6" aria-hidden="true"></section>\n' % lastg
    html = fill(partials['head'], v) + fill(partials['nav'], v) + '\n<main>\n' + body.strip() + '\n' + dawn + partials['speak'] + '\n</main>\n' + fill(partials['footer'], v)
    # mark the current top-level section in the nav
    top = '/' + v['path'].strip('/').split('/')[0] if v['path'] != '/' else '/'
    html = html.replace('href="%s" class="navlink"' % top, 'href="%s" class="navlink current"' % top, 1)
    out = v['path'].strip('/')
    out = 'index.html' if out == '' else (out + '/index.html' if v.get('folder') == 'yes' else out + '.html')
    os.makedirs(os.path.dirname(P(out)) or ROOT, exist_ok=True)
    io.open(P(out), 'w', encoding='utf-8').write(html)
    built.append(out)
print('built', len(built), 'pages:', ', '.join(built))
