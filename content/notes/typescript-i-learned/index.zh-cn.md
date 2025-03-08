---
title: "Typescript类型实践"
date: 2021-12-22T18:06:49+08:00
tags:
  - TypeScript
---

## **1. 报错：元素隐式具有 "any" 类型**

### **问题描述**

在以下代码中，出现报错：
> 元素隐式具有 "any" 类型，因为索引表达式的类型不为 "number"。

```ts
const GLOBAL_SYMBOL = Symbol.for('xxx');

if (!window[GLOBAL_SYMBOL]) {
  window[GLOBAL_SYMBOL] = {};
}
```

### **解决方案**

在根目录声明 `global.d.ts` 文件，并扩展 `Window` 接口以支持 `Symbol` 类型的索引签名：

```ts
declare interface Window {
  [GLOBAL_SYMBOL: symbol]: {};
}
```

---

## **2. 报错：Could not find a declaration file for module 'js-cookie'**

### **问题描述**

在使用 `js-cookie` 模块时，出现以下报错：
> Could not find a declaration file for module 'js-cookie'. '/Users/maoxunxing/alibaba/ae-data-util/node_modules/_js-cookie@3.0.1@js-cookie/index.js' implicitly has an 'any' type.

### **解决方案**

在项目中声明模块类型，解决缺少类型声明的问题：

```ts
declare module "js-cookie" {
  export interface CookieAttributes {}
}
```

### **参考资料**

- [Could not find a declaration file for module 'module-name'](https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam)
- [Could not find a declaration file for module 'module-name'](https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam)

---

## declare const window: any; 文件内部声明window

## 全局变量声明

本地创建一个文件`declaration.d.ts` 或者 `global.d.ts`

```ts
declare module '*.scss' {

}

interface Window {

}

```