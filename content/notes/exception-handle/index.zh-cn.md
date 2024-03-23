---
title: "前端异常处理"
date: 2021-08-24
tags:
  - front-end
  - programming
  - exception-handle
description: ""
images:
  - exception-handle/eception-handle.png
---

1 异常隔离 : 主要场景 vm js 代码

```ts
try {
} catch {}
```

2 promise 异常处理: 主要场景处理 try catch 无法捕获的异常

```ts
promise.then().catch();
```
