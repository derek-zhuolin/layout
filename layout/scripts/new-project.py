#!/usr/bin/env python3
"""Create a portable, unbranded Layout starting point. Does not discover or approve photos."""
import argparse
import json
import shutil
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--ratio', choices=['3x4', '9x16', '16x9', '4x3'])
parser.add_argument('--config', type=Path, help='JSON content, using the fields in assets/starter/config.js')
parser.add_argument('--photo', type=Path, help='An already reviewed and selected local image')
parser.add_argument('--photo-kind', choices=['photo', 'screenshot', 'chart'], default='photo')
parser.add_argument('--photo-alt', default='')
parser.add_argument('--photo-caption', default='')
args = parser.parse_args()
skill = Path(__file__).resolve().parents[1]
source = skill / 'assets/starter'
config = json.loads((source / 'config.js').read_text().split('window.LAYOUT_CONFIG =', 1)[1].strip().removesuffix(';'))
if args.config:
    incoming = json.loads(args.config.read_text())
    if not isinstance(incoming, dict):
        parser.error('--config must be a JSON object')
    if incoming.get('photo'):
        parser.error('Pass the reviewed image using --photo; do not embed a source path in config')
    config.update(incoming)
if not isinstance(config.get('title'), str) or not isinstance(config.get('lead', ''), str) or not isinstance(config.get('paragraphs', []), list) or any(not isinstance(x, str) for x in config.get('paragraphs', [])):
    parser.error('title/lead must be text; paragraphs must be a list of text')
if args.ratio:
    config['ratio'] = args.ratio
if config.get('ratio') not in ['3x4', '9x16', '16x9', '4x3']:
    parser.error('Unsupported ratio')
if args.output.exists():
    parser.error('Output already exists; use a new directory to preserve existing work')
if args.photo and (not args.photo.is_file() or args.photo.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}):
    parser.error('Selected photo must be an existing PNG, JPEG, WebP or GIF; convert other formats first')
args.output.mkdir(parents=True)
shutil.copy2(skill / 'LICENSE', args.output / 'LICENSE')
assets = args.output / 'assets'
shutil.copytree(source, assets / 'starter')
(assets / 'icons').mkdir()
for name in ['paperclip.svg', 'LICENSE']:
    shutil.copy2(skill / 'assets/icons' / name, assets / 'icons' / name)
(assets / 'fonts').mkdir()
for name in ['OFL.txt', *[f'{prefix}-{weight}.{ext}' for prefix, ext in [('XHSCardDemoSans', 'woff2'), ('SourceHanSansSC', 'otf')] for weight in ['Regular', 'Medium', 'Bold']]]:
    shutil.copy2(skill / 'assets/fonts' / name, assets / 'fonts' / name)
if args.photo:
    destination = 'photo' + args.photo.suffix.lower()
    shutil.copy2(args.photo, assets / destination)
    config['photo'] = {'src': '../' + destination, 'alt': args.photo_alt, 'caption': args.photo_caption, 'kind': args.photo_kind}
(assets / 'starter/config.js').write_text('window.LAYOUT_CONFIG = ' + json.dumps(config, ensure_ascii=False, indent=2) + ';\n')
(args.output / 'index.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=assets/starter/index.html"><title>Layout draft</title><a href="assets/starter/index.html">打开排版预览</a></html>\n')
(args.output / 'REFERENCE.md').write_text('字体：Adobe / Google 思源黑体，见 assets/fonts/OFL.txt。\n图标：Oreo Design / Nicole Tang，https://github.com/oreo-design/doodle-icons ，见 assets/icons/LICENSE。\n排版参考：Ian，https://github.com/helloianneo/ian-xhs-carousel 。\n本次照片来源与使用范围由当前作者确认，不因模板代码许可自动获得授权。\n')
print(args.output / 'index.html')
