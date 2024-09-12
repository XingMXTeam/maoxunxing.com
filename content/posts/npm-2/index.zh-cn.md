---
title: "NPM日记 #2期：多入口组件库指定ts类型定义"
description: "package.json的exports和typesVersion使用方法"
date: 2024-09-12
tags:
  - NPM日记
images:
  - npm-2/npm.webp
---

{{< table_of_contents >}}

## exports

组件导出声明：
```js
// Button/index.ts
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```

`package.json` 需要修改为:

```json
{
  "name": "my-component-library",
  "version": "1.0.0",
  "main": "cjs/index.js",
  "module": "esm/index.js",
  "types": "esm/types/index.d.ts", // 指定主入口的类型文件
  "exports": {
    "./button": {
      "require": "./cjs/Button/index.js",
      "import": "./esm/Button/index.js",
      "types": "./esm/types/Button/index.d.ts" // 指定 Button 组件的类型定义
    },
    "./modal": {
      "require": "./cjs/Modal/index.js",
      "import": "./dist/Modal/index.js",
      "types": "./cjs/types/Modal/index.d.ts" // 指定 Modal 组件的类型定义
    }
  }
}
```

tsconfig.json 需要修改为：

```json
{
  "compilerOptions": {
    "moduleResolution": "node16", //  TypeScript 4.7 及以上版本引入的新选项，支持 Node.js 16 及更高版本的 ESM（ECMAScript Modules） 模块解析方式。
    "declaration": true, // 开启类型定义文件生成
    "declarationDir": "./esm/types", // 指定类型定义文件的输出路径
    "outDir": "./dist", // 编译输出的目录
  }
}
```

## typesVersion

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/cjs/index.js",  // CommonJS 入口
  "module": "dist/esm/index.js", // ESM 入口
  "types": "dist/cjs/index.d.ts", // 默认类型定义文件
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "import": "./dist/esm/index.js"
    }
  },
  "typesVersions": {
    "<4.5": { // 针对较低版本 TypeScript 使用的类型定义
      "*": ["dist/cjs/index.d.ts"]
    },
    ">=4.5": { // 针对 TypeScript 4.5 及更高版本
      "*": ["dist/esm/index.d.ts"]
    }
  }
}

```