---
title: "csso 报错 \"Selector can't has classes from different scopes\" 怎么修"
date: 2026-09-30
description: "csso 报错 Selector can't has classes from different scopes 的含义、触发原因（usage scopes 配置问题）以及三种修复方法。"
tags:
  - CSS
  - csso
  - webpack
  - 前端工程
  - Debug
custom_toc:
  - title: "报错现象"
  - title: "真正原因"
  - title: "怎么修"
  - title: "我的建议"
---

webpack 打包时，CSS 压缩阶段挂了：

```bash
Selector can't has classes from different scopes
```

## 真正原因

这个报错来自 [csso](https://github.com/css/csso)（CSS 压缩工具）。它只会在一种情况下出现：**构建时给 csso 传了带 `scopes` 的 usage 数据**——一般是通过 `css-minimizer-webpack-plugin`（用 csso 做 minifier）或 `csso-webpack-plugin` 传进去的。

scopes 是 csso 为 CSS Modules 这类"作用域隔离"方案准备的优化手段：你告诉 csso 哪些类名属于同一个 scope（即它们永远不会出现在同一份 markup 上），csso 就能更大胆地合并 ruleset。根据 [csso 官方文档](https://github.com/css/csso#scopes)，这个异常只在两种情况下抛出：

1. **同一个类名被写进了多个 scope；**
2. **一个选择器里混用了来自不同 scope 的类。**

没写进任何 scope 的类名默认属于 default scope，不会报错。

## 怎么修

先找到构建配置里给 csso 传 `usage` / `scopes` 的地方，例如：

```js
// webpack.config.js
new CssMinimizerPlugin({
  minify: CssMinimizerPlugin.cssoMinify,
  minimizerOptions: {
    usage: {
      scopes: [
        ["header-title", "header-nav"],
        ["card-title", "card-body"],
      ],
    },
  },
})
```

然后对着上面两种情况排查：

**情况一：一个类出现在两个 scope 里。** 把 scopes 数组搜一遍找重复，从其中一个里删掉：

```js
scopes: [
  ["header-title", "shared-btn"],  // ❌ "shared-btn" 下面又出现一次
  ["shared-btn", "card-body"],
]
```

**情况二：一个选择器混用了两个 scope 的类。** 找这类选择器：

```css
/* ❌ .header-title 在 scope 1，.card-body 在 scope 2 */
.header-title.card-body { margin: 0; }
```

修法是让这个选择器的类都落在同一个 scope 里，或者把共用的类挪到同一个 scope 下。

**情况三：你根本没想要 scopes。** 如果这个 usage 配置不是你有意加的，最简单的修法是直接删掉 `scopes`（乃至整个 `usage`）。没有 usage 数据时 csso 只做保守压缩——体积大一点点，但不会报错。

## 我的建议

十有八九是某次抄配置抄进来的、团队里没人记得的 `usage` 陈旧配置。scopes 是给超大 CSS 包 + CSS Modules 刻意压字节的进阶玩法，用不上就别留着。删掉，重跑构建，继续干活。
