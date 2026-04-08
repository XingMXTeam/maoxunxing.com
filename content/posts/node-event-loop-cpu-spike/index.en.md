---
title: "Node.js CPU Spike Analysis: When Requests Hang and Event Loop Starves"
description: "Why CPU spikes to 100% when requests hang - two real production cases on timeouts and rate limiting"
date: 2025-04-08
tags:
  - Node.js
  - Performance
  - Event Loop
  - CPU
---

## The Problem

In production environments, we often encounter a peculiar phenomenon: **CPU usage suddenly spikes to 100% while the application appears to be "doing nothing."** No active computations, no heavy processing—just hanging requests and a frozen event loop.

This article analyzes two real-world cases from a large-scale operation platform:

1. **RPC batch processing timeout causing CPU spikes**
2. **Message queue subscriber CPU anomalies without rate limiting**

## Case 1: RPC Batch Processing - The Silent Killer

### The Scenario

We have a `getBatchCompleteModuleDiff` method that processes 100 components in batches. Each component triggers 4-5 RPC calls to backend services.

```typescript
// Before optimization - Serial processing, NO timeout
async getBatchCompleteModuleDiff(componentIds: number[]) {
  const chunks = chunk(componentIds, 5)  // 20 batches for 100 components
  let result = []
  
  for (const chunkItem of chunks) {  // Serial execution!
    const res = await Promise.all(
      chunkItem.map(id => this.getCompleteModuleDiffInfo(id))
    )
    result.push(res)
  }
  return result
}
```

### Why CPU Spikes When Requests Hang

The root cause is **Event Loop Starvation** caused by the combination of:

1. **No timeout control** - RPC calls could hang indefinitely
2. **Promise accumulation** - 20 batches × 5 components × 4 RPC calls = 400+ concurrent Promises
3. **Event loop blocking** - All Promises compete for event loop cycles

Here's what happens:

```
Timeline:
├── Batch 1 starts (5 components × 4 RPC calls = 20 Promises)
├── Batch 1 hangs (backend database exception, no timeout)
├── Batch 2 starts (another 20 Promises)
├── Batch 2 hangs
├── ...
├── Batch 20 starts (another 20 Promises)
├── Event Loop: 400+ pending Promises waiting
└── CPU: 100% (event loop constantly checking Promise states)
```

The CPU isn't doing useful work—it's **spinning on Promise resolution checks**.

### The Solution

```typescript
// After optimization - Parallel batches with timeout
async getBatchCompleteModuleDiff(componentIds: number[]) {
  const componentIdsChunks = chunk(componentIds, 10)  // Larger chunks
  
  // Parallel processing with timeout protection
  const batchPromises = componentIdsChunks.map(async (chunk) => {
    const promises = chunk.map(id => 
      this.withTimeout(
        this.getCompleteModuleDiffInfo(id),
        5000,  // 5s timeout prevents indefinite hanging
        `timeout for id: ${id}`
      )
    )
    return Promise.allSettled(promises)  // Isolate failures
  })
  
  return Promise.all(batchPromises)
}

private withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    promise
      .then(result => { clearTimeout(timeoutId); resolve(result) })
      .catch(error => { clearTimeout(timeoutId); reject(error) })
  })
}
```

### Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Response Time | 60s+ | 5-8s | 87% ↓ |
| CPU Usage | 90-100% | 40-50% | 50% ↓ |
| Timeout Control | None | 5s | Prevents hanging |

## Case 2: Message Queue Subscriber - The Rate Limiting Problem

### The Scenario

Our `CheckTaskResultSubscriber` processes message queue messages for inspection task results:

```typescript
@MessageSubscriber({ topic: 'TASK_RESULT' })
export class CheckTaskResultSubscriber implements IMessageSubscriber {
  @Inject()
  checkReportService: CheckReportService

  async subscribe(msg: SubscribeMessage) {
    const messageBody = JSON.parse(msg.body.toString())
    
    if (this.INSPECTOR_TAGS.includes(messageTag)) {
      await this.handleInspectorResult(messageBody)  // DB operations
    } else if (this.DETECTION_TAGS.includes(messageTag)) {
      await this.handleDetectionResult(messageBody)  // DB operations
    }
  }
}
```

### Why CPU Spikes Without Rate Limiting

Message queue consumers by default **pull messages as fast as possible**. When:

