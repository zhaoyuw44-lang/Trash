"""Translate the generated content of ionic-conductivity-ref620-en.html.

The generator writes the same (Chinese) step texts and figures into the English page;
this pass swaps them for English using three dictionaries keyed by the Chinese source:
  steps.json      step-text HTML fragments
  svg_text.json   text nodes inside SVG <text>/<tspan>
  svg_aria.json   SVG aria-label descriptions
Anything Chinese left on the page is reported so the dictionaries can be completed.
"""
import json, pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
CJK = re.compile(r'[　-〿㐀-鿿＀-￯]')


def load(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))


def translate(page):
    page = pathlib.Path(page)
    s = page.read_text(encoding='utf-8')
    steps, texts, arias = load('steps.json'), load('svg_text.json'), load('svg_aria.json')
    for zh in sorted(steps, key=len, reverse=True):
        s = s.replace(zh, steps[zh])
    missing = set()

    def fix_svg(m):
        sv = m.group(0)

        def aria(a):
            v = a.group(1)
            if CJK.search(v):
                if v in arias:
                    return f'aria-label="{arias[v]}"'
                missing.add(('aria', v[:40]))
            return a.group(0)

        def node(n):
            v = n.group(2)
            if CJK.search(v):
                if v in texts:
                    return n.group(1) + texts[v]
                missing.add(('text', v))
            return n.group(0)
        sv = re.sub(r'aria-label="([^"]*)"', aria, sv)
        return re.sub(r'(<(?:text|tspan)\b[^>]*>)([^<>]+)(?=<)', node, sv)
    s = re.sub(r'<svg\b.*?</svg>', fix_svg, s, flags=re.S)
    page.write_text(s, encoding='utf-8')
    left = [(m.start(), s[max(0, m.start() - 30):m.start() + 30].replace('\n', ' ')) for m in CJK.finditer(s)]
    print(f'translated {page.name}: {len(missing)} missing SVG strings, {len(left)} Chinese characters left')
    for k, v in sorted(missing)[:20]:
        print('  missing', k, v)
    shown = -1000
    for pos, ctx in left:
        if pos - shown > 60:
            print('  left:', ctx)
            shown = pos
