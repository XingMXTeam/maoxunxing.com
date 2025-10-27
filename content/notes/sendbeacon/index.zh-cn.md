---
title: "sendBeacon 请求的 64KB 限制：数据丢失的隐形杀手"
date: 2025-10-27
tags:
  - JavaScript
  - Web API
  - 数据上报
  - 性能优化
---

## 目录

- [问题的核心](#问题的核心)
- [sendBeacon 的 64KB 陷阱](#sendbeacon-的-64kb-陷阱)
  - [为什么会有这个限制？](#为什么会有这个限制)
  - [超出限制会发生什么？](#超出限制会发生什么)
- [img GET 请求的替代方案](#img-get-请求的替代方案)
  - [方案原理](#方案原理)
  - [实现示例](#实现示例)
  - [新问题：URL 长度限制](#新问题url-长度限制)
- [两种方案的对比分析](#两种方案的对比分析)
- [最佳实践建议](#最佳实践建议)
- [参考资料](#参考资料)

---

## 问题的核心

**为什么你的数据上报总是丢失？**

在 Web 开发中，我们经常需要向服务器发送数据，比如用户行为追踪、错误日志、性能指标等。`sendBeacon` API 本应是最可靠的数据上报方式，但它却隐藏着一个致命的缺陷：64KB 的数据大小限制。

当你的数据超过这个限制时，浏览器会让请求进入 pending 状态，最终导致数据丢失。这就像你寄快递时，包裹超重了，快递员直接拒收，你的重要文件永远到不了目的地。

---

## sendBeacon 的双重陷阱

### 陷阱一：单个请求的 64KB 限制

`sendBeacon` 的 64KB 限制并非随意设定，而是基于以下几个技术考量：

1. **内存保护**：浏览器需要为每个请求分配内存缓冲区，过大的数据会消耗过多内存
2. **网络效率**：大块数据在网络传输中更容易失败，影响整体性能
3. **安全考虑**：限制请求大小可以防止恶意脚本发送大量数据攻击服务器

### 陷阱二：并发请求数量限制

**更隐蔽的问题**：即使单个请求小于 64KB，连续发送多个 `sendBeacon` 请求也会导致问题。

```javascript
// 危险示例：连续发送多个请求
for (let i = 0; i < 10; i++) {
  const data = {
    event: `user_action_${i}`,
    timestamp: Date.now(),
    // 假设每个请求只有 10KB
  };
  
  // 前 3 个可能正常，第 4、5 个开始 pending
  navigator.sendBeacon('/api/track', JSON.stringify(data));
}
```

**为什么会这样？**

浏览器对 `sendBeacon` 请求有**并发数量限制**（通常 3-5 个），超过限制的请求会被放入队列或直接 pending。这就像邮局只有 3 个邮递员，你同时寄 10 封信，后面的 7 封只能排队等待。

### 超出限制会发生什么？

无论是单个请求过大还是并发请求过多，浏览器都会：

```javascript
// 危险示例：数据过大
const largeData = {
  userActions: [...], // 假设这个数组很大
  performanceMetrics: {...},
  errorLogs: [...]
};

// 这会导致请求 pending，数据丢失
navigator.sendBeacon('/api/track', JSON.stringify(largeData));
```

**结果**：
- 请求状态显示为 pending
- 浏览器不会重试
- 数据永久丢失
- 用户行为无法追踪

这就像你写了一封长信，但邮筒太小装不下，邮递员直接扔掉了。

---

## img GET 请求的替代方案

### 方案原理

既然 `sendBeacon` 有大小限制，我们可以改用 `img` 标签发送 GET 请求：

```javascript
function sendDataViaImage(data) {
  const img = new Image();
  const params = new URLSearchParams();
  
  // 将数据编码到 URL 参数中
  Object.keys(data).forEach(key => {
    params.append(key, JSON.stringify(data[key]));
  });
  
  // 发送 GET 请求
  img.src = `/api/track?${params.toString()}`;
}
```

### 实现示例

```javascript
// 完整的数据上报函数
function reportData(data) {
  try {
    const dataString = JSON.stringify(data);
    
    // 检查数据大小
    if (dataString.length > 64 * 1024) {
      console.warn('数据过大，使用 img 方式发送');
      sendViaImage(data);
    } else {
      // 使用 sendBeacon
      navigator.sendBeacon('/api/track', dataString);
    }
  } catch (error) {
    console.error('数据上报失败:', error);
  }
}

function sendViaImage(data) {
  const img = new Image();
  const params = new URLSearchParams();
  
  // 压缩数据
  const compressedData = compressData(data);
  params.append('data', compressedData);
  
  img.src = `/api/track?${params.toString()}`;
  
  // 清理资源
  img.onload = img.onerror = () => {
    img.src = '';
  };
}
```

### 新问题：URL 长度限制

使用 `img` GET 请求虽然解决了 `sendBeacon` 的大小限制，但引入了新的问题：

1. **URL 长度限制**：大多数浏览器和服务器对 URL 长度有限制（通常 2048 字符）
2. **数据暴露**：GET 请求的参数会出现在日志中，可能泄露敏感信息
3. **缓存问题**：GET 请求可能被浏览器缓存，影响数据准确性

---

## 两种方案的对比分析

| 特性 | sendBeacon | img GET 请求 |
|------|------------|--------------|
| **数据大小限制** | 64KB | URL 长度限制（~2KB） |
| **并发请求限制** | 3-5 个 | 无限制 |
| **请求方法** | POST | GET |
| **数据安全性** | 高（请求体） | 低（URL 参数） |
| **浏览器支持** | 现代浏览器 | 所有浏览器 |
| **可靠性** | 高（异步发送） | 中等 |
| **性能影响** | 低 | 低 |

**关键洞察**：两种方案都有各自的限制，没有完美的解决方案。sendBeacon 的双重限制（大小 + 并发）使其在批量数据上报场景下更加脆弱。

---

## 最佳实践建议

### 1. 请求队列管理

```javascript
class BeaconQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.activeRequests = 0;
    this.queue = [];
  }
  
  send(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    const { data, resolve, reject } = this.queue.shift();
    this.activeRequests++;
    
    try {
      const success = navigator.sendBeacon('/api/track', JSON.stringify(data));
      if (success) {
        resolve();
      } else {
        reject(new Error('sendBeacon failed'));
      }
    } catch (error) {
      reject(error);
    } finally {
      this.activeRequests--;
      // 延迟处理下一个请求，避免并发冲突
      setTimeout(() => this.processQueue(), 100);
    }
  }
}

// 使用示例
const beaconQueue = new BeaconQueue(3);
beaconQueue.send({ event: 'user_click', timestamp: Date.now() });
```

### 2. 数据分片策略

```javascript
function sendLargeData(data) {
  const chunkSize = 50 * 1024; // 50KB 分片
  const dataString = JSON.stringify(data);
  
  if (dataString.length <= chunkSize) {
    // 小数据直接发送
    navigator.sendBeacon('/api/track', dataString);
  } else {
    // 大数据分片发送
    const chunks = splitIntoChunks(dataString, chunkSize);
    chunks.forEach((chunk, index) => {
      const chunkData = {
        chunk: chunk,
        index: index,
        total: chunks.length,
        sessionId: generateSessionId()
      };
      
      // 使用队列管理，避免并发问题
      beaconQueue.send(chunkData);
    });
  }
}
```

### 2. 数据压缩

```javascript
function compressData(data) {
  // 使用简单的压缩算法
  const compressed = JSON.stringify(data)
    .replace(/\s+/g, ' ') // 压缩空白字符
    .replace(/"/g, "'");  // 使用单引号减少字符数
  
  return compressed;
}
```

### 3. 混合策略

```javascript
function smartDataReport(data) {
  const dataSize = JSON.stringify(data).length;
  
  if (dataSize <= 2 * 1024) {
    // 小数据：使用 img GET
    sendViaImage(data);
  } else if (dataSize <= 64 * 1024) {
    // 中等数据：使用 sendBeacon
    navigator.sendBeacon('/api/track', JSON.stringify(data));
  } else {
    // 大数据：分片发送
    sendLargeData(data);
  }
}
```

---

## 参考资料

- [MDN - Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [Web API 数据上报最佳实践](https://web.dev/sendbeacon/)
- [浏览器 URL 长度限制详解](https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)

---

**记住**：在 Web 开发中，没有银弹。每个 API 都有其适用场景和限制，关键是要理解这些限制，并设计出合适的解决方案。

**数据上报就像送信，选择合适的信封大小，才能确保重要信息安全到达。**
