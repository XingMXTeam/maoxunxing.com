---
title: "sendBeacon's 64KB Limit: The Silent Data Killer"
date: 2025-10-27
tags:
  - JavaScript
  - Web API
  - Data Reporting
  - Performance Optimization
---

## Table of Contents

- [The Core Problem](#the-core-problem)
- [sendBeacon's 64KB Trap](#sendbeacons-64kb-trap)
  - [Why This Limit Exists](#why-this-limit-exists)
  - [What Happens When Exceeded](#what-happens-when-exceeded)
- [img GET Request Alternative](#img-get-request-alternative)
  - [How It Works](#how-it-works)
  - [Implementation Example](#implementation-example)
  - [New Problem: URL Length Limits](#new-problem-url-length-limits)
- [Comparison Analysis](#comparison-analysis)
- [Best Practice Recommendations](#best-practice-recommendations)
- [References](#references)

---

## The Core Problem

**Why is your data reporting always losing data?**

In web development, we often need to send data to servers for user behavior tracking, error logging, performance metrics, and more. The `sendBeacon` API should be the most reliable way to report data, but it hides a fatal flaw: a 64KB data size limit.

When your data exceeds this limit, the browser puts the request into a pending state, ultimately causing data loss. It's like trying to mail a package that's too heavy - the postal worker rejects it, and your important documents never reach their destination.

---

## sendBeacon's Double Trap

### Trap 1: Single Request 64KB Limit

The 64KB limit for `sendBeacon` isn't arbitrary but based on several technical considerations:

1. **Memory Protection**: Browsers need to allocate memory buffers for each request; oversized data consumes too much memory
2. **Network Efficiency**: Large data blocks are more likely to fail during transmission, affecting overall performance
3. **Security Considerations**: Limiting request size prevents malicious scripts from sending massive data attacks to servers

### Trap 2: Concurrent Request Limit

**The more insidious problem**: Even if individual requests are smaller than 64KB, sending multiple `sendBeacon` requests in succession can cause issues.

```javascript
// Dangerous example: sending multiple requests in succession
for (let i = 0; i < 10; i++) {
  const data = {
    event: `user_action_${i}`,
    timestamp: Date.now(),
    // Assume each request is only 10KB
  };
  
  // First 3 might work fine, 4th and 5th start pending
  navigator.sendBeacon('/api/track', JSON.stringify(data));
}
```

**Why does this happen?**

Browsers have **concurrent request limits** for `sendBeacon` (typically 3-5 requests). Requests exceeding this limit are queued or directly put into pending state. It's like a post office with only 3 postal workers - if you try to mail 10 letters at once, the last 7 have to wait in line.

### What Happens When Exceeded

Whether it's a single oversized request or too many concurrent requests, the browser will:

```javascript
// Dangerous example: oversized data
const largeData = {
  userActions: [...], // Assume this array is huge
  performanceMetrics: {...},
  errorLogs: [...]
};

// This causes the request to be pending, data lost
navigator.sendBeacon('/api/track', JSON.stringify(largeData));
```

**Result**:
- Request status shows as pending
- Browser won't retry
- Data permanently lost
- User behavior untrackable

It's like writing a long letter that doesn't fit in the mailbox - the postal worker just throws it away.

---

## img GET Request Alternative

### How It Works

Since `sendBeacon` has size limitations, we can use `img` tags to send GET requests instead:

```javascript
function sendDataViaImage(data) {
  const img = new Image();
  const params = new URLSearchParams();
  
  // Encode data into URL parameters
  Object.keys(data).forEach(key => {
    params.append(key, JSON.stringify(data[key]));
  });
  
  // Send GET request
  img.src = `/api/track?${params.toString()}`;
}
```

### Implementation Example

```javascript
// Complete data reporting function
function reportData(data) {
  try {
    const dataString = JSON.stringify(data);
    
    // Check data size
    if (dataString.length > 64 * 1024) {
      console.warn('Data too large, using img method');
      sendViaImage(data);
    } else {
      // Use sendBeacon
      navigator.sendBeacon('/api/track', dataString);
    }
  } catch (error) {
    console.error('Data reporting failed:', error);
  }
}

function sendViaImage(data) {
  const img = new Image();
  const params = new URLSearchParams();
  
  // Compress data
  const compressedData = compressData(data);
  params.append('data', compressedData);
  
  img.src = `/api/track?${params.toString()}`;
  
  // Clean up resources
  img.onload = img.onerror = () => {
    img.src = '';
  };
}
```

### New Problem: URL Length Limits

Using `img` GET requests solves `sendBeacon`'s size limitation but introduces new problems:

1. **URL Length Limits**: Most browsers and servers have URL length restrictions (typically 2048 characters)
2. **Data Exposure**: GET request parameters appear in logs, potentially leaking sensitive information
3. **Caching Issues**: GET requests may be cached by browsers, affecting data accuracy

---

## Comparison Analysis

| Feature | sendBeacon | img GET Request |
|---------|------------|-----------------|
| **Data Size Limit** | 64KB | URL length limit (~2KB) |
| **Concurrent Request Limit** | 3-5 requests | No limit |
| **Request Method** | POST | GET |
| **Data Security** | High (request body) | Low (URL parameters) |
| **Browser Support** | Modern browsers | All browsers |
| **Reliability** | High (async send) | Medium |
| **Performance Impact** | Low | Low |

**Key Insight**: Both approaches have their limitations - there's no perfect solution. sendBeacon's double limitations (size + concurrency) make it more fragile in bulk data reporting scenarios.

---

## Best Practice Recommendations

### 1. Request Queue Management

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
      // Delay processing next request to avoid concurrency conflicts
      setTimeout(() => this.processQueue(), 100);
    }
  }
}

// Usage example
const beaconQueue = new BeaconQueue(3);
beaconQueue.send({ event: 'user_click', timestamp: Date.now() });
```

### 2. Data Chunking Strategy

```javascript
function sendLargeData(data) {
  const chunkSize = 50 * 1024; // 50KB chunks
  const dataString = JSON.stringify(data);
  
  if (dataString.length <= chunkSize) {
    // Small data, send directly
    navigator.sendBeacon('/api/track', dataString);
  } else {
    // Large data, send in chunks
    const chunks = splitIntoChunks(dataString, chunkSize);
    chunks.forEach((chunk, index) => {
      const chunkData = {
        chunk: chunk,
        index: index,
        total: chunks.length,
        sessionId: generateSessionId()
      };
      
      // Use queue management to avoid concurrency issues
      beaconQueue.send(chunkData);
    });
  }
}
```

### 2. Data Compression

```javascript
function compressData(data) {
  // Use simple compression algorithm
  const compressed = JSON.stringify(data)
    .replace(/\s+/g, ' ') // Compress whitespace
    .replace(/"/g, "'");  // Use single quotes to reduce character count
  
  return compressed;
}
```

### 3. Hybrid Strategy

```javascript
function smartDataReport(data) {
  const dataSize = JSON.stringify(data).length;
  
  if (dataSize <= 2 * 1024) {
    // Small data: use img GET
    sendViaImage(data);
  } else if (dataSize <= 64 * 1024) {
    // Medium data: use sendBeacon
    navigator.sendBeacon('/api/track', JSON.stringify(data));
  } else {
    // Large data: send in chunks
    sendLargeData(data);
  }
}
```

---

## References

- [MDN - Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [Web API Data Reporting Best Practices](https://web.dev/sendbeacon/)
- [Browser URL Length Limits Explained](https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)

---

**Remember**: In web development, there's no silver bullet. Every API has its use cases and limitations. The key is understanding these limitations and designing appropriate solutions.

**Data reporting is like sending mail - choose the right envelope size to ensure your important information reaches its destination safely.**
