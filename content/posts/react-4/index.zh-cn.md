---
title: "React日记 #4期：React Server Component"
description: "React Server Component是什么？"
date: 2024-08-18
tags:
  - React日记
images:
  - react-1/a.png
---

{{< table_of_contents >}}

## 设计初衷

提升 React 应用的性能和开发体验：

- 减少客户端 JavaScript 负载： RSC 的引入允许开发者将部分逻辑留在服务器端执行，减少需要发送到客户端的 JavaScript 代码量，从而提升应用加载性能
- 更高效的数据获取： RSC 能够在服务器端直接获取数据并渲染组件
- 优化 SEO和初始加载性能：初次加载时就能向客户端返回 HTML 页面
- 提高开发体验：可以在同一个项目中使用客户端组件和服务器组件
- 更好地利用服务器资源： 充分利用服务器的计算资源，从而减轻客户端设备的负担。这对于移动设备或低性能设备的用户尤其重要

特点：

- 无感刷新，并且不刷新其他区块的状态
- 劫持a标签点击，通过pushState模拟页面刷新，并且通过RSC组件的方式替换刷新内容。可以保持其他区块的状态，无感替换刷新内容

## What

通过服务端将jsx（这里的jsx就是RSC组件）转换为html，然后发送给客户端渲染就是ssr，通过js发送请求获取最新的区块html水合替换区块。

服务器组件和服务器渲染（SSR）是独立的技术，可以一起使用构建跨服务器和客户端的应用程序。SSR产出的是HTML，服务器组件产出的是指令。

## How

通过服务端渲染内容，正常可以字符串返回html， 但是通过babel的插件： node-jsx-loader 可以在服务端写jsx。 这个插件会转化jsx成一个js对象（包含type、props)，这个对象可以转为html，然后发送给客户端

核心是这两个方法：

1. renderJSXToClientJSX: 服务端将jsx组件转换为jsx对象。然后转为json传给客户端就可以更新dom了  
2. renderToString: 将jsx转为字符串，发送到浏览器转换为htm3. 然后客户端需要水合

CSR深入：[CSR协议介绍](https://juejin.cn/post/7244452476190752829)
