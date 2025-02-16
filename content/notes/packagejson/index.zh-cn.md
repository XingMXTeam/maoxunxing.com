---
title: "package.json的files"
date: 2021-12-10T10:12:21+08:00
tags:
  - npm
  - NodeJS
  - JavaScript
---

在 `package.json` 中，`files` 字段用于指定哪些文件或目录会被包含在 npm 打包发布的内容中。通过明确列出需要包含的文件，开发者可以更精确地控制发布的包内容，避免不必要的文件被包含。

## 官方文档链接

更多信息可以参考 [npm 官方文档](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files)。

---

## 作用与用途

### 主要功能

- **控制打包范围**：
  - `files` 字段定义了一个文件或目录的白名单，只有列出的文件和目录会被包含在 npm 发布包中。
  - 其他未列出的文件（除非是默认包含的文件）将被排除。

- **减少包体积**：
  - 通过仅包含必要的文件，可以有效减少 npm 包的体积，提升下载和安装速度。

- **保护敏感信息**：
  - 避免意外将测试文件、配置文件或其他非必要内容发布到 npm。

---

## 默认行为

即使没有定义 `files` 字段，npm 也会默认包含以下文件或目录：

1. `package.json`
2. `README`（支持多种扩展名，如 `.md`, `.txt` 等）
3. `CHANGELOG`（支持多种扩展名，如 `.md`, `.txt` 等）
4. `LICENSE` / `LICENCE`（支持多种扩展名，如 `.md`, `.txt` 等）
5. `index.js` 或其他入口文件（根据 `main` 字段定义）

此外，`.npmignore` 文件会覆盖 `files` 字段的行为。如果存在 `.npmignore`，它会进一步过滤掉不需要的文件。

---

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

---

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

---

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

## 总结

通过合理使用 `files` 字段，开发者可以精确控制 npm 包的发布内容，确保只包含必要的文件，同时避免敏感或无关文件被意外发布。结合 `.npmignore` 和 `npm pack` 调试工具，可以进一步优化打包流程。
