# 无品牌起稿入口

先完成 Skill 的素材确认，再从这里起稿。这里是构图起点，不是最终文案或整套页面配额；`config.js` 中的演示句子要换成本次稿件。

```sh
python3 layout/scripts/new-project.py --output ./my-cards --ratio 3x4
# 图片已经查看并确认后，可指定任意本地路径（路径含空格需引号）
python3 layout/scripts/new-project.py --output ./my-photo-cards --ratio 16x9 --photo ./selected-photo.jpg --photo-alt "本次选定的交流现场"
```

打开生成目录的 `index.html`。可编辑文件在 `assets/starter/`；骨架只复制字体、一个手绘图标及对应许可，不复制 Playground 或参考照片。实际定位桌面照片由 Agent 根据用户线索完成，脚本不会扫描目录或自行选图。

- `config.js`：本页内容、比例、选填照片、品牌与角标。默认完整文字示例，无品牌、无角标、无页码。
- `starter.css`：蓝白黑、思源黑体、图文分区与相纸轻层次。四比例分别调整，参数可改。
- `starter.js`：根据内容渲染；未启用的品牌/角标不生成 DOM，不占空间。图片加载失败会显示明确的草稿错误，不能把它作为完成稿导出。

`photo: null` 表示当前骨架无图，不证明用户已回答素材问题；素材状态另外记在 Todo 中。有照片时切换相纸窗口，照片默认完整显示，不强行裁切。图表与截图可将 `photo.kind` 设为 `screenshot` 或 `chart`，保持水平且不加纸夹。

品牌字段与角标均需同时满足 `enabled: true` 和明确内容才显示。brand 可含 `name`、`logo`、`logoAlt`、`author`；corner 可含 `label`、`pageNumber`。不要把 Layout 名称或参考品牌自动填进这些字段。必要图注用 `photo.caption`，来源与许可写入源稿 Reference，不能为了关闭角标而删除。

`--config` 可传一份 JSON（对象字段与 config.js 相同）替换内容；选图仍通过 `--photo` 显式传入。骨架不能适配所有长文：需要时改构图、增页，不能无限缩小字体或删条件。请检查整组阅读顺序和实际导出图，而不只检查这张初始示例。

图标来自 Oreo Design / Nicole Tang，字体来自 Adobe / Google，依照随包许可使用。品牌/角标关闭不影响 Reference 致谢。
