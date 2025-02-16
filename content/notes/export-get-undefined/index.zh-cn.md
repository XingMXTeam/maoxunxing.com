---
title: "Export Get Undefined"
date: 2021-11-25T15:05:52+08:00
---

在 TypeScript 或 JavaScript 项目中，模块之间的依赖关系需要特别注意。如果存在 **循环引用**（Circular Dependency），可能会导致某些模块的导出值为 `undefined`。

## 问题描述

### 文件 `a.ts`

```ts
export const xx = "123";
```

### 文件 `b.ts`

```ts
import { xx } from "a";
console.log(xx); // 输出 undefined
```

### 现象

- 在 `b.ts` 中，尝试从 `a.ts` 导入 `xx`，但运行时发现 `xx` 的值为 `undefined`。
- 这种情况通常是由于 **循环引用** 引发的问题。

---

## 原因分析

### 什么是循环引用？

循环引用指的是两个或多个模块相互导入彼此的内容，形成一个闭环。例如：

- `a.ts` 导入了 `b.ts` 的内容。
- `b.ts` 又反过来导入了 `a.ts` 的内容。

在这种情况下，模块加载器（如 Node.js 或打包工具）会尝试按需加载模块，但由于循环依赖的存在，可能导致某些模块尚未完全初始化就被访问，从而导致导出值为 `undefined`。

---

## 示例复现

### 文件 `a.ts`

```ts
import { yy } from "./b"; // a.ts 导入了 b.ts 的内容
export const xx = "123";
console.log("yy in a.ts:", yy);
```

### 文件 `b.ts`

```ts
import { xx } from "./a"; // b.ts 导入了 a.ts 的内容
export const yy = "456";
console.log("xx in b.ts:", xx); // 输出 undefined
```

### 运行结果

1. `xx in b.ts: undefined`
2. `yy in a.ts: 456`

**原因**：

- 当 `b.ts` 尝试从 `a.ts` 导入 `xx` 时，`a.ts` 尚未完成初始化（因为它正在等待 `b.ts` 的内容）。
- 因此，`xx` 的值在 `b.ts` 中被解析为 `undefined`。

---

## 解决方案

### 方法 1：避免循环引用

- **最佳实践**：重构代码，避免模块之间的循环依赖。
- 将公共逻辑提取到第三方模块中，供 `a.ts` 和 `b.ts` 共同使用。

#### 示例重构

创建一个新的文件 `common.ts`：

```ts
export const xx = "123";
export const yy = "456";
```

修改 `a.ts`：

```ts
import { yy } from "./common";
console.log("yy in a.ts:", yy);
```

修改 `b.ts`：

```ts
import { xx } from "./common";
console.log("xx in b.ts:", xx);
```

---

### 方法 2：延迟访问依赖

如果无法完全避免循环引用，可以通过延迟访问依赖的方式解决问题。例如，在函数调用时再访问依赖，而不是在模块顶层直接访问。

#### 示例调整

修改 `a.ts`：

```ts
import { getYy } from "./b";

export const xx = "123";
console.log("yy in a.ts:", getYy());
```

修改 `b.ts`：

```ts
import { xx } from "./a";

export function getYy() {
  return "456";
}
console.log("xx in b.ts:", xx);
```

**效果**：

- `getYy` 是一个函数，只有在调用时才会访问 `b.ts` 的内容，从而避免了初始化顺序问题。

---

## 总结

1. **循环引用** 是导致模块导出值为 `undefined` 的常见原因。
2. **解决方案**：
   - 优先重构代码，避免循环依赖。
   - 如果无法避免，可以通过延迟访问依赖的方式解决。
3. 在开发过程中，建议使用工具（如 [madge](https://github.com/pahen/madge)）检测项目中的循环依赖，提前发现问题。
