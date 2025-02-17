---
title: "Webpack Externals"
description: ""
date: 2024-09-08
tags:
  - Webpack
images:
  - webpack-1/a.png
---

本文档详细介绍了如何通过 Webpack 的 `externals` 配置加载外部依赖，并提供了判断包是否被 `externals` 的方法。适合需要优化打包体积或动态加载外部资源的开发者。

---

## 目录

1. [Externals 简介](#externals-简介)
2. [Externals 配置示例](#externals-配置示例)
   - [配置方式](#配置方式)
   - [副作用](#副作用)
3. [如何判断包是否被 externals](#如何判断包是否被-externals)
4. [总结与扩展](#总结与扩展)

---

## Externals 简介

Webpack 的 `externals` 配置允许将某些模块从打包中排除，并通过外部脚本（如 CDN）加载。这种方式可以显著减少打包体积，同时支持按需加载外部依赖。

> **适用场景**：
> - 使用第三方库时，避免将其打包到最终文件中。
> - 动态加载外部资源以优化首页加载速度。

---

## Externals 配置示例

### 配置方式

以下是一个典型的 `externals` 配置示例：

```js
module.exports = {
  // ...
  externalsType: 'script', // 声明外部资源的加载方式为 <script>
  externals: {
    lodash: [
      'https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', // 外部脚本 URL
      '_', // 全局变量名
    ],
  },
};
```

#### 参数说明：
- **`externalsType`**：指定外部资源的加载类型，这里使用 `'script'` 表示通过 `<script>` 标签加载。
- **`externals`**：
  - 第一个参数是外部脚本的 URL。
  - 第二个参数是全局变量名（如 `_`），用于在代码中引用该库。

---

### 副作用

当某个包被声明为 `externals` 后，Webpack 会将其动态加载逻辑重写为异步加载的方式。例如：

```js
import _ from 'lodash';
```

会被重写为：

```js
import('./lodash.js').then(res => {
  const _ = res.default || res;
  // 使用 lodash
});
```

> **补充说明**：
> - 这种方式确保外部依赖只在需要时加载，避免阻塞首页渲染。
> - 需要注意的是，动态加载可能会增加首次使用的延迟，因此需要权衡性能影响。

---

## 如何判断包是否被 externals

在 UMD 格式的打包文件中，可以通过以下特征判断某个包是否被 `externals`：

1. **检查全局变量**：
   如果在 UMD 文件头部发现类似以下代码：
   ```js
   root['packageName']
   ```
   则表明该包已被 `externals`。

2. **示例分析**：
   假设我们 externals 了 `lodash`，打包后的代码可能包含如下片段：
   ```js
   (function(root, factory) {
     if (typeof define === 'function' && define.amd) {
       define([], factory);
     } else if (typeof exports === 'object') {
       module.exports = factory();
     } else {
       root['_'] = factory(); // 将 lodash 挂载到全局变量 _
     }
   })(this, function() {
     return _; // 引用外部加载的 lodash
   });
   ```

> **补充说明**：
> - 通过全局变量名（如 `_`）可以快速定位外部依赖的加载方式。
> - 在调试时，可以通过浏览器控制台检查全局对象（如 `window._`）是否存在，验证外部依赖是否正确加载。


## 自己的库不要用external

- 有依赖关系，需要维护顺序；
- 注意cdn加速是否还有；
- 全局配置了externals，但是页面忘记引入导致故障，删除同理；
- 针对包大小和构建速度，可以通过包构建工具处理。

---

## 总结与扩展

### 总结
- **核心功能**：
  - `externals` 可以将外部依赖从打包文件中移除，通过 CDN 或其他方式加载。
  - 支持动态加载，优化首页加载性能。
- **注意事项**：
  - 确保外部依赖的 URL 可靠且稳定。
  - 动态加载可能导致首次使用的延迟，需根据实际需求权衡。

### 扩展建议
1. **多环境适配**：
   - 在开发环境中保留本地依赖，仅在生产环境中启用 `externals`。
2. **兼容性处理**：
   - 对于不支持动态加载的浏览器，提供降级方案（如同步加载脚本）。
3. **性能监控**：
   - 使用工具（如 Lighthouse）监控外部依赖的加载性能，及时调整 CDN 或加载策略。