1. **Message burst occurs** (e.g., 1000 tasks complete simultaneously)
2. **Each message triggers DB operations** (queries, updates)
3. **No concurrency control** - all messages processed concurrently
4. **Connection pool exhaustion** - DB connections max out
5. **Event loop saturated** - waiting on I/O operations

```
Message Burst (1000 messages)
    ↓
No Rate Limiting
    ↓
1000 concurrent async operations
    ↓
DB Connection Pool (max 50) exhausted
    ↓
949 operations waiting for connections
    ↓
Event Loop: Constantly polling/waiting
    ↓
CPU: 100% (context switching + polling overhead)
```

### Why This Happens in Node.js

Unlike Java's thread pool model, Node.js uses a **single-threaded event loop**:

- **Java**: Thread pool limits concurrent execution naturally (e.g., 50 threads = max 50 concurrent operations)
- **Node.js**: No natural limit—can create unlimited Promises that all compete for the event loop

When Promises wait for I/O (DB connections), they don't "pause"—they constantly check if the resource is available, consuming CPU cycles.

### The Missing Rate Limiting

Looking at our message queue configuration:

```typescript
// config.prod.ts
config.messageQueue = {
  enableDefaultProducer: true,
  pub: { /* ... */ },
  // NO sub configuration! Consumer uses default settings
}
```

The subscriber has **no concurrency control** at either the:
- Message queue level (no prefetch limit)
- Application level (no semaphore/bottleneck)

### Recommended Solutions

#### 1. Add Concurrency Control in Subscriber

```typescript
import { Semaphore } from 'async-mutex'

@MessageSubscriber({ topic: 'TASK_RESULT' })
export class CheckTaskResultSubscriber implements IMessageSubscriber {
  // Limit concurrent processing to 10
  private semaphore = new Semaphore(10)

  async subscribe(msg: SubscribeMessage) {
    await this.semaphore.runExclusive(async () => {
      // Process message
      await this.processMessage(msg)
    })
  }
}
```

#### 2. Use p-limit for Simpler Control

```typescript
import pLimit from 'p-limit'

const limit = pLimit(5)  // Max 5 concurrent

async subscribe(msg: SubscribeMessage) {
  await limit(() => this.processMessage(msg))
}
```

#### 3. Configure Message Queue Consumer Thread Pool

```typescript
config.messageQueue = {
  enableDefaultProducer: true,
  pub: { /* ... */ },
  sub: {
    taskResult: {
      consumerGroup: 'CID_TASK_RESULT',
      topics: ['TASK_RESULT'],
      consumeThreadCount: 5,  // Limit consumer threads
      maxReconsumeTimes: 3
    }
  }
}
```

## Key Takeaways

### Why Requests Hanging Cause CPU Spikes

| Factor | Explanation |
|--------|-------------|
| **Promise overhead** | Each pending Promise consumes event loop cycles |
| **No timeout** | Hanging requests accumulate indefinitely |
| **Resource competition** | DB connections, memory, file descriptors exhaust |
| **Polling cost** | Event loop constantly checks I/O readiness |
| **Context switching** | V8 engine overhead from Promise state transitions |

### Prevention Strategies

1. **Always set timeouts** for external calls (RPC, HTTP, DB)
2. **Implement rate limiting** for message consumers
3. **Use `Promise.allSettled`** instead of `Promise.all` to isolate failures
4. **Monitor event loop lag** as an early warning indicator
5. **Add circuit breakers** for cascading failure prevention

### Monitoring Checklist

```javascript
// Event loop lag monitoring
const eventLoopLag = require('event-loop-lag')
setInterval(() => {
  const lag = eventLoopLag()
  if (lag > 100) {  // > 100ms indicates problem
    console.warn(`Event loop lag: ${lag}ms`)
  }
}, 1000)
```

## Conclusion

Node.js CPU spikes during request hanging are counterintuitive but explainable:

- **It's not the hanging itself** that consumes CPU
- **It's the accumulation of waiting Promises** competing for event loop attention
- **Timeout and concurrency control** are essential defenses

The key insight: Node.js requires explicit resource management that other languages handle implicitly through thread pools. Without it, "doing nothing" can consume everything.

---

*This article is based on real production incidents from a large-scale operation platform. The optimization reduced P99 latency from 60s to 8s and stabilized CPU usage at 40-50%.*
