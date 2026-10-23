# 省心出图 · 发布验证

验证日期：2026-10-23。项目主命令 `$shengxin-chutu`，保留 `$xhs-card` 兼容入口。

## 公开页面

- [项目首页](https://derek-zhuolin.github.io/chutu/)
- [Playground](https://derek-zhuolin.github.io/chutu/shengxin-chutu/assets/playground/index.html)
- [真实案例](https://derek-zhuolin.github.io/chutu/shengxin-chutu/assets/approved-cases/index.html)

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
SITE_URL=https://derek-zhuolin.github.io/chutu/ npm run smoke
```

验证器入口：[Schema.org Validator](https://validator.schema.org/)。没有提交 Google Rich Results Test 或 Search Console，不将 schema 验证通过等同于 Google 已收录或一定展示富结果。
