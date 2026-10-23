# 省心出图 · 结构化数据说明

展示名为「省心出图」，主命令为 `$shengxin-chutu`；旧命令 `$xhs-card` 和 GitHub 仓库地址保持兼容。

## 页面与真实内容

| 页面 | JSON-LD 类型 | 字段依据 |
| --- | --- | --- |
| 首页 `index.html` | WebSite、WebPage、SoftwareSourceCode、ImageObject | 开源项目名称、仓库地址、实际源代码语言、代码 MIT 许可、当前封面图 |
| Playground | CollectionPage、ItemList | 页面可切换的 3:4、9:16、16:9、4:3；四类实际案例 |
| 真实案例页 | CollectionPage、ItemList、ImageObject | 页面展示的三张已确认 PNG、标题、2160×2880 实际尺寸 |

首页改为静态介绍页，不再立刻跳转。结构化数据直接放在 HTML 的 `application/ld+json` 中；标题、描述、canonical 和分享图片与页面内容对应。canonical 保留现有公开路径，不假设已经迁移仓库或注册新域名。

SoftwareSourceCode 的 MIT 指向代码与文档许可。真实照片没有添加 MIT license 字段，图片使用边界继续放在可见页面中。Ian 与 Oreo Design 作为参考作品引用，未写为本项目作者或合作方。

没有添加评分、评论、销量、使用人数、价格、优惠、虚构活动、FAQ 或站内搜索。没有把 Keynote 式排版标为已交付原生 `.key` 文件。

## 验证边界

- 本地检查 JSON 语法、实体关系、必要标识、URL 与实际图片文件、可见文案和图片尺寸。
- 浏览器检查桌面和手机页面、图片和字体、四比例/四案例翻页、图层、下载与全屏。
- 2026-10-23，已把公开首页、Playground 和真实案例页 URL 提交 Schema.org Validator，三页均为 0 错误、0 警告。尚未提交 Google Rich Results Test 或 Search Console，不声称已被收录或一定出现富结果。
- 这里主要用于描述项目、页面和案例。没有为了申请 SoftwareApplication 的富结果而编造评论和报价；Google 是否呈现特殊搜索样式由其自行决定。

## Reference

- [Google：结构化数据通用规则](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google：SoftwareApplication 适用条件](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Schema.org：SoftwareSourceCode](https://schema.org/SoftwareSourceCode)
- [Schema.org：CollectionPage](https://schema.org/CollectionPage)
- [Schema.org：ImageObject](https://schema.org/ImageObject)

本地复查：2026-10-23。

线上加载检查还应确认没有为少量缺字额外下载完整 OTF。随包 `scripts/subset-fonts.py` 会按当前文本刷新 WOFF2 与 Unicode coverage；冒烟脚本会检查是否出现完整字体回退请求。
