---
title: "Export Get Undefined"
date: 2021-11-25T15:05:52+08:00
---

a.ts:

```ts
export const xx = "123";
```

b.ts:

```ts
import { xx } from "a";
console.log(xx); // got undefined
```

This is usually caused by circular references
