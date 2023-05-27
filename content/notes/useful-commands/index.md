---
title: "删除所有node_modules"
date: 2021-11-15T14:13:17+08:00
draft: true
---

```shell
find . -name "node_modules" -type d -prune -print -exec rm -rf "{}" \;
```
