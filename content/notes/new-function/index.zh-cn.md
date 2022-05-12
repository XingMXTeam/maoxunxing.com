---
title: "New Function"
date: 2022-05-12T17:18:17+08:00
---

```ts
var a = new Function("this.xx") //这里的a必须显示地被调用，才能让this有值，否则是全局的window

```
