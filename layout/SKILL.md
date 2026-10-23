---
name: layout
description: 用户显式指定时，制作或修订小红书轮播与Keynote式deck；支持3:4、9:16、16:9、4:3、作者原话轻编辑和定稿锁定，交付Playground、高清PNG及按需PDF/PPTX。沿用蓝白黑、思源黑体、手绘icon和轻UI层次。
---

# Layout

展示名「Layout」，主命令 `$layout`，旧命令 `$xhs-card` 兼容；原名小红书 Card。把作者原话和素材做成轮播图或演示deck；原名interflow-carousel。参考Ian排版与Oreo Design手绘图标，来源见[Reference](references/references.md)。

## 先确定内容编辑权限

- 最终版、原文同步、不要润色：`verbatim`。不改字、标点、空格、分段，不加标题结尾；只同步指定载体。
- 稍微改改、整理口述：`light-edit`。保留原观点、观察和分寸，去重复、调顺序、拆长句，不代写立场。
- 明确重写或从材料创作：`rewrite`。仍不把推断写成作者经历。

当前请求 > 用户指定定稿 > 本篇配置 > 作者/视觉偏好 > 通用默认。其他作者不自动继承旧作者的经历和署名。

## 选择形式与比例

- 竖版卡片：小红书轮播默认 `carousel / 3:4 / 1080×1440`；竖屏长卡可用 `carousel / 9:16 / 1080×1920`。
- 横版deck：Keynote式默认 `deck / 16:9 / 1600×900`。
- 同属横版deck的传统投影或紧凑横版可用 `deck / 4:3 / 1200×900`。
- 用户明确指定比例就遵从；未指定的旧项目保留画布。换比例必须重排，不能拉伸原稿。具体参数见[比例选择](references/formats/aspect-ratios.md)。

## 按任务读取

|任务|Reference|
|---|---|
|轮播图|[轮播排版](references/formats/carousel.md)|
|演示deck|[deck规则](references/formats/deck.md)|
|视觉、字体、icon、阴影与粘土点缀|[视觉档案](references/profiles/interflow-visual.md)|
|保留作者语气|[轻编辑尺度](references/profiles/author-voice.md)|
|原文同步|[文本保真](references/standards/text-sync.md)，不顺带润色|
|制作、导出、检查|[制作标准](references/standards/production.md)、[验收](references/standards/acceptance.md)|
|换作者或公开复用|[配置边界](references/profiles/selection.md)|
|当前确认的真实照片案例|[三张定稿参考](references/approved-cases.md)|
|参考来源|[Reference与致敬](references/references.md)|

## 制作与交付

已有项目局部修改，保留旧版。新稿优先看[三张定稿真实案例](references/approved-cases.md)的视觉完成度，再从`assets/playground/`取比例与重排参考；示例只是演示内容，事实、照片、署名和页数按本篇更换。Playground支持比例、案例、翻页、缩略图、层次与全屏。

先交可编辑预览与实际高清图。默认2倍PNG；PDF、PPTX按请求输出。图版PPTX要说明文字非原生可编辑，不把Keynote式排版写成已经生成原生.key文件。

工具：`node scripts/render-playground.cjs <仓库目录>`导出本仓库Playground各比例案例，实际项目沿用对应渲染方式；`python3 scripts/sync-final-copy.py --source <原文.txt> --project <输出目录> --archive <包名.zip>`仅适配说明中的最终正文载体，见文本保真Reference。

机器验收与用户审美认可分开记录。保持显式调用；不启动额外Agent或后台工作。发布按用户当前授权范围执行。
