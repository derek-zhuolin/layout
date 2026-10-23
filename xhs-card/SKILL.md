---
name: xhs-card
description: 省心出图的旧命令兼容入口。用户显式调用 $xhs-card 时，转到已安装的 shengxin-chutu Skill，制作轮播、长卡和 Keynote 式 deck。
---

# 省心出图 · 旧命令兼容

这是 `$xhs-card` 的兼容入口，主命令为 `$shengxin-chutu`。

先读取 [省心出图完整 Skill](../shengxin-chutu/SKILL.md)，严格执行其规则；所有相对资源路径均以 `shengxin-chutu/` 为根目录解析。用户当前输入直接延续，不重复询问已明确的信息。

安装时请把仓库的 `shengxin-chutu/` 和 `xhs-card/` 一起复制到 Skill 目录。若主包缺失，告知缺少主包，不虚构已安装成功。
