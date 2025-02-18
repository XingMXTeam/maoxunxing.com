---
title: "一些缓存问题记录"
date: 2025-02-06
---

## 目录

1. [案例一：接口返回正常，但页面数据展示不正确](#案例一接口返回正常但页面数据展示不正确)
   - [问题描述](#问题描述)
   - [原因分析](#原因分析)
   - [解决方案](#解决方案)
2. [案例二：通过 Blob 方式下载文件时部分任务未建立](#案例二通过-blob-方式下载文件时部分任务未建立)
   - [问题描述](#问题描述-1)
   - [原因分析](#原因分析-1)
   - [解决方案](#解决方案-1)

---

## 案例一：接口返回正常，但页面数据展示不正确

### 问题描述

在开发过程中，接口返回的数据是正常的，但页面上展示的数据却不符合预期。这种情况可能会导致用户看到错误的信息，影响体验。

### 原因分析

经过排查，发现问题是由于 **`localStorage` 缓存** 导致的：
- 页面在加载时优先从 `localStorage` 中读取数据。
- 如果缓存的数据未及时更新，就会导致页面展示的数据与接口返回的数据不一致。

### 解决方案

为了解决这个问题，可以采取以下措施：
1. **清理过期缓存**：
   - 在每次接口请求成功后，更新 `localStorage` 中的数据。
   - 设置缓存的有效期，例如通过时间戳判断缓存是否过期。
   ```javascript
   const cacheKey = 'userData';
   const cacheData = JSON.parse(localStorage.getItem(cacheKey));
   const now = Date.now();

   if (!cacheData || now - cacheData.timestamp > 5 * 60 * 1000) {
     // 缓存过期或不存在，重新请求接口
     fetchData().then((data) => {
       localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
     });
   } else {
     // 使用缓存数据
     renderData(cacheData.data);
   }
   ```

2. **避免过度依赖缓存**：
   - 对于关键数据，尽量直接从接口获取，减少对 `localStorage` 的依赖。

---

## 案例二：通过 Blob 方式下载文件时部分任务未建立

### 问题描述

在使用 Blob 方式批量下载文件时，发现部分文件的下载任务未能成功建立。这会导致用户无法下载完整的文件列表。

### 原因分析

经过分析，问题的根本原因是 **浏览器缓存机制**：
- 浏览器会对相同的 URL 请求进行缓存。
- 如果多个文件的下载链接相同（例如没有唯一标识符），浏览器会复用缓存，导致部分文件的下载任务被忽略。

### 解决方案

为了避免浏览器缓存的影响，可以通过以下方式解决：
1. **为每个请求添加时间戳**：
   - 在每个文件的下载链接中附加一个唯一的时间戳参数，确保每次请求的 URL 都是唯一的。
   ```javascript
   const downloadFile = (url) => {
     const uniqueUrl = `${url}?timestamp=${Date.now()}`;
     fetch(uniqueUrl)
       .then((response) => response.blob())
       .then((blob) => {
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = 'file-name.ext';
         link.click();
       });
   };
   ```

2. **禁用缓存**：
   - 在 HTTP 请求头中设置 `Cache-Control: no-cache` 或 `Pragma: no-cache`，强制浏览器不缓存响应内容。
   ```javascript
   fetch(url, {
     headers: {
       'Cache-Control': 'no-cache',
       'Pragma': 'no-cache',
     },
   })
     .then((response) => response.blob())
     .then((blob) => {
       // 处理 Blob 数据
     });
   ```

3. **分批处理下载任务**：
   - 如果文件数量较多，可以分批次发起下载请求，避免同时发起过多请求导致浏览器资源耗尽。
   ```javascript
   const urls = [...]; // 文件 URL 列表
   const batchSize = 5;

   const downloadBatch = (batch) => {
     batch.forEach((url) => downloadFile(url));
   };

   for (let i = 0; i < urls.length; i += batchSize) {
     const batch = urls.slice(i, i + batchSize);
     downloadBatch(batch);
   }
   ```