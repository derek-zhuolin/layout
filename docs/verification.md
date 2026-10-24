# Layout · 发布验证

验证日期：2026-10-23。项目主命令 `$layout`，保留 `$xhs-card` 兼容入口。

## 公开页面

- [项目首页](https://derek-zhuolin.github.io/layout/)
- [Playground](https://derek-zhuolin.github.io/layout/layout/assets/playground/index.html)
- [真实案例](https://derek-zhuolin.github.io/layout/layout/assets/approved-cases/index.html)

## 结果

| 检查 | 结果 |
| --- | --- |
| Schema.org 官方验证：公开首页 | 0 错误、0 警告 |
| Schema.org 官方验证：公开 Playground | 0 错误、0 警告 |
| Schema.org 官方验证：公开真实案例页 | 0 错误、0 警告 |
| 三页桌面与手机视图 | 图片、字体正常，无水平溢出 |
| 四比例 × 四类案例 | 共 16 页，画布与文字边界通过 |
| 16 张 PNG 下载 | 完整下载，逐字节匹配本地导出文件，尺寸正确 |
| 翻页、缩略图、键盘、图层与全屏 | 通过 |
| 非法、负数、小数页码 | 正常回到有效页 |
| 旧 Playground / 案例链接 | 跳转正常，保留比例和页码 |
| 旧图片链接 | 与新路径图片逐字节一致 |
| 三页 JSON-LD 关联与图片尺寸 | 与实际内容匹配 |
| 浏览器运行错误 | 0 |
| 完整 OTF 回退请求 | 0 |

## Review 中处理的问题

1. 异常页码参数会导致预览报错，已加有效整数范围处理。
2. 新字未覆盖导致加载约 16 MB 完整字体，已更新约 222–227 KB 的字体子集，并统一真实案例页的字体加载方式。
3. 浏览器 API 下载二进制时出现链路超时；完整 PNG 经系统下载器验证正常。冒烟脚本改用 curl 完整下载和文件比对，浏览器继续承担实际页面与交互检查。

## 文本脱敏范围

检查当前公开 UTF-8 源代码与文档，包含凭证特征、手机号码、个人联系方式、本机路径与私有作者档案引用。一处个人称呼已改为通用表述，复查未发现上述内容。图片采用已确认的版本，第三方版权署名保留。没有重写历史提交或对图片做人脸处理。

本机私有作者档案不放入公开包。新提交使用 GitHub noreply 邮箱。

## 复现

需要 Node.js、Playwright 与 curl，安装方式见 README：

```sh
npm run smoke
SITE_URL=https://derek-zhuolin.github.io/layout/ npm run smoke
```

验证器入口：[Schema.org Validator](https://validator.schema.org/)。没有提交 Google Rich Results Test 或 Search Console，不将 schema 验证通过等同于 Google 已收录或一定展示富结果。


## Layout 名称迁移（2026-10-24）

名称、公开链接、命令和图片标识已更新，主命令为 `$layout`；`$shengxin-chutu` 和 `$xhs-card` 保留兼容入口。

新站三页通过 Schema.org 官方验证：0 错误、0 警告。线上检查通过桌面/手机页面、四种比例各四页、16 张 PNG 完整文件一致性、翻页、层次、全屏、异常参数恢复、两个旧入口跳转和 schema 图片尺寸。一次旧案例页完整 load 等待超时，目标链接已确认正确；将跳转断言改为 domcontentloaded 后补验通过。未提交 Google Rich Results Test。


## 描述、面包屑与图片来源（2026-10-24）

对应代码提交：`967f316`。

- 首页 meta / Open Graph 与三页共享 JSON-LD 统一为「开源排版 Skill」，与页面实际功能一致。
- Playground、真实案例页新增可见面包屑及对应 `BreadcrumbList`；名称、层级和 URL 一致。
- 展示图片补充 `creditText`，分别注明 Ian 的排版参考、Oreo Design / Nicole Tang 的图标、Adobe / Google 的字体；包含真实照片的案例注明互通有无往期活动现场来源。
- 未确认摄影师、版权人或照片授权协议，因此不填写图片 `creator`、`copyrightNotice`、`license`，不把代码 MIT 当成照片许可。
- 三页线上 Schema.org 官方验证均为 0 错误、0 警告，已识别新版描述、图片署名与两个内页面包屑。本地与线上冒烟、手机与桌面布局检查通过；16 张 PNG 完整下载一致，翻页、比例切换、全屏、异常参数及旧链接跳转正常，浏览器运行错误为 0。
- Google Rich Results Test 本轮复验受浏览器空白页与超时影响，未取得可靠的新报告，不标为通过。此前首页与 Playground 的旧报告为未检测到富媒体结果，不代表本轮新增标记的测试结论。未进行 Search Console 收录提交。


## 素材确认与无品牌起稿（2026-10-24）

- 新稿 Todo 首项是素材确认：已给图先看，口述目录先定位，未给图问一次；已确认无图直接完成文字版。
- 新增独立 starter 与 new-project.py。默认品牌、署名、角标、页码均不渲染；不复制案例图。有明确照片时使用相纸窗口，截图/图表保持水平。
- 验收拆成必须修复、视觉复核、可选增强；18 个实际输入场景按需选用，不以固定字号、页数或装饰配额强迫内容删减。
- 实际运行 verify-starter.cjs：四种比例 × 文字/横图/竖图共 12 个组合，品牌开关、空字段不占位、原文按文本渲染、图片失败状态、长文保留、中文空格路径与图片完整复制、目录不覆盖均通过。图片用合成几何色块测试窗口，不冒充真实现场。
- 新旧 Reference 链接检查通过；已确认的案例 PNG 与站点成图未改动。样式目视复核了文字版与横版相纸布局。
- 这不是独立 Agent 效果评测：口述理解、素材相关性与最终 taste 仍需真实任务检验，不能从脚本通过推断所有 Agent 都会正确执行。

复现：`npm run verify:starter`。
