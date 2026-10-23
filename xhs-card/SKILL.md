---
name: xhs-card
description: Layout的旧命令兼容入口。用户显式调用 $xhs-card 时，转到已安装的 layout Skill，制作轮播、长卡和 Keynote 式 deck。
---

# Layout · 旧命令兼容

这是 `$xhs-card` 的兼容入口，主命令为 `$layout`。

先读取 [Layout完整 Skill](../layout/SKILL.md)，严格执行其规则；所有相对资源路径均以 `layout/` 为根目录解析。用户当前输入直接延续，不重复询问已明确的信息。

安装时请把仓库的 `layout/` 和 `xhs-card/` 一起复制到 Skill 目录。若主包缺失，告知缺少主包，不虚构已安装成功。
