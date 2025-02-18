---
title: "前端工程化与构建体系指南"
date: 2025-02-06
tags:
  - Engineer
---

在现代前端开发中，工程化和构建体系是提升开发效率、保障项目稳定性的关键。本文将从 **工程目录拆分**、**如何从头开始构建一个工程体系**、**插件化构建工具**、**资源管理**、**稳定性保障** 和 **运行时与构建时的核心机制** 等方面展开讨论，并提供详细的说明和代码示例。

---

## 目录

1. [工程目录拆分](#工程目录拆分)
2. [如何从头开始构建一个工程体系](#如何从头开始构建一个工程体系)
3. [插件化构建工具（build-scripts）](#插件化构建工具build-scripts)
4. [资源管理](#资源管理)
5. [稳定性保障](#稳定性保障)
6. [Lerna 多包管理](#lerna-多包管理)
7. [总论：构建时与运行时](#总论构建时与运行时)
8. [常用 NPM 包](#常用-npm-包)
9. [常见问题解决](#常见问题解决)

---

## 工程目录拆分

### 背景
在一个老的工程中进行页面改版升级时，是否选择新建目录隔离新老页面，还是直接在旧页面上改造？

### 专业技术建议
- **推荐方案**：尽量在旧页面上进行改造，避免多份副本带来的维护性问题。
- **理由**：
  - 新建目录可能导致逻辑分散，增加维护成本。
  - 在旧页面上改造可以复用现有组件和逻辑，减少重复开发。

---

## 如何从头开始构建一个工程体系

### 初始化项目
1. 使用 GitHub 初始化项目仓库。
2. 使用 Lerna 初始化多包结构：
   ```bash
   npx lerna init
   ```
3. 初始化 TypeScript 配置：
   ```bash
   npx tsc --init
   ```

### 添加缓存支持
```bash
npx lerna add-caching
```

### 创建核心包
创建一个新的包 `app-core`：
```bash
npx create app-core --es-module
```

### 配置 TypeScript
在 `package.json` 中添加以下配置：
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./lib"
  },
  "include": [
    "./src"
  ]
}
```

### 修改构建脚本
在 `package.json` 中添加以下脚本：
```json
"scripts": {
  "tsc": "tsc",
  "test": "node ./__tests__/app-core.test.js",
  "start": "ts-node src/app-core.ts",
  "publish": "lerna run tsc && lerna publish"
}
```

### 运行构建
使用 Lerna 运行构建命令：
```bash
lerna run tsc
```

### 修改发布路径
将 `dist` 改为 `lib`：
```json
"main": "lib/app-core.js",
"module": "lib/app-core.module.js",
"directories": {
  "lib": "lib",
  "test": "__tests__"
},
"files": [
  "lib"
]
```

---

## 插件化构建工具（build-scripts）

### 核心概念
`build-scripts` 是一个基于 Webpack 的插件化工程构建工具，支持快速搭建一套开箱即用的工程方案。

> 一次性启动，会启动三个服务

### 示例插件
以下是一个忽略 `moment` 本地化的插件示例：
```js
const webpack = require('webpack');

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
  });
};
```

---

## 资源管理

### 静态资源发布
静态资源可以发布到以下位置：
- assets/tnpm/Faas/webapp/小程序/weex

### 本地构建与云端构建
- **本地构建**：使用代码仓库的目录。
- **云端构建**：动态构建并发布。

### WebApp 构建
WebApp 包括 HTML 文件，`assets` 会动态同步到 CDN。

---

## 稳定性保障

### 流控与降级
- **流控**：限制流量以保护系统。
- **降级**：在高负载情况下关闭部分非核心功能。

### 过载保护
通过限流和降级策略，确保系统在高并发场景下的稳定性。

---

## Lerna 多包管理

### Link 包
在多包项目中，可以通过以下命令链接包：
```bash
lerna add @hospital-sdk/doctor --scope=integration
```

---

## 总论：构建时与运行时

### 构建时
构建时的核心是 `build-scripts`，它通过 `Context` 对象管理插件的运行。构建时的主要任务包括：
- **生成产物**：如 JS/CSS 文件 (分端构建)。
- **启动服务**：如本地开发服务器。
- **插件机制**：插件可以动态更新配置项或执行 IO 操作。

> 内部有Context对象管理插件的运行，会依次运行注册的插件。其中WebpackService是Context的一个实例。

#### 插件加载
`build.json` 中配置的插件名会被 Node 加载：

> node可以根据（插件名+默认目录）加载这些插件，加载后会获得fn构造函数

```js
const pluginPath = require.resolve('webpack', { paths: [this.rootDir] });
let fn = require(pluginPath);
fn = fn.default || fn || (() => void);
```

### 运行时
运行时的核心是微应用容器，是一个技术容器，主要包括以下内容：
- **主应用与子应用通信**：通过消息总线共享实例。
- **生命周期管理**：通过 `namespace` 的 `flow` 对象管理。
- **路由管理**：使用 `react-router` 的核心代码, 只有一个history对象。

> ice的runtimemodule插件逻辑（实例化了两个运行时对象）
> message对象共享实例，每个微应用都会创建一个message实例
> 入口文件会自动包裹生命周期函数
> 运行时会加载运行时插件，并且渲染运行时容器
> 解决运行时polyfill问题： import 'core-js/stable';  import 'regenerator-runtime/runtime';
> @ice/stark-module管理微应用渲染
> @ice/stark-data 管理数据

#### 示例调度函数
以下是一个简单的调度函数实现：
```js
export function schedule(cb: (...args: any[]) => any) {
  let _promise: Promise<any> | null = null;
  return (...args: any[]) => {
    if (_promise) {
      return;
    }
    _promise = Promise.resolve().then(() => {
      cb(...args);
      _promise = null;
    });
  };
}
```

---

## 常用 NPM 包

以下是一些常用的 NPM 包及其用途：
- **fast-blob**：快速处理二进制数据。
- **es-module-lexer**：ES 模块词法分析器。
- **esbuild**：高性能的 JavaScript/TypeScript 构建工具。
- **globby**：文件匹配工具。
- **fs-extra**：增强版文件系统操作库。
- **chalk**：终端美化工具。
- **chokidar**：监听文件变化。
- **object-hash**：生成对象的哈希值。
- **code-red**： 轻量级的 JavaScript AST（抽象语法树）操作工具。
- **periscopic**：作用域分析工具。
- **estree-walker**：遍历和操作 ESTree 格式的 AST。
- **@types/estree**：ESTree 的 TypeScript 类型定义。
- **acorn**：轻量级的 JavaScript 解析器。
- **cheerio**：服务器端的 jQuery 实现。
- **mkdirp**：递归创建目录。
- **debug**：轻量级调试工具。

---

## 常见问题解决

### OpenSSL 配置问题
在 Node.js 中遇到以下错误：
```
node: --openssl-legacy-provider is not allowed in NODE_OPTIONS
```

#### 解决方法
升级 Node.js 到最新版本，或者在环境变量中移除 `NODE_OPTIONS` 的相关配置。

