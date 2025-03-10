---
title: "NPM 你需要知道的"
description: ""
date: 2024-09-10
tags:
  - NPM
  - Web开发
images:
  - npm/npm.webp
custom_toc:
  - title: "npm vs pnpm"
  - title: "组件库TS类型定义"
  - title: "UNPKG"
  - title: "package.json 字段解析"
  - title: "files"
  - title: "删除node_modules"
  - title: "npm link"
---

## npm vs pnpm

## 什么是幽灵依赖？
**幽灵依赖（Ghost Dependencies）** 是指项目中使用了未在 `package.json` 中明确声明的依赖。这种情况通常发生在 npm 和 Yarn 中，因为它们的扁平化依赖结构允许访问未直接声明的包。

### 示例
假设你的项目直接依赖 `express`：
```json
{
  "dependencies": {
    "express": "4.17.1"
  }
}
```
`express` 依赖于 `body-parser`，因此 `body-parser` 也会被安装到 `node_modules` 中。

在你的代码中，你可以直接使用 `body-parser`，尽管没有在 `package.json` 中声明它：
```javascript
const bodyParser = require('body-parser');
```

这段代码能够运行，但 `body-parser` 实际上是一个 **幽灵依赖**。

### 存在的问题
1. **可靠性问题**  
   如果未来 `express` 不再依赖 `body-parser`，你的代码可能会突然崩溃。
   
2. **版本不一致**  
   不同的开发者可能安装不同版本的依赖，导致项目行为不一致。

3. **维护困难**  
   幽灵依赖让项目的依赖关系变得模糊，增加了维护成本。

## pnpm 解决的问题

pnpm 通过严格的依赖树结构和优化的存储机制，解决了传统包管理工具（如 npm 和 Yarn）中的许多问题，包括幽灵依赖问题。

### 1. 磁盘空间效率
- **特点**：pnpm 使用硬链接和符号链接来共享包，避免重复安装相同的包。
- **解决的问题**：减少了磁盘空间的使用，尤其是在大型项目中效果显著。

### 2. 安装速度
- **特点**：pnpm 通常比 npm 更快，特别是在安装大型项目依赖时。
- **解决的问题**：加快了项目的初始设置和依赖更新过程，提高了开发效率。

### 3. 依赖管理
- **特点**：pnpm 使用严格的依赖树结构，只允许访问明确声明的依赖。
- **解决的问题**：消除了“幽灵依赖”问题，提高了项目的可靠性和可维护性。

### 4. 单一存储
- **特点**：pnpm 在系统中维护一个集中的包存储（全局存储），所有项目共享这些包。
- **解决的问题**：进一步节省磁盘空间，同时加快了多个项目的包安装速度。

### 5. 并行安装
- **特点**：pnpm 默认并行安装包，充分利用多核 CPU 的性能。
- **解决的问题**：减少了大型项目的依赖安装时间，提升了安装效率。

### 6. 更好的锁文件
- **特点**：pnpm 的锁文件（`pnpm-lock.yaml`）更加简洁且易于版本控制。
- **解决的问题**：改善了团队协作和版本一致性，确保不同环境下的依赖安装结果一致。

---


## 组件库TS类型定义

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
## UNPKG

