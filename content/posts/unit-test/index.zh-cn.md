---
title: "[WIP] 如何写单测"
date: 2021-08-27T10:20:36+08:00
description: ""
images:
  - unit-test/unit-test.jpeg
---

## 单测

@types/mocha
ts-node

mocha.opts

```
--require ts-node/register
test/**/*.test.ts
```

```js
import "mocha";
```

## 覆盖率

```js
// cov: nyc mocha
npm run cov
```

```js
{
  "nyc": {
    "include": {
      "src/*.tx",
      "src/**/*.ts"
    },
    "exclude": {
      "typings",
      "dist"
    },
    "extensions": {
      ".ts"
    },
    "require": {
      "ts-node/register"
    },
    "reporter": {
      "json",
      "html"
    },
    "all": true
  }
}
```

lerna 下统计测试覆盖率

```js
nyc lerna run cov --concurrency = 1
```

spawn-wrapper 注入子进程

```js
{
  "include": [
    "packages/*/src/*.ts",
    "packages/*/src/**/*.ts"
  ],
  "exclude": [
    "**/typings",
    "**/*.d.ts",
    "**/dist",
    "**/src/index.ts",
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

nyc，ts-node 只在顶层安装

## npm包

- whatwg-fetch
- msw
  - setupServer
- msw/node
- @testing-library/react
  - render
  - fireEvent
  - waitFor
  - screen
- @testing-library/jest-dom/extend-expect

