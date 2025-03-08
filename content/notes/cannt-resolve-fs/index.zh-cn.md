---
title: "Cannt Resolve Fs"
date: 2022-07-15T17:39:23+08:00
tags:
  - Webpack
---
在使用 `graceful-fs` 模块时，可能会遇到以下错误：

## 错误描述

### 错误 1

```
error in ../dida-chc-app/node_modules/graceful-fs/graceful-fs.js

Module not found: Error: Can't resolve 'fs' in '/Users/maoxunxing/arise/dida-chc-app/node_modules/graceful-fs'
```

### 错误 2

```
error in ../dida-chc-app/node_modules/graceful-fs/legacy-streams.js

Module not found: Error: Can't resolve 'stream' in '/Users/maoxunxing/arise/dida-chc-app/node_modules/graceful-fs'
```

### 错误提示

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

---

## 问题原因

根据错误提示和常见场景分析，以下是可能的原因：

1. **Node.js 核心模块缺失**：
   - `graceful-fs` 是一个依赖 Node.js 核心模块（如 `fs` 和 `stream`）的库。
   - Webpack 5 不再默认为 Node.js 核心模块提供 polyfill，因此在浏览器环境中使用这些模块时会报错。

2. **Node 包与浏览器包混用**：
   - 某些库（如 `graceful-fs`）是专门为 Node.js 环境设计的，但在前端项目中被错误引入。
   - 这种情况通常发生在依赖树中某些模块未正确区分环境（Node.js 或浏览器）。

3. **Webpack 配置问题**：
   - 如果项目使用 Webpack 构建工具，且未正确配置 polyfill 或者未排除不适用于浏览器的模块，也会导致此类错误。

---

## 解决方案

### 方法 1：检查依赖并移除不必要的模块

- **步骤**：
  1. 检查项目的 `package.json` 文件，确认是否直接或间接引入了 `graceful-fs`。
  2. 如果该模块仅用于 Node.js 环境，而你的项目是浏览器应用，则需要移除相关依赖。
  3. 使用以下命令查看依赖树，定位引入 `graceful-fs` 的模块：
     ```bash
     npm ls graceful-fs
     ```
  4. 如果发现某些依赖项错误地引入了 `graceful-fs`，可以尝试升级或替换这些依赖。

### 方法 2：为 Webpack 添加 polyfill

- **步骤**：
  1. 安装必要的 polyfill 包：
     ```bash
     npm install --save-dev stream-browserify fs
     ```
  2. 修改 Webpack 配置文件（`webpack.config.js`），添加如下内容：
     ```javascript
     const webpack = require('webpack');

     module.exports = {
       resolve: {
         fallback: {
           fs: false, // 忽略 fs 模块
           stream: require.resolve('stream-browserify'), // 使用 polyfill 替代
         },
       },
       plugins: [
         new webpack.ProvidePlugin({
           process: 'process/browser', // 提供 process 对象
         }),
       ],
     };
     ```

### 方法 3：使用 `browser` 字段排除 Node.js 模块

- **步骤**：
  1. 在项目的 `package.json` 中添加 `browser` 字段，明确排除不适用于浏览器的模块：
     ```json
     {
       "browser": {
         "fs": false,
         "stream": false
       }
     }
     ```
  2. 这样可以告诉打包工具忽略这些模块，避免报错。

### 方法 4：升级依赖版本

- **步骤**：
  1. 检查 `graceful-fs` 的版本是否过旧。如果是，请升级到最新版本：
     ```bash
     npm install graceful-fs@latest
     ```
  2. 同时确保其他依赖项也处于最新版本，以减少兼容性问题。

---

## 补充说明

### 为什么会出现这种问题？

- **历史背景**：
  - 在 Webpack 4 及更早版本中，默认会为 Node.js 核心模块提供 polyfill，因此即使在浏览器环境中使用这些模块也不会报错。
  - Webpack 5 移除了这一默认行为，目的是减少不必要的体积膨胀，并鼓励开发者显式处理环境差异。

- **最佳实践**：
  - 在开发过程中，应尽量避免在浏览器项目中引入 Node.js 特定的模块。
  - 如果确实需要使用这些模块，可以通过 polyfill 或替代方案解决。



