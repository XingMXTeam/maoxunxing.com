---
title: "Service Worker 实践指南"
description: ""
date: 2025-02-06
---

## 目录
1. [缓存的类型](#缓存的类型)
   - [PreCache](#precache)
   - [RuntimeCache](#runtimecache)
2. [缓存策略](#缓存策略)
   - [Cache Only](#cache-only)
   - [Network Only](#network-only)
   - [Cache First](#cache-first)
   - [Network First](#network-first)
   - [Stale While Revalidate](#stale-while-revalidate)
3. [调试方法](#调试)
4. [实际使用中的问题与解决方案](#实际使用)
   - [HTML 缓存策略的选择](#html-缓存策略的选择)
   - [Service Worker 更新机制](#service-worker-更新机制)
5. [边界 Case 分析](#边界-case)
   - [版本回退](#版本回退)
   - [Service Worker 开关关闭](#service-worker-开关关闭)
   - [切换语言或账号](#切换语言或账号)
   - [多标签页场景](#多标签页场景)
   - [302 重定向问题](#302-重定向问题)
   - [数据一致性问题](#数据一致性问题)
6. [埋点问题](#埋点问题)
7. [实验问题](#实验问题)
8. [错误案例分析](#错误案例分析)
9. [真实存储数据的位置](#真实存储数据的位置)

---

## 缓存的类型

### PreCache
在 Service Worker 的 `installing` 阶段读取缓存，开发者可以确定缓存文件的时间和长度。离线情况下返回给用户资源。

示例代码：
```js
workbox.precaching.precacheAndRoute([
  './a.css'
]);
```
上述代码会将 `a.css` 文件信息保存到 IndexedDB 中。

### RuntimeCache
在 Service Worker 的 `install` 完成后，`activated` 和 `fetch` 阶段进行的操作。可以根据不同资源制定缓存策略。

---

## 缓存策略

### Cache Only
直接使用缓存的结果，适合上线后不会变动的资源，例如第三方 JS 库。

### Network Only
强制使用网络请求，适合实时性要求高的资源。

### Cache First
当匹配到请求时，优先从缓存中取得结果。如果缓存中没有结果，则走网络请求，并将结果更新到缓存中。  
**适用场景：** 结果不常变动且对实时性要求不高的请求，例如图片。

### Network First
优先走网络请求，并将结果写入缓存。如果请求失败，则会使用缓存结果兜底。  
**适用场景：** 返回结果不太固定或对实时性要求较高的请求。

### Stale While Revalidate
当有对应的缓存结果时，直接返回缓存结果，同时在后台发起网络请求更新缓存。  
**优点：** 提高用户体验。  
**缺点：** 网络请求会占用用户带宽。

---

## 调试

1. 清空站点 Cookie。
2. 代理 `sw.js` 请求中的 `importScript` 调用的 JS 资源和 `.map` 资源。
3. 首次刷新页面是 `install` 环节，不会进入运行时插件调用，需要二次刷新才能生效。

---

## 实际使用

### HTML 缓存策略的选择
如果对 HTML 使用 `Cache First` 缓存策略，在发布迭代后，用户仍然会读取缓存的 HTML，导致新版本不会立即生效。同样，回滚也不会立即生效。

**解决方案：**  
采用 `Stale While Revalidate` 策略，同时对比 HTML 的版本信息。如果版本不一致，强制刷新页面。

### Service Worker 更新机制
更新了 `importScript` 调用的 JS 资源后，不会立即生效。需要手动点击 `skipWaiting` 或关闭标签页重新打开以激活新的 Service Worker。

### 激活机制
第一次sw安装，第二次会激活走service-worker但是不走会走缓存（现象是network面板显示from serviceworker，但是没有命中缓存），第三次才会命中缓存。
**不同的域名servicewworker都会走这个流程**

---

## 边界 Case

### 版本回退
当 Service Worker 版本回退时，如何处理缓存清空的问题？

### Service Worker 开关关闭
目前暂无明确方案，但可以通过 `skipWaiting` 支持快速激活。

### 切换语言或账号
- **切换语言：** 域名会变化，缓存自动更新。
- **切换账号：** 楼层结构可能发生变化，建议缓存两个 Key（ID）。

### 多标签页场景
多个标签页之间需要通过广播机制同步状态。一般只需要更新当前标签页，因为登陆态和非登陆态页面结构不一样。

### 302 重定向问题
- 一个标签页访问 `es.xx.com`，另一个标签页访问 `www.xx.com`，可能会根据 Cookie 的国家信息自动跳转到 `es.xx.com`。
- 如果指定访问 `ko.xx.com`，则不会发生 302 重定向。

### 数据一致性问题
1. **回滚需要立即生效：** 配置开关：一般配置是跟着html结构下发
2. **数据和 JS 不一致：** 当有发布动作时，确保 JS 是最新的。旧UI+新数据；新UI+旧数据
   - CSR（客户端渲染）场景下，可能存在增量数据未被消费的问题。
   - SSR（服务端渲染）场景下，首次加载时 JS 可能落后于数据，导致样式错乱。
3. **机器灰度：** 用户可能横跳不同的版本。
4. **JS 版本和 HTML 渲染数据不一致：** 导致样式错乱。解决办法：跟随机器灰度。

---

## 埋点问题

1. 曝光错误
2. PV 数据依赖接口的返回（如 `utabtest`），这可能会影响实验效果。

---

## 实验问题

1. 楼层实验通过奥创接口获取。
2. 全局实验基于 Cookie 上的 `ca` 设备 ID。

---

## 错误案例分析

**错误信息：**
```js
sw.js?version=0.0.62:6 Uncaught NetworkError: Failed to execute 'importScripts' on 'WorkerGlobalScope': The script at 'https://assets.alicdn.com/g/ae-fe/service-worker-ui/0.0.62/pc.js' failed to load.
    at init (sw.js?version=0.0.62:6:20)
    at sw.js?version=0.0.62:10:1
```

**原因分析：**  
由于 `importScripts` 加载的 JS 文件报错，导致 Service Worker 初始化失败。

---

## 真实存储数据的位置

![alt text](image.png)

---