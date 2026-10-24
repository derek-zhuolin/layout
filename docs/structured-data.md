# Layout · 结构化数据说明

展示名为「Layout」，主命令为 `$layout`；旧命令 `$shengxin-chutu`、`$xhs-card` 保持兼容，当前公开仓库与 Pages 路径使用 `layout`。

## 页面与真实内容

| 页面 | JSON-LD 类型 | 字段依据 |
| --- | --- | --- |
| 首页 `index.html` | WebSite、WebPage、SoftwareSourceCode、ImageObject | 开源项目名称、仓库地址、实际源代码语言、代码 MIT 许可、当前封面图 |
| Playground | CollectionPage、ItemList、ImageObject、BreadcrumbList | 页面可切换的四种比例、四类实际案例、19 张图片及可见面包屑 |
| 真实案例页 | CollectionPage、ItemList、ImageObject、BreadcrumbList | 页面展示的三张已确认 PNG、标题、2160×2880 实际尺寸及可见面包屑 |

首页为静态介绍页。结构化数据直接放在 HTML 的 `application/ld+json` 中；标题、描述、canonical 和分享图片与页面内容对应。canonical 使用当前 `https://derek-zhuolin.github.io/layout/` 下的实际页面路径。

SoftwareSourceCode 的 MIT 指向代码与文档许可。真实照片没有添加 MIT license 字段，图片使用边界继续放在可见页面中。Ian 与 Oreo Design 作为参考作品引用，未写为本项目作者或合作方。

没有添加评分、评论、销量、使用人数、价格、优惠、虚构活动、FAQ 或站内搜索。没有把 Keynote 式排版标为已交付原生 `.key` 文件。

## 验证边界

- 本地检查 JSON 语法、实体关系、必要标识、URL 与实际图片文件、可见文案和图片尺寸。
- 浏览器检查桌面和手机页面、图片和字体、四比例/四案例翻页、图层、下载与全屏。
- 较早的 Schema.org Validator 记录：公开首页、Playground 和真实案例页均为 0 错误、0 警告。该记录不替代以后每次发布的复核。
- 2026-10-24 较早一轮 Google Rich Results Test 已识别首页 8 项图片元数据，Playground 19 项图片元数据与 1 项面包屑，真实案例页 3 项图片元数据与 1 项面包屑。见下方分轮报告。
- 图片 `creditText` 对应可见的排版参考、手绘图标、字体与往期照片来源。未确认的 `creator`、`copyrightNotice`、`license`、`acquireLicensePage` 保持留空，不为消除可选提示编造署名或授权。
- Rich Results Test 识别有效标记不等于已收录或一定展示富结果；本项目没有通过这些测试提交 Search Console 索引请求。
- 这里主要用于描述项目、页面和案例。没有为了申请 SoftwareApplication 的富结果而编造评论和报价；Google 是否呈现特殊搜索样式由其自行决定。

## 2026-10-24 通用无图排版规则发布复核

本次仅公开通用排版文档与 Reference，未改三页 HTML、JSON-LD 或案例图。联名概念稿与本机前后对照图保留在本地，没有作为活动、合作关系或新案例写进 Pages 与 schema。

已重新抓取三个公开页面：描述与 meta 一致，面包屑与可见导航一致，ItemList 对应四种比例或三张案例；图片 URL、实际尺寸与可见署名相符。线上冒烟检查通过，覆盖三个页面的桌面/手机显示、四种比例各四页、高清 PNG、翻页、图层与全屏。

本轮 Google 复测实际读取到的报告：

- [首页，2026-10-24 15:30:29（上海时间）](https://search.google.com/test/rich-results/result?id=BCnNGSK8Ac1USSjGKK3gxw)：8 项图片元数据有效。
- [Playground，2026-10-24 15:36:52（上海时间）](https://search.google.com/test/rich-results/result?id=PA2Y9AvzCprDXAowWWEtVQ)：19 项图片元数据与 1 项面包屑有效。

真实案例页本轮完成线上内容核对与冒烟检查，尚未取得本轮新的 Google 报告。其 [较早一轮 Google 报告（2026-10-24 01:19:09，上海时间）](https://search.google.com/test/rich-results/result?id=iexH5goY_nyspIrLfVni5Q)识别 3 项图片元数据与 1 项面包屑；保留历史日期，不称为本轮 Google 复测结果。

## Reference

- [Google：结构化数据通用规则](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google：SoftwareApplication 适用条件](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Schema.org：SoftwareSourceCode](https://schema.org/SoftwareSourceCode)
- [Schema.org：CollectionPage](https://schema.org/CollectionPage)
- [Schema.org：ImageObject](https://schema.org/ImageObject)

本次线上内容与功能复查：2026-10-24。Google、Schema.org 与内容一致性检查分别记录，不互相替代。

线上加载检查还应确认没有为少量缺字额外下载完整 OTF。随包 `scripts/subset-fonts.py` 会按当前文本刷新 WOFF2 与 Unicode coverage；冒烟脚本会检查是否出现完整字体回退请求。
