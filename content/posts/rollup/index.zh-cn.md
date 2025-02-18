---
title: "Rollup 配置文件详解"
date: 2025-02-06
---

Rollup 是一个流行的 JavaScript 模块打包工具，适用于构建现代前端应用和库。本文将通过一个简单的 Rollup 配置文件示例，详细说明其核心配置项及其作用。

---

## 目录

1. [Rollup 简介](#rollup-简介)
2. [配置文件解析](#配置文件解析)
   - [入口文件](#入口文件)
   - [输出配置](#输出配置)
   - [插件](#插件)
3. [完整配置示例](#完整配置示例)

---

## Rollup 简介

Rollup 是一个模块化打包工具，专注于 ES 模块（ESM）的打包。它能够高效地将多个模块合并为一个或多个文件，并支持多种输出格式（如 ESM、CommonJS、UMD 等）。Rollup 的配置文件通常是一个 JavaScript 文件，用于定义打包行为。

---

## 配置文件解析

以下是对 Rollup 配置文件中各部分的详细解析。

### 入口文件

```js
input: 'src/index.js',       // 入口文件
```

- **作用**：指定打包的入口文件路径。
- **说明**：
  - `input` 是 Rollup 的核心配置项之一，用于告诉 Rollup 从哪个文件开始分析依赖关系。
  - 示例中的入口文件是 `src/index.js`，这是项目的主文件。

---

### 输出配置

```js
output: {
  file: 'dist/bundle.js',    // 输出文件
  format: 'esm',             // 输出格式：ES模块
},
```

- **作用**：定义打包后的输出文件及其格式。
- **关键字段**：
  - `file`：指定输出文件的路径和名称。
  - `format`：指定输出文件的模块格式。
    - 常见格式包括：
      - `esm`：ES 模块格式（推荐用于现代浏览器和 Node.js）。
      - `cjs`：CommonJS 格式（适用于 Node.js）。
      - `umd`：通用模块格式（兼容浏览器和 Node.js）。
  - 示例中，输出文件为 `dist/bundle.js`，格式为 `esm`。

---

### 插件

```js
plugins: [
  resolve(),                 // 使用 node-resolve 插件
],
```

- **作用**：通过插件扩展 Rollup 的功能。
- **常用插件**：
  - `@rollup/plugin-node-resolve`：解析第三方模块（如 `node_modules` 中的依赖）。
  - `@rollup/plugin-commonjs`：将 CommonJS 模块转换为 ES 模块。
  - `@rollup/plugin-babel`：使用 Babel 进行代码转译。
  - `rollup-plugin-terser`：压缩输出文件。
- **说明**：
  - 示例中使用了 `resolve()` 插件，用于解析外部依赖模块。

---

## 完整配置示例

以下是完整的 Rollup 配置文件代码：

```js
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',       // 入口文件
  output: {
    file: 'dist/bundle.js',    // 输出文件
    format: 'esm',             // 输出格式：ES模块
  },
  plugins: [
    resolve(),                 // 使用 node-resolve 插件
  ],
};
```

---

## 总结

Rollup 的配置文件简单而灵活，适合构建现代化的 JavaScript 库和应用。通过合理配置入口文件、输出选项和插件，可以轻松实现高效的模块打包。