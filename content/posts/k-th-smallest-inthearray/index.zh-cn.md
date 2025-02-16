---
title: "Array Part 4 - K’th Smallest/Largest Element in Unsorted"
date: 2022-04-21T22:37:20+08:00
tags:
  - 算法
description: "1 快速排序 2 大顶堆 小顶堆"
images:
  - k-th-smallest-inthearray/test.png
---

## 问题描述

给定一个数组和一个整数 `k`，其中 `k` 小于数组的长度，我们需要找到数组中第 `k` 小的元素。假设数组中的所有元素都是不同的。

### 示例 1
输入：
```text
arr[] = {7, 10, 4, 3, 20, 15}
k = 3
```
输出：
```text
7
```

### 示例 2
输入：
```text
arr[] = {7, 10, 4, 3, 20, 15}
k = 4
```
输出：
```text
10
```

---

## 解答

### 方法 1：排序法
通过将数组排序后，直接返回第 `k` 小的元素。

#### 实现代码
```ts
function getKthSmallest(arr: number[], k: number): number {
  const sortedArr = arr.sort((a, b) => a - b); // 升序排序
  return sortedArr[k - 1]; // 返回第 k 小的元素
}
```

#### 时间复杂度
- 排序的时间复杂度为 **O(n log n)**，其中 `n` 是数组的长度。
- 空间复杂度为 **O(1)**（如果原地排序）或 **O(n)**（如果创建了新数组）。

---

### 方法 2：堆排序（大顶堆/小顶堆）

可以使用堆来优化查找第 `k` 小元素的过程，避免对整个数组进行排序。

#### 思路
1. **小顶堆**：
   - 构建一个小顶堆，依次弹出堆顶元素 `k-1` 次，最后堆顶即为第 `k` 小的元素。
   - 时间复杂度为 **O(n + k log n)**。
2. **大顶堆**：
   - 构建一个大小为 `k` 的大顶堆，遍历数组时维护堆的大小。
   - 如果当前元素小于堆顶元素，则替换堆顶并调整堆。
   - 最终堆顶即为第 `k` 小的元素。
   - 时间复杂度为 **O(n log k)**。

#### 实现代码（大顶堆）
```ts
function getKthSmallestUsingHeap(arr: number[], k: number): number {
  const maxHeap = new MaxHeap();

  for (let i = 0; i < arr.length; i++) {
    if (maxHeap.size() < k) {
      maxHeap.insert(arr[i]); // 插入堆中
    } else if (arr[i] < maxHeap.peek()) {
      maxHeap.extractMax(); // 移除堆顶
      maxHeap.insert(arr[i]); // 插入新元素
    }
  }

  return maxHeap.peek(); // 堆顶即为第 k 小元素
}

// 假设 MaxHeap 是一个实现好的大顶堆类
class MaxHeap {
  private heap: number[] = [];

  insert(value: number) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMax(): number {
    const max = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    return max;
  }

  peek(): number {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] >= this.heap[index]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private heapifyDown(index: number) {
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let largestIndex = index;

      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] > this.heap[largestIndex]) {
        largestIndex = leftChildIndex;
      }
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] > this.heap[largestIndex]) {
        largestIndex = rightChildIndex;
      }
      if (largestIndex === index) break;
      [this.heap[index], this.heap[largestIndex]] = [this.heap[largestIndex], this.heap[index]];
      index = largestIndex;
    }
  }
}
```

#### 时间复杂度
- **构建堆**：`O(n log k)`。
- **空间复杂度**：`O(k)`（堆的大小限制为 `k`）。

---

## 总结

1. **排序法**：
   - 简单易实现，适合小规模数据。
   - 时间复杂度较高（`O(n log n)`），不适合大规模数据。

2. **堆排序法**：
   - 更高效，特别是当 `k` 远小于 `n` 时。
   - 使用大顶堆的时间复杂度为 `O(n log k)`，适合处理大规模数据。

根据实际需求选择合适的算法：
- 如果数据量较小，可以直接使用排序法。
- 如果数据量较大且 `k` 较小，推荐使用堆排序法。