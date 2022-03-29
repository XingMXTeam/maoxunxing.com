---
title: "Typescript类型报错"
date: 2021-12-22T18:06:49+08:00
---

报错：元素隐式具有 "any" 类型，因为索引表达式的类型不为 "number"

``` TS
const GLOBAL_SYMBOL = Symbol.for('xxx');

if (!window[GLOBAL_SYMBOL]) {
  window[GLOBAL_SYMBOL] = {};
}
```

根目录声明global.d.ts: 

``` ts
declare interface Window {
  [GLOBAL_SYMBOL: symbol]: {};
}
```

---

Could not find a declaration file for module 'js-cookie'. '/Users/maoxunxing/alibaba/ae-data-util/node_modules/_js-cookie@3.0.1@js-cookie/index.js' implicitly has an 'any' type.

解决方案：

```ts
declare module 'js-cookie' {
  export interface CookieAttributes {
    
  }
}
```

> https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

> https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

---

