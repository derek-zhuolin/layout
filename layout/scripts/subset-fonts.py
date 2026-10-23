#!/usr/bin/env python3
"""Refresh offline preview webfonts from the repository's actual text. Requires fontTools + brotli."""
from pathlib import Path
import argparse,re
from fontTools import subset
from fontTools.ttLib import TTFont

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('root',nargs='?',type=Path,default=Path(__file__).resolve().parents[2])
root=parser.parse_args().root.resolve()
chars=set(chr(x) for x in range(32,127))
for path in [root/'index.html',root/'README.md',root/'NOTICE.md',*(root/'layout').rglob('*')]:
    if path.is_file() and path.suffix in {'.md','.html','.js','.cjs','.yaml','.json'}:
        chars.update(path.read_text())
points=sorted(ord(c) for c in chars if not c.isspace() or c==' ')
fontdir=root/'layout/assets/fonts'
for weight in ['Regular','Medium','Bold']:
    font=TTFont(fontdir/f'SourceHanSansSC-{weight}.otf')
    options=subset.Options();options.flavor='woff2';options.desubroutinize=True
    options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
    worker=subset.Subsetter(options=options);worker.populate(unicodes=points);worker.subset(font)
    names={1:'XHS Card Demo Sans',2:weight,3:f'XHSCardDemoSans-{weight}',4:f'XHS Card Demo Sans {weight}',6:f'XHSCardDemoSans-{weight}',16:'XHS Card Demo Sans',17:weight}
    for record in font['name'].names:
        if record.nameID in names:
            record.string=names[record.nameID].encode(record.getEncoding())
    font.flavor='woff2';font.save(fontdir/f'XHSCardDemoSans-{weight}.woff2')
    print(weight, (fontdir/f'XHSCardDemoSans-{weight}.woff2').stat().st_size, 'bytes')
# Derive the Unicode coverage from the actual saved font, rather than guessing.
available=sorted(TTFont(fontdir/'XHSCardDemoSans-Regular.woff2').getBestCmap())
ranges=[];start=prev=available[0]
for point in available[1:]:
    if point==prev+1:prev=point;continue
    ranges.append(f'U+{start:X}'+(f'-{prev:X}' if start!=prev else ''));start=prev=point
ranges.append(f'U+{start:X}'+(f'-{prev:X}' if start!=prev else ''))
coverage=','.join(ranges)
for path in [root/'layout/assets/playground/index.html',root/'layout/assets/playground/style.css']:
    text=path.read_text()
    text=re.sub(r'unicode-range:[^}]+',lambda m:'unicode-range:'+coverage,text)
    text=text.replace('v=shengxin-1','v=layout-1').replace('v=4formats','v=layout-1')
    path.write_text(text)
for path in [root/'index.html',root/'layout/assets/playground/slides.html']:
    path.write_text(path.read_text().replace('v=shengxin-1','v=layout-1'))
print(len(available),'covered Unicode characters; font CSS ranges refreshed.')