[UNPKG](https://unpkg.com/) 是一个基于 [npm](https://www.npmjs.com/) 的内容分发网络（CDN），允许开发者通过浏览器直接访问和加载 npm 包中的资源。它为前端开发提供了便捷的方式，无需下载或安装即可快速引入所需的库或工具。

## UNPKG的核心功能

1. **直接访问 npm 包**  
   UNPKG 提供了一个简单的方式，让开发者可以直接通过 URL 访问 npm 上发布的任何包。

2. **支持版本管理**  
   可以指定加载某个 npm 包的具体版本，确保项目使用的依赖版本稳定且一致。

3. **实时浏览包内容**  
   UNPKG 提供了对 npm 包内容的在线浏览功能，方便开发者查看包的结构和文件内容。

4. **快速加载资源**  
   作为 CDN，UNPKG 利用全球分布式节点加速资源加载，提升页面性能。

## 如何使用UNPKG

### 访问库文件

通过 UNPKG，可以直接在 HTML 文件中引入 npm 包中的资源。例如，加载 `lodash` 库：

```html
<script src="https://unpkg.com/lodash"></script>
```

上述代码会加载 `lodash` 的最新版本，并将其挂载到全局变量 `_` 中。

### 加载特定版本的资源

为了避免因版本更新导致的兼容性问题，可以指定加载特定版本的资源。例如，加载 `lodash` 的 `4.17.21` 版本：

```html
<script src="https://unpkg.com/lodash@4.17.21"></script>
```

### 浏览包内容

UNPKG 还支持直接在浏览器中浏览 npm 包的内容。只需访问以下 URL：

```
https://unpkg.com/<package-name>/
```

例如，访问 `lodash` 包的内容：

```
https://unpkg.com/lodash/
```

这将显示 `lodash` 包的目录结构，包括其文件和子目录。

## UNPKG的优势

1. **无需安装**  
   开发者可以直接通过 URL 引入所需的库，无需手动下载或安装。

2. **版本控制**  
   支持指定版本号，确保项目使用的依赖版本稳定。

3. **快速加载**  
   借助 CDN 的全球分布式节点，UNPKG 提供了高效的资源加载速度。

4. **透明性**  
   可以直接查看 npm 包的内容，了解其文件结构和依赖关系。

5. **与 npm 生态无缝集成**  
   所有发布到 npm 的包都可以通过 UNPKG 访问，充分利用 npm 的庞大生态系统。

---

## package.json 字段解析

## main

`main` 字段指定了 `require` 加载包时的默认入口文件。例如，当使用 `umd` 格式的包时，可以通过 `main` 指定入口文件。

```json
{
  "main": "dist/my-package.umd.js"
}
```

## sideEffects

`sideEffects` 字段用于标识哪些文件或模块具有副作用（副作用指对外部有影响）。  
- `sideEffects: false` 表示所有文件都没有副作用。
- `sideEffects: ["*.css"]` 表示 CSS 文件具有副作用。

```json
{
  "sideEffects": {
    "es/index.js" // 指定入口文件，通常入口文件不能被删除
  }
}
```

## module

`module` 字段通常用于支持 `import/export` 语法，指定一个符合 ES Module 规范的模块入口文件。通过区分 `main` 和 `module`，可以兼容多种引入方式。

## alias

`alias` 支持 npm 包多版本管理，确保不同版本的依赖能够正确加载。

## package-lock.json

`package-lock.json` 是 npm 的锁文件，用于锁定项目中依赖的具体版本，确保在不同环境中安装的依赖一致。

### 常见操作
- 删除 `node_modules` 后重新运行 `npm install` 会生成新的 `package-lock.json` 文件。
- 使用 `npm i` 或 `npm update` 会更新 `package-lock.json` 文件。

## exports

`exports` 字段可以限制外部对包内模块的访问方式。例如：

```json
{
  "exports": {
    ".": "./index.js",
    "./feature": "./feature.js"
  }
}
```

通过 `exports`，可以明确指定哪些模块可以被外部访问，从而增强包的安全性和可控性。

## 案例分析

### 案例 1：自动升级导致页面异常

#### 问题描述
由于某个组件库包（如 `next`）自动升级，导致页面出现异常，例如 `setState` 引发死循环。而且只有部分用户出现问题，难以定位。

#### 解决方案
通过对比 `package-lock.json` 文件，发现 `next` 版本发生了升级。为了避免类似问题：
1. **非必要情况下不要修改 `package-lock.json` 文件**。
2. 如果删除 `node_modules` 导致某些包版本自动升级，只应调整特定包的版本，而非整体更新。

### 案例 2：tnpm 配置 resolutions 的问题

#### 问题描述
在使用 `tnpm` 时，配置了 `resolutions` 字段后，删除 `node_modules` 不会自动生成 `package-lock.json` 文件。

#### 解决方案
将 `tnpm` 的 `resolutions` 配置改为 npm 的 `overrides` 配置，以确保 `package-lock.json` 文件能够正常生成。

---

## files


在 `package.json` 中，`files` 字段用于指定哪些文件或目录会被包含在 npm 打包发布的内容中。通过明确列出需要包含的文件，开发者可以更精确地控制发布的包内容，避免不必要的文件被包含。

## 官方文档链接

更多信息可以参考 [npm 官方文档](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files)。

## 作用与用途

### 主要功能

- **控制打包范围**：
  - `files` 字段定义了一个文件或目录的白名单，只有列出的文件和目录会被包含在 npm 发布包中。
  - 其他未列出的文件（除非是默认包含的文件）将被排除。

- **减少包体积**：
  - 通过仅包含必要的文件，可以有效减少 npm 包的体积，提升下载和安装速度。

- **保护敏感信息**：
  - 避免意外将测试文件、配置文件或其他非必要内容发布到 npm。

## 默认行为

即使没有定义 `files` 字段，npm 也会默认包含以下文件或目录：

1. `package.json`
2. `README`（支持多种扩展名，如 `.md`, `.txt` 等）
3. `CHANGELOG`（支持多种扩展名，如 `.md`, `.txt` 等）
4. `LICENSE` / `LICENCE`（支持多种扩展名，如 `.md`, `.txt` 等）
5. `index.js` 或其他入口文件（根据 `main` 字段定义）

此外，`.npmignore` 文件会覆盖 `files` 字段的行为。如果存在 `.npmignore`，它会进一步过滤掉不需要的文件。

## 使用方法

### 基本语法

在 `package.json` 中，`files` 是一个数组，每个元素是一个字符串，表示文件路径或目录路径。例如：

```json
{
  "files": [
    "dist/",
    "src/",
    "index.js",
    "README.md"
  ]
}
```

### 示例解释

- `"dist/"`：包含整个 `dist` 目录及其所有子文件。
- `"src/"`：包含整个 `src` 目录及其所有子文件。
- `"index.js"`：仅包含根目录下的 `index.js` 文件。
- `"README.md"`：仅包含根目录下的 `README.md` 文件。

## 注意事项

1. **优先级规则**：
   - 如果同时定义了 `.npmignore` 和 `files`，`files` 的优先级更高。
   - `.gitignore` 文件不会影响 `files` 字段的行为。

2. **排除特定文件**：
   - 如果需要排除某些文件，可以结合 `.npmignore` 使用。
   - 例如，在 `.npmignore` 中添加 `*.log` 可以排除所有日志文件。

3. **调试打包内容**：
   - 使用以下命令查看实际打包的内容：
     ```bash
     npm pack
     ```
   - 该命令会生成一个 `.tgz` 文件，解压后即可查看最终包含的文件。

## 示例配置

以下是一个完整的 `package.json` 示例，展示了如何使用 `files` 字段：

```json
{
  "name": "example-package",
  "version": "1.0.0",
  "description": "An example package demonstrating the use of the 'files' field.",
  "main": "dist/index.js",
  "files": [
    "dist/",
    "src/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "typescript": "^4.0.0"
  }
}
```

---

## 删除node_modules

```shell
find . -name "node_modules" -type d -prune -print -exec rm -rf "{}" \;
```

---

## npm link


## **1. `npm link` 的基本用法**

`npm link` 是一种将本地包链接到项目中的便捷方式，常用于开发和调试。然而，在使用过程中可能会遇到一些问题。

### **2. 常见问题及解决方案**

#### **2.1 删除多余的 `node_modules` 包**

- **问题描述**：
  - 在执行 `npm link` 后，可能会出现找不到链接包的情况。
  - 这可能是由于 `node_modules` 中存在多余或不完整的依赖包。

- **解决方案**：
  - 检查 `node_modules` 下的包是否完整。
  - 如果存在问题，可以尝试删除多余的 `node_modules` 并重新安装依赖：
    ```shell
    rm -rf node_modules package-lock.json
    npm install
    ```

- **可能原因**：
  - 不同版本的 `npm` 可能会导致依赖解析的问题。

#### **2.2 Node.js 版本一致性**

- **问题描述**：
  - 如果在执行 `npm link` 前通过 `nvm use 14` 等命令切换了 Node.js 版本，可能会导致链接的目录结构不一致。

- **解决方案**：
  - 确保两个链接的项目使用相同的 Node.js 版本。
  - 可以通过以下命令检查和切换版本：
    ```shell
    nvm list
    nvm use <version>
    ```


#### **2.3 React Hooks 报错问题**

- **问题描述**：
  - 在使用 `npm link` 时，可能会遇到以下错误：
    ```
    Hooks can only be called inside the body of a function component.
    ```
  - 原因是项目中存在多个 `react` 实例（即多个版本的 `react` 和 `react-dom`）。

- **解决方案**：
  - 将依赖的 `react` 和 `react-dom` 移动到 `peerDependencies`，确保子项目不会单独安装 `react`。
  - 链接父项目的 `react` 和 `react-dom`，具体步骤如下：

    ```shell
    # 1. 在子项目中移除 react 和 react-dom 的直接依赖
    npm uninstall react react-dom

    # 2. 在子项目的 package.json 中添加 peerDependencies
    "peerDependencies": {
      "react": "^17.0.0",
      "react-dom": "^17.0.0"
    }

    # 3. 链接父项目的 react 和 react-dom
    cd PARENT_PROJECT/node_modules/react
    npm link
    cd ../react-dom
    npm link

    # 4. 在子项目中链接父项目的 react 和 react-dom
    cd CHILD_PROJECT
    npm link react
    npm link react-dom
    ```


## **1. 快速查看 README**

通过命令行快速查看 `README` 文件内容：

```shell
readme net
```

## **2. 快速安装 npm 包**

使用 `npmi` 快速安装 npm 包：

```shell
npm install -g npmi
```

## **3. 说明**

- **`readme net`**：
  - 用于快速查看项目的 `README` 文件内容。
  - 确保相关工具已正确安装并配置。

- **`npmi`**：
  - 是一个简化的 npm 安装工具，提升安装效率。
  - 安装后可以直接使用 `npmi <package-name>` 来安装依赖包。

- **`npm version patch`**
  -  自动更新一个新的补丁版本  
