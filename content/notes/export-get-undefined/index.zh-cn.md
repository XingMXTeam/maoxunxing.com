---
title: "Export Get Undefined"
date: 2021-11-25T15:05:52+08:00
---

情况说明：

a.ts:

```ts
export const xx = "123";
```

b.ts:

```ts
import { xx } from "a";
console.log(xx); // got undefined
```

这个一般是循环引用导致的
