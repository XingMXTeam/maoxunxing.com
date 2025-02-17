---
title: "在普通页面中使用 Vite 的解决方案"
description: ""
date: 2025-02-06
tags:
  - Vite
---

在普通页面中使用 Vite 开发环境，通常需要服务端支持或对现有页面进行改造。本文介绍了一种通过 **Whistle 代理** 的方式，间接实现 Vite 开发的方案。

---

## 目录
1. [背景与需求](#背景与需求)
2. [Whistle 代理规则配置](#whistle-代理规则配置)
   - [HTML 替换规则](#html-替换规则)
   - [脚本注入内容](#脚本注入内容)
3. [Vite 配置解读](#vite-配置解读)
   - [@2: 解决 Sass 样式导入问题](#2-解决-sass-样式导入问题)
   - [@3: 解决跨域问题](#3-解决跨域问题)
4. [总结](#总结)

---

## 背景与需求

Vite 是一个现代化的前端构建工具，通常需要服务端支持（如修改模板文件、注入脚本等）才能正常运行。但在某些场景下（如普通页面开发），我们无法直接修改服务端代码。此时，可以通过 **Whistle 代理** 的方式，动态修改 HTML 文件并注入 Vite 所需的脚本，从而间接实现 Vite 开发。

---

## Whistle 代理规则配置

### HTML 替换规则

通过 Whistle 的 `resReplace` 功能，可以动态修改 HTML 文件内容，注入 Vite 所需的脚本。

#### Whistle 规则示例

```shell
/(pre-)?(c|g)sp.aliexpress.com\/apps\/.*$/ resReplace://{res-replace}
```

上述规则匹配指定域名下的 HTML 文件，并通过 `resReplace` 替换其内容。

---

### 脚本注入内容

以下是需要注入到 HTML 文件中的脚本内容：

```html
/xxx/: <script type="module">import RefreshRuntime from "http://localhost:5173/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;window.__vite_plugin_react_preamble_installed__ = true;</script><script type="module" src="http://localhost:5173/@vite/client"></script><script type='module' src='http://localhost:5173/src/index.ts'></script><script type='module' src='http://localhost:5173/src/app.tsx'></script>
```

#### 注入内容解析
1. **React 刷新插件**：
   - `@react-refresh` 和相关全局变量（如 `$RefreshReg$`、`$RefreshSig$`）用于支持 React 热更新。
2. **Vite 客户端脚本**：
   - `http://localhost:5173/@vite/client` 是 Vite 提供的客户端脚本，用于支持热更新和模块加载。
3. **入口文件**：
   - `index.ts` 和 `app.tsx` 是项目的入口文件，具体路径根据项目结构调整。

---

## Vite 配置解读

以下是 `vite.config.js` 的完整配置及关键点解读。

### 配置代码

```javascript
import path from 'path';  
import react from '@vitejs/plugin-react';  
  
/** @type {import('vite').UserConfig} */  
export default {  
  plugins: [react()],  
  resolve: {  
    dedupe: ['react', 'react-dom'],  
    alias: [  
      { find: '@alife/zoro-cookie', replacement: '@alife/zoro-cookie/lib/index.js' },  
      {  
        find: '~@alife/theme-csp-seller/index.scss',  
        replacement: path.resolve(__dirname, './src/empty.scss'),  
      },  
      {  
        find: '@alife/next',  
        replacement: '@alifd/next',  
      },  
      {  
        // @2
        find: /^~(.+)/,  
        replacement: '$1',  
      },  
    ],  
  },  
  css: {  
    preprocessorOptions: {  
      scss: {  
        includePaths: ['node_modules'],  
      },  
    },  
  },  
  server: {  
    // @3
    cors: {  
      origin: ['https://pre-csp.aliexpress.com', 'https://*.aliexpress.com'],  
      credentials: true,  
    },  
    headers: {  
      'Access-Control-Allow-Origin': '*',  
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',  
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',  
    },  
  },  
};
```

---

### @2: 解决 Sass 样式导入问题

在使用 Sass 时，可能会遇到以下错误：

```
[plugin:vite:css] [sass] Can't find stylesheet to import.
╷
1 │ @import '~@alifd/next/variables';
│ ^^^^^^^^^^^^^^^^^^^^^^^^
╵
```

#### 解决方法
通过 `resolve.alias` 配置，将 `~` 前缀替换为实际路径：
```javascript
{ find: /^~(.+)/, replacement: '$1' }
```

---

### @3: 解决跨域问题

在开发环境中，浏览器可能会因跨域问题阻止脚本加载，例如：

```
Access to script at 'http://localhost:5173/@vite/client' from origin 'xx' has been blocked by CORS policy
```

#### 解决方法
通过 `server.cors` 和 `server.headers` 配置，允许跨域访问：
```javascript
cors: {  
  origin: ['https://pre-csp.aliexpress.com', 'https://*.aliexpress.com'],  
  credentials: true,  
},
headers: {  
  'Access-Control-Allow-Origin': '*',  
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',  
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',  
},
```

---

## 总结

1. **Whistle 代理** 是一种无需修改服务端代码即可实现 Vite 开发的解决方案。
2. 通过动态修改 HTML 文件并注入 Vite 所需的脚本，可以快速搭建开发环境。
3. 在 Vite 配置中，合理使用 `resolve.alias` 和 `server.cors` 可以解决常见的样式导入和跨域问题。
4. 该方案适用于无法直接修改服务端代码的场景，但需要注意生产环境的安全性和性能优化。

---