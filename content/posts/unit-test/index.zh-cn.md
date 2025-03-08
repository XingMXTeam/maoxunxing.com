---
title: "如何写单测"
date: 2021-08-27T10:20:36+08:00
description: ""
images:
  - unit-test/unit-test.jpeg
tags:
  - React
  - Web开发
---

本文档详细介绍了如何在 TypeScript 项目中配置单元测试工具（如 Mocha）和代码覆盖率工具（如 NYC），并提供了相关依赖库的使用说明。适合需要快速搭建测试环境的开发者。

---

## 目录

1. [单测](#单测)
   - [Mocha 配置](#mocha-配置)
   - [相关依赖](#相关依赖)
2. [覆盖率](#覆盖率)
   - [NYC 配置](#nyc-配置)
   - [Lerna 下统计覆盖率](#lerna-下统计覆盖率)
3. [常用 npm 包](#常用-npm-包)

---

## 单测

### Mocha 配置

#### 安装依赖
```bash
npm install --save-dev mocha @types/mocha ts-node
```

#### 配置 `mocha.opts`
在项目根目录下创建 `mocha.opts` 文件，内容如下：
```
--require ts-node/register
test/**/*.test.ts
```

#### 示例代码
```js
import "mocha";

describe("示例测试", () => {
  it("应该通过测试", () => {
    const result = 1 + 1;
    if (result !== 2) {
      throw new Error("测试失败");
    }
  });
});
```

---

## 覆盖率

### NYC 配置

#### 安装依赖
```bash
npm install --save-dev nyc
```

#### 配置 `package.json`
在 `package.json` 中添加以下配置：
```json
{
  "nyc": {
    "include": [
      "src/*.ts",
      "src/**/*.ts"
    ],
    "exclude": [
      "typings",
      "dist"
    ],
    "extensions": [
      ".ts"
    ],
    "require": [
      "ts-node/register"
    ],
    "reporter": [
      "json",
      "html"
    ],
    "all": true
  }
}
```

#### 运行命令
在 `package.json` 的 `scripts` 中添加以下脚本：
```json
"scripts": {
  "cov": "nyc mocha"
}
```
运行命令：
```bash
npm run cov
```

---

### Lerna 下统计覆盖率

如果项目使用 Lerna 管理多包结构，可以通过以下方式统计覆盖率：
```bash
nyc lerna run cov --concurrency=1
```

#### 配置 `nyc` 子进程注入
在 `nyc` 配置中添加以下内容：
```json
{
  "include": [
    "packages/*/src/*.ts",
    "packages/*/src/**/*.ts"
  ],
  "exclude": [
    "**/typings",
    "**/*.d.ts",
    "**/dist",
    "**/src/index.ts"
  ],
  "extensions": [
    ".ts"
  ],
  "reporter": [
    "json",
    "html"
  ],
  "all": true
}
```

> **注意**：`nyc` 和 `ts-node` 只需在顶层安装即可。

---

## 常用 npm 包

以下是常用的 npm 包及其功能说明：

### HTTP 请求相关
- **whatwg-fetch**
  - 提供 `fetch` API 的 polyfill，用于兼容不支持原生 `fetch` 的环境。
- **msw**
  - Mock Service Worker，用于拦截和模拟 HTTP 请求。
  - **setupServer**
    - 创建一个服务端 mock 服务器。
  - **msw/node**
    - 提供 Node.js 环境下的 mock 支持。

### 测试工具
- **@testing-library/react**
  - React 组件测试库，提供以下方法：
    - `render`: 渲染组件。
    - `fireEvent`: 触发事件。
    - `waitFor`: 异步等待某个条件满足。
    - `screen`: 获取 DOM 元素。
- **@testing-library/jest-dom/extend-expect**
  - 扩展 Jest 的断言方法，例如 `toBeInTheDocument`。
