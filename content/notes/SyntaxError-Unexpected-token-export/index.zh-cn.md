---
title: "SyntaxError Unexpected Token Export"
date: 2021-12-01T14:53:11+08:00
---

## **1. 错误描述**

- **错误信息**：
  ```
  SyntaxError: Unexpected Token Export
  ```

---

## **2. 错误原因**

- **常见原因**：
  - 模块系统不兼容。
  - 使用了 `export` 语法，但运行环境或构建工具未正确支持 ES6 模块。
  - 文件扩展名可能未正确设置（如 `.js` 文件被解析为 CommonJS 而非 ES Module）。

> commonjs 一般是用module.exports; es module是用export default

---

## **3. 解决方案**

### **方法 1：检查文件扩展名**

- 确保使用 ES6 模块的文件扩展名为 `.mjs` 或在 `package.json` 中明确指定模块类型：
  ```json
  {
    "type": "module"
  }
  ```

### **方法 2：修改导出语法**

- 如果运行环境不支持 ES6 模块，可以将 `export` 替换为 CommonJS 的 `module.exports`：
  ```javascript
  // ES6 模块
  export const myFunction = () => { console.log('Hello'); };

  // CommonJS 模块
  module.exports = { myFunction: () => { console.log('Hello'); } };
  ```

### **方法 3：配置 Babel**

- 如果需要兼容旧版 JavaScript，可以通过 Babel 转译代码：
  1. 安装 Babel 相关依赖：
     ```shell
     npm install --save-dev @babel/core @babel/preset-env babel-loader
     ```
  2. 配置 `.babelrc` 文件：
     ```json
     {
       "presets": ["@babel/preset-env"]
     }
     ```

### **方法 4：检查构建工具配置**

- 如果使用 Webpack、Rollup 等构建工具，确保正确配置了模块解析规则。例如，在 Webpack 中添加以下配置：
  ```javascript
  module.exports = {
    mode: 'development',
    resolve: {
      extensions: ['.js', '.mjs']
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  };
  ```

---

## **4. 注意事项**

1. **运行环境**：
   - 确保 Node.js 版本支持 ES6 模块（Node.js 12+ 支持 ES Modules）。
2. **依赖版本**：
   - 检查第三方库是否与当前模块系统兼容。
3. **调试工具**：
   - 使用调试工具（如 `console.log` 或断点调试）定位问题源头。

---

## **5. 参考链接**

- [Node.js Modules Documentation](https://nodejs.org/api/esm.html)
- [Babel Official Documentation](https://babeljs.io/docs/en/)
- [Webpack Configuration Guide](https://webpack.js.org/configuration/)

```
