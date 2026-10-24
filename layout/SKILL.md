---
name: layout
description: 用户显式指定时，制作或修订小红书轮播与Keynote式deck；先确认本次素材（可按口述目录找图），有图优先相纸窗口，无图完整文字版，品牌角标默认关闭；支持3:4、9:16、16:9、4:3、作者原话轻编辑和定稿锁定，交付Playground、高清PNG及按需PDF/PPTX。沿用蓝白黑、思源黑体、手绘icon和轻UI层次。
---

# Layout

展示名「Layout」，主命令 `$layout`，旧命令 `$xhs-card` 兼容；原名小红书 Card。把作者原话和本次素材做成轮播图或演示deck。参考Ian排版与Oreo Design手绘图标，来源见[Reference](references/references.md)。

## 目标与第一步 Todo：先确认素材

目标：根据本次真实内容和素材完成可用的轮播、长卡或 deck；有图优先图文分区的相纸窗口，无图完成文字版。参考案例提供构图方法，不提供本次品牌、事实或照片。

每次新稿把以下事项放在制作 Todo 的第一项；已明确的答案直接记录，不重复询问。仅同步正文、只改局部且图不动时，沿用已确认素材，不重新启动素材问卷：

- 检查本次附件、指定图片、素材目录和口述线索，**先看图片，再决定排版**。区分「要放进成图的素材」和「只参考风格的截图」。
- 用户可以说「桌面上那次活动文件夹里的合照」而不必输入完整路径。在用户指定的位置按目录名、关键词、图片类型定位并查看候选；唯一明确匹配可直接选用，多张相近时展示少量候选再确认。无法读取就说明；不把尚未找到当作无图，不遍历无关私人目录。
- 确实未提供素材时，只问一次：「这次有没有想用的真实照片、截图或其他图片？可以上传、给路径，或者描述它在桌面哪个文件夹；没有的话我按纯文字排版。」明确无图后直接做完整文字版；等待回答时可准备文字结构，不自行拿案例照片补位。
- 品牌、Logo、作者署名、栏目角标和装饰性页码**默认关闭**；本次用户要求且信息明确才启用。关闭时不占位、不留空框。正文里的必要名称、事实标注、照片来源和项目 Reference 不属于要删除的装饰角标。

详情与可直接复用的询问见[素材确认](references/standards/material-intake.md)。这一步是对话/文件定位过程；不要求每次搭建上传器、填写长表或提供精确路径。

## 确定内容编辑权限

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
|素材、口述路径、图片用途|[素材确认](references/standards/material-intake.md)|
|轮播图|[轮播排版](references/formats/carousel.md)|
|演示deck|[deck规则](references/formats/deck.md)|
|视觉、字体、icon、阴影与粘土点缀|[默认视觉](references/profiles/layout-visual.md)|
|保留作者语气|[轻编辑尺度](references/profiles/author-voice.md)|
|原文同步|[文本保真](references/standards/text-sync.md)，不顺带润色|
|制作、导出、检查|[制作标准](references/standards/production.md)、[验收](references/standards/acceptance.md)|
|换作者或公开复用|[配置边界](references/profiles/selection.md)|
|当前确认的真实照片案例|[三张定稿参考](references/approved-cases.md)|
|参考来源|[Reference与致敬](references/references.md)|

## 制作与交付

已有项目局部修改，保留旧版。新稿从[无品牌起稿入口](assets/starter/README.md)开始；`assets/playground/` 和[定稿案例](references/approved-cases.md)用于观摩，不能整套当新项目复制。素材、编辑权限与比例确认后，Todo 再进入内容组织、首张构图、整组重排、导出与检查。

有可用图片时优先 B 版相纸窗口：独立文字区 + 清楚可见的照片 + 轻边框/阴影，用少量相关手绘元素连接层次。可左右、上下或图片先行，不锁死照片位置，不要求每页有图。整图铺底覆字仅在本次明确选择时使用。无图则用断行、字号和分组完成文字版，不留待补大空框，不自动生成假现场。

内容完整、真实和可读是硬要求；一页一个主重点、字号范围、点缀数量、页数与留白是设计起点。不能为通过检查删掉限定条件、原话或重要事实；内容放不下先重排、拆页或另附细节。按[验收](references/standards/acceptance.md)区分阻断问题、视觉复核与可选增强，不用固定版式评判所有内容。

先交可编辑预览与实际高清图。默认2倍PNG；PDF、PPTX按请求输出。图版PPTX要说明文字非原生可编辑，不把Keynote式排版写成已经生成原生.key文件。

新稿骨架：`python3 scripts/new-project.py --output <新目录> --ratio 3x4`；可用 `--photo <确认图片>` 加入相纸窗口，其他内容由本次稿件改写。脚本不替代素材确认。

案例导出工具：`node scripts/render-playground.cjs <仓库目录>`导出本仓库Playground各比例案例，实际项目沿用对应渲染方式；`python3 scripts/sync-final-copy.py --source <原文.txt> --project <输出目录> --archive <包名.zip>`仅适配说明中的最终正文载体，见文本保真Reference。

机器验收与用户审美认可分开记录。保持显式调用；不启动额外Agent或后台工作。发布按用户当前授权范围执行。
