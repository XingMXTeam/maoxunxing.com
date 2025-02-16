---
title: "Array Part 1 - 长度为k的子数组的最大值"
date: 2021-08-26T15:16:39+08:00
tags:
  - 算法
description: "滑动窗口的用法，AVL树的用法"
images:
  - maximum-of-all-subarrays-of-size-k/test.png
---
## 问题描述

给定一个数组和一个整数 **K**，找到每个长度为 **K** 的连续子数组的最大值。

### 示例
输入：
```text
arr[] = {1, 2, 3, 1, 4, 5, 2, 3, 6}, K = 3
```
输出：
```text
3 3 4 5 5 5 6
```
解释：
- 子数组 `[1, 2, 3]` 的最大值是 `3`
- 子数组 `[2, 3, 1]` 的最大值是 `3`
- 子数组 `[3, 1, 4]` 的最大值是 `4`
- 子数组 `[1, 4, 5]` 的最大值是 `5`
- 子数组 `[4, 5, 2]` 的最大值是 `5`
- 子数组 `[5, 2, 3]` 的最大值是 `5`
- 子数组 `[2, 3, 6]` 的最大值是 `6`

---

## 解决方案分析

以下是几种常见的解决方案及其时间复杂度和空间复杂度分析。

---

### 方法 1：暴力解法

#### 实现代码
```js
function getMaxK(arr, k) {
  if (!arr) return;
  if (arr.length <= k) {
    return Math.max(...arr);
  }
  for (let index = 0; index <= arr.length - k; index++) {
    let result = Math.max(arr[index], arr[index + 1], arr[index + 2]);
    console.log(result + " ");
  }
}
```

#### 分析
- **时间复杂度**：  
  外层循环遍历 `(n-k)` 次，内层计算最大值需要 `k` 次操作，因此总时间复杂度为 **O(n*k)**。
- **空间复杂度**：  
  不需要额外空间，因此空间复杂度为 **O(1)**。

---

### 方法 2：AVL 树

#### 背景知识
AVL 树是一种高度平衡的二叉搜索树（BST），其左右子树的高度差不超过 1。它支持插入、删除和查找操作的时间复杂度均为 **O(log k)**，非常适合用于动态维护最值。

#### 实现代码
```ts
function getMaxK(arr, k) {
  const res = [];
  const queue = [];
  let index = 0;

  // 初始化前 k 个元素
  for (; index < k; index++) {
    queue.push(arr[index]);
  }
  queue.sort((a, b) => b - a); // 排序以模拟 AVL 树
  res.push(queue[0]);

  // 滑动窗口处理剩余元素
  for (; index < arr.length; index++) {
    const element = arr[index];
    queue.push(element);
    queue.sort((a, b) => b - a); // 插入后重新排序
    res.push(queue[0]);
    queue.splice(arr[index - k + 1], 1); // 删除滑出窗口的元素
  }

  return res;
}
```

#### 分析
- **时间复杂度**：  
  遍历数组需要 `n` 次操作，每次插入或删除元素需要 `log k` 时间，因此总时间复杂度为 **O(n*log k)**。
- **空间复杂度**：  
  维护一个大小为 `k` 的队列，因此空间复杂度为 **O(k)**。

#### 构建 AVL 树的关键模板
1. **节点平衡模板**
   ```ts
   const balance = this.getBalance(node);
   // 左左情况
   if (balance > 1 && data < node.left.data) {
     return this.rightRotate(node);
   }
   // 右右情况
   if (balance < -1 && data > node.right.data) {
     return this.leftRotate(node);
   }
   // 左右情况
   if (balance > 1 && data > node.left.data) {
     node.left = this.leftRotate(node.left);
     return this.rightRotate(node);
   }
   // 右左情况
   if (balance < -1 && data < node.right.data) {
     node.right = this.rightRotate(node.right);
     return this.leftRotate(node);
   }
   ```

2. **左旋模板**
   ```ts
   function leftRotate(x) {
     let y = x.right;
     let T2 = y.left;
     y.left = x;
     x.right = T2;
     x.height = Math.max(height(x.left), height(x.right)) + 1;
     y.height = Math.max(height(y.left), height(y.right)) + 1;
     return y;
   }
   ```

3. **右旋模板**
   ```ts
   function rightRotate(y) {
     let x = y.left;
     let T2 = x.right;
     x.right = y;
     y.left = T2;
     y.height = Math.max(height(y.left), height(y.right)) + 1;
     x.height = Math.max(height(x.left), height(x.right)) + 1;
     return x;
   }
   ```

---

### 方法 3：双栈法

#### 实现代码
```ts
const s1 = []; // 滑动窗口
const s2 = []; // 临时窗口
const n = arr.length;

// 初始化
for (let index = 0; index < k - 1; index++) {
  insert(s2, arr[index]);
}

for (let i = 0; i <= n - k; i++) {
  // 更新窗口
  if (i - 1 >= 0) update(s1, s2);
  // 插入新元素
  insert(s2, arr[i + k - 1]);
  // 记录最大值
  res.push(Math.max(s1[s1.length - 1].max, s2[s2.length - 1].max));
}
```

#### 分析
- **时间复杂度**：  
  每个元素最多被插入和删除一次，因此总时间复杂度为 **O(n)**。
- **空间复杂度**：  
  使用两个栈存储最多 `k` 个元素，因此空间复杂度为 **O(k)**。

---

### 方法 4：大顶堆（Max-Heap）

#### 思路
使用大顶堆动态维护当前窗口中的最大值。大顶堆的特点是可以快速获取最大值，并支持高效的插入和删除操作。

#### 分析
- **时间复杂度**：  
  每次插入和删除操作的时间复杂度为 **O(log k)**，总时间复杂度为 **O(n*log k)**。
- **空间复杂度**：  
  堆中最多存储 `k` 个元素，因此空间复杂度为 **O(k)**。

---

## 总结

| 方法       | 时间复杂度   | 空间复杂度 | 适用场景                     |
|------------|--------------|------------|------------------------------|
| 暴力解法   | O(n*k)       | O(1)       | 数据规模较小                 |
| AVL 树     | O(n*log k)   | O(k)       | 动态维护最值，数据规模较大   |
| 双栈法     | O(n)         | O(k)       | 高效且易于实现               |
| 大顶堆     | O(n*log k)   | O(k)       | 动态维护最值，适合大规模数据 |

根据实际需求选择合适的算法。如果对性能要求较高且数据规模较大，推荐使用 **双栈法** 或 **大顶堆**。