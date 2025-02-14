---
title: "Webpack Federation"
date: 2021-11-19T14:04:15+08:00
---

# 模块联邦（Module Federation）简介

模块联邦（Module Federation）是 Webpack 5 中引入的一项强大功能，旨在解决微前端架构中的模块共享和独立部署问题。通过模块联邦，各个模块可以独立开发、独立部署，同时仍然能够协同工作，共同构建一个完整的应用。

---

## 核心概念

### 独立开发与独立部署
- **独立开发**：每个模块可以作为一个独立的项目进行开发，拥有自己的代码库、依赖和构建流程。
- **独立部署**：模块之间没有强依赖关系，可以单独部署到生产环境，而不会影响其他模块。

### 共同构建
- 尽管模块是独立开发和部署的，但它们可以通过模块联邦机制在运行时动态加载和共享依赖，从而实现协同工作。
- 这种方式使得多个团队可以并行开发不同的模块，而无需频繁地同步代码或依赖。

---

## 模块联邦的优势

1. **解耦模块**
   - 各个模块之间没有直接的依赖关系，降低了模块间的耦合度。
   - 每个模块可以独立升级和维护，提升了开发效率。

2. **动态加载**
   - 模块可以在运行时按需加载，减少初始加载时间。
   - 适用于大型应用的微前端架构，提升性能和用户体验。

3. **共享依赖**
   - 不同模块之间可以共享公共依赖（如 React、Lodash 等），避免重复加载相同的库。
   - 支持版本控制，确保共享依赖的兼容性。

4. **灵活的团队协作**
   - 不同团队可以专注于各自的模块开发，无需担心与其他团队的代码冲突。
   - 适合多团队协作的大型项目。

---

## 使用场景

### 微前端架构
- 模块联邦非常适合微前端架构，允许将一个大型应用拆分为多个小型模块。
- 每个模块可以由不同的团队负责，独立开发、测试和部署。

### 动态插件系统
- 可以用于构建动态插件系统，主应用在运行时加载不同的插件模块。
- 插件模块可以独立开发和部署，主应用无需重新构建。

### 多版本支持
- 支持不同模块使用不同版本的依赖库，避免版本冲突问题。

---

## 示例：模块联邦的基本配置

以下是一个简单的模块联邦配置示例，展示如何实现独立开发和共同构建。

### 主应用（Host）
```javascript
// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remoteApp: "remote@http://localhost:3001/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

### 远程模块（Remote）
```javascript
// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./Component": "./src/Component",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

### 运行效果
- 主应用通过 `remotes` 配置动态加载远程模块。
- 远程模块通过 `exposes` 配置暴露其组件或功能。
- 共享依赖（如 React）在主应用和远程模块之间共享，避免重复加载。

---

## 总结

模块联邦是一项革命性的功能，为现代前端开发提供了更高的灵活性和可扩展性。通过模块联邦：
- 各个模块可以独立开发、独立部署，降低团队协作成本。
- 模块之间可以动态加载和共享依赖，提升应用性能。
- 特别适合微前端架构和大型项目的开发。