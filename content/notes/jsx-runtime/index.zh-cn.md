---
title: "Jsx Runtime报错"
date: 2022-01-24T13:15:59+08:00
tags:
  - React
  - TypeScript
  - 错误处理
---

# 错误信息与解决方案

---

## **1. 错误信息**

### **错误描述**
在启动开发服务器时遇到以下错误：

```shell
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
    10 │ import { jsx as _jsx } from "react/jsx-runtime";
       ╵                             ~~~~~~~~~~~~~~~~~~~

error when starting dev server:
Error: Build failed with 1 error:
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
```

---

## **2. 解决方案**

### **修改 `tsconfig.json` 文件**
将 `tsconfig.json` 中的 `jsx` 配置从 `"react-jsx"` 修改为 `"react"`。

#### **修改后的配置**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./lib",
    "module": "esnext",
    "target": "es6",
    "lib": ["esnext", "dom"],
    "sourceMap": true,
    "allowJs": false,
    "jsx": "react" // 将 "react-jsx" 修改为 "react"
  }
}
```

---

## **3. 注意事项**

1. **`jsx` 配置说明**：
   - `"react-jsx"`：适用于 React 17+ 的新 JSX 转换方式。
   - `"react"`：适用于传统的 React JSX 转换方式，兼容性更强。

2. **清理缓存**：
   - 修改配置后，建议清理项目缓存并重新安装依赖：
     ```shell
     rm -rf node_modules package-lock.json
     npm install
     ```

3. **验证修复**：
   - 确保修改后重新启动开发服务器，检查问题是否解决。

---
