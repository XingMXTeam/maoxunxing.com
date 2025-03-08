---
title: "Lerna 多包项目中 @types/node 版本冲突导致的 TypeScript 编译报错"
date: 2025-02-24
tags:
  - typescript
---

## 目录

1. [问题背景](#问题背景)
2. [错误描述](#错误描述)
3. [问题分析](#问题分析)
4. [解决方案](#解决方案)
---

## 问题背景

在使用 Lerna 管理的多包项目中，执行编译时出现了 TypeScript 报错。经过排查，发现问题与 `node`、`typescript` 和 `@types/node` 的版本兼容性有关。

---

## 错误描述

编译过程中，TypeScript 报出了以下错误：

```text
[TS Error] '(' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:309:91)

[TS Error] ',' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:312:51)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:312:75)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:313:4)

[TS Error] ')' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:314:15)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:314:49)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:315:24)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:315:65)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:316:4)
```

这些错误均指向 `@types/node` 的类型定义文件 `https.d.ts`，表明类型定义文件中存在语法问题。

---

## 问题分析

根据错误提示和进一步排查，得出以下结论：

1. **版本不兼容**：
   - 当前项目中使用的 `@types/node` 版本为 `22.13.5`，而项目的 `typescript` 版本为 `^4.1.3`。
   - `@types/node` 的高版本（如 `22.x`）可能引入了新的语法或特性，而低版本的 `typescript` 无法解析这些新特性，从而导致编译报错。

2. **子包依赖问题**：
   - 在 Lerna 管理的多包项目中，根目录的 `package.json` 配置了 `"overrides"` 和 `"resolutions"` 来强制指定 `@types/node` 的版本为 `16.18.68`。
   - 然而，子包中仍然依赖了更高版本的 `@types/node`（`22.13.5`），并且在执行 `npm run build` 后动态安装了该版本。

3. **`skipLibCheck` 配置无效**：
   - 虽然已经在 `tsconfig.json` 中设置了 `"skipLibCheck": true`，但该配置仅跳过库类型的检查，并不能解决版本冲突的根本问题。

---

## 解决方案

### 1. 根目录版本降级

首先，在根目录的 `package.json` 中尝试通过 `overrides` 和 `resolutions` 强制指定 `@types/node` 的版本为 `16.18.68`：

```json
"overrides": {
  "@types/node": "16.18.68"
},
"resolutions": {
  "@types/node": "16.18.68"
}
```

同时，将 `node` 和 `typescript` 的版本分别降级到兼容范围：

```json
"node": "20",
"typescript": "^4.1.3"
```

然而，这种方式并未完全解决问题，因为子包中仍然会动态安装高版本的 `@types/node`。

---

### 2. 子包单独指定版本

为了彻底解决子包中的版本冲突问题，在每个子包的 `package.json` 中单独添加 `resolutions` 配置，强制指定 `@types/node` 的版本为 `16.18.68`：

```json
"resolutions": {
  "@types/node": "16.18.68"
}
```

这样可以确保子包在安装依赖时不会引入高版本的 `@types/node`。

---

### 3. 清理并重新安装依赖

执行以下命令清理项目并重新安装依赖：

```bash
lerna clean -y
npm install
```

确保所有子包的 `node_modules` 已被正确清理，并重新安装指定版本的依赖。

---

### 4. 验证解决方案

执行 `npm run build` 进行编译，确认不再出现上述 TypeScript 报错。










