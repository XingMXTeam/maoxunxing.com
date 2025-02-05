---
title: "页面允许以iframe方式嵌入"
date: 2022-03-27T14:48:25+08:00
tags:
  - Security
  - Web Development
  - CSP
---

```shell
Content-Security-Policy: frame-ancestors self https://xxxx
```

通过增加这个，允许 iframe 被嵌入
