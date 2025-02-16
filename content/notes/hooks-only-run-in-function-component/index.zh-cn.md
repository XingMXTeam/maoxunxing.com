---
title: "Hooks don't work with yarn link"
date: 2021-11-29T12:06:58+08:00
tags:
  - React
  - npm
  - 调试
---

## **1. `npm link` 的基本用法**

`npm link` 是一种将本地包链接到项目中的便捷方式，常用于开发和调试。然而，在使用过程中可能会遇到一些问题。

---

## **2. 常见问题及解决方案**

### **2.1 删除多余的 `node_modules` 包**

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

---

### **2.2 Node.js 版本一致性**

- **问题描述**：
  - 如果在执行 `npm link` 前通过 `nvm use 14` 等命令切换了 Node.js 版本，可能会导致链接的目录结构不一致。

- **解决方案**：
  - 确保两个链接的项目使用相同的 Node.js 版本。
  - 可以通过以下命令检查和切换版本：
    ```shell
    nvm list
    nvm use <version>
    ```

---

### **2.3 React Hooks 报错问题**

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

---

## **3. 注意事项**

1. **清理缓存**：
   - 如果问题仍然存在，可以尝试清理 `npm` 缓存并重新安装依赖：
     ```shell
     npm cache clean --force
     rm -rf node_modules package-lock.json
     npm install
     ```

2. **验证修复**：
   - 重新启动项目，检查是否解决了 `Hooks Only Run in Function Component` 的问题。

3. **Node.js 版本管理**：
   - 推荐使用 `nvm` 来管理 Node.js 版本，确保开发环境的一致性。

---

## **4. 参考资料**

- [npm link 官方文档](https://docs.npmjs.com/cli/v8/commands/npm-link)
- [React 官方文档：Hooks 规则](https://reactjs.org/docs/hooks-rules.html)
- [nvm 官方文档](https://github.com/nvm-sh/nvm)

```
