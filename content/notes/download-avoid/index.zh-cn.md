---
title: "下载文件如何规避跨域问题"
date: 2021-12-01T14:53:11+08:00
tags:
  - 跨域
  - JavaScript
  - 浏览器
---

# 下载功能的跨域问题与解决方案

---

## **1. 问题描述**

在实现下载功能时，通常会通过 `XHR` 对象发送请求。然而，这种方式可能会不可避免地遇到**跨域问题**。

---

## **2. 解决方案**

### **2.1 修改为 HTTP GET 请求**
- 将下载请求从 `XHR` 改为普通的 HTTP GET 请求。
- 前端通过 `window.open` 方法触发下载：
  ```javascript
  window.open(`downloadLink`);
  ```

### **2.2 优点**
- 避免了 `XHR` 请求的跨域限制。
- 简化了前端代码逻辑，直接利用浏览器的原生行为完成下载。

### **2.3 注意事项**
- 确保后端接口支持通过 URL 直接访问资源。
- 如果需要传递参数，可以通过 URL 查询字符串的方式附加到 `downloadLink` 中。
- 示例：
  ```javascript
  const downloadLink = `https://example.com/download?fileId=123`;
  window.open(downloadLink);
  ```

---

## **3. 总结**

通过将下载功能改为 HTTP GET 请求并使用 `window.open`，可以有效解决跨域问题，同时简化前端实现逻辑。确保后端接口的兼容性和安全性是关键。

---