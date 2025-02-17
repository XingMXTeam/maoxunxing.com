---
title: "多入口组件库指定ts类型定义"
description: "package.json的exports和typesVersion使用方法"
date: 2024-09-12
tags:
  - NPM
images:
  - npm-2/npm.webp
---

在构建现代 JavaScript/TypeScript 组件库时，合理配置模块导出和类型定义是至关重要的。以下是如何通过 `exports` 字段、`typesVersions` 字段以及 `tsconfig.json` 配置来实现模块化支持和类型兼容性的详细说明。

## 组件导出声明

### 示例：组件导出
在组件库中，通常需要为每个组件提供默认导出和类型定义。例如：

```javascript
// Button/index.ts
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```

### `package.json` 的 `exports` 字段
为了支持 CommonJS 和 ESM 模块系统，同时提供类型定义文件，可以在 `package.json` 中使用 `exports` 字段进行细粒度的模块导出配置。

```json
{
  "name": "my-component-library",
  "version": "1.0.0",
  "main": "cjs/index.js", // CommonJS 入口
  "module": "esm/index.js", // ESM 入口
  "types": "esm/types/index.d.ts", // 主入口的类型定义文件
  "exports": {
    "./button": {
      "require": "./cjs/Button/index.js", // CommonJS 导入路径
      "import": "./esm/Button/index.js", // ESM 导入路径
      "types": "./esm/types/Button/index.d.ts" // Button 组件的类型定义
    },
    "./modal": {
      "require": "./cjs/Modal/index.js", // CommonJS 导入路径
      "import": "./dist/Modal/index.js", // ESM 导入路径
      "types": "./cjs/types/Modal/index.d.ts" // Modal 组件的类型定义
    }
  }
}
```

---

## TypeScript 配置 (`tsconfig.json`)

为了确保 TypeScript 能正确解析模块并生成类型定义文件，需要对 `tsconfig.json` 进行适当配置。

### 示例配置
```json
{
  "compilerOptions": {
    "moduleResolution": "node16", // 支持 Node.js 16+ 的 ESM 模块解析方式
    "declaration": true, // 开启类型定义文件生成
    "declarationDir": "./esm/types", // 类型定义文件的输出目录
    "outDir": "./dist", // 编译输出的目录
    "target": "ESNext", // 目标 ECMAScript 版本
    "module": "ESNext", // 使用 ES 模块
    "strict": true // 启用严格模式
  }
}
```

### 重启 TypeScript 服务器
修改 `tsconfig.json` 后，建议重启 TypeScript 服务器以确保配置生效：
1. 打开 VSCode 命令面板（`Ctrl + Shift + P` 或 `Cmd + Shift + P`）。
2. 输入 `TypeScript: Restart TS Server` 并按下回车。

---

## 根据 TypeScript 版本提供类型定义

为了兼容不同版本的 TypeScript，可以使用 `typesVersions` 字段为不同的 TypeScript 版本指定对应的类型定义文件。

### 示例配置
```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/cjs/index.js", // CommonJS 入口
  "module": "dist/esm/index.js", // ESM 入口
  "types": "dist/cjs/index.d.ts", // 默认类型定义文件
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js", // CommonJS 导入路径
      "import": "./dist/esm/index.js" // ESM 导入路径
    }
  },
  "typesVersions": {
    "<4.5": { // 针对 TypeScript < 4.5 的类型定义
      "*": ["dist/cjs/index.d.ts"]
    },
    ">=4.5": { // 针对 TypeScript >= 4.5 的类型定义
      "*": ["dist/esm/index.d.ts"]
    }
  }
}
```

### 说明
- **`<4.5`**：针对较低版本的 TypeScript，使用 CommonJS 类型定义文件。
- **`>=4.5`**：针对 TypeScript 4.5 及更高版本，使用 ESM 类型定义文件。

---

## 总结

通过合理的配置，可以确保组件库在不同模块系统（CommonJS 和 ESM）和 TypeScript 版本下都能正常工作。以下是关键点总结：

1. **`exports` 字段**  
   - 提供细粒度的模块导出配置，支持 CommonJS 和 ESM。
   - 明确指定每个组件的类型定义文件路径。

2. **`tsconfig.json` 配置**  
   - 使用 `moduleResolution: "node16"` 支持现代模块解析方式。
   - 开启类型定义文件生成，并指定输出目录。

3. **`typesVersions` 字段**  
   - 根据 TypeScript 版本提供兼容的类型定义文件，确保向后兼容性。

4. **开发体验优化**  
   - 修改 `tsconfig.json` 后记得重启 TypeScript 服务器，避免缓存问题。

通过以上配置，你的组件库将具备更高的模块化支持、更好的类型兼容性和更优的开发体验。