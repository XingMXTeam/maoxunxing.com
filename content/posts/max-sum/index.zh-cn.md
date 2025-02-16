---
title: "Find the Largest Sum of Contiguous Subarray "
date: 2022-04-17T20:44:08+08:00
description: "DP解法"
tags:
  - 算法
images:
  - max-sum/test.png
---

## 问题描述

在一个一维数组中，找到具有最大和的连续子数组，并返回其最大和。

### 示例
输入：
```text
arr = [-2, -3, 4, -1, -2, 1, 5, -3]
```
输出：
```text
7
```
解释：
最大和的连续子数组为 `[4, -1, -2, 1, 5]`，其和为 `4 + (-1) + (-2) + 1 + 5 = 7`。

---

## 解答

### 方法：Kadane 算法

Kadane 算法是一种高效的动态规划算法，用于解决最大子数组和问题。其核心思想是通过遍历数组，动态维护当前子数组的最大和以及全局最大和。

#### 实现代码
```ts
function maxSubArraySum(arr: number[]): number {
  // 初始化变量
  const maxint = Math.pow(2, 53); // JavaScript 中的最大安全整数
  let maxSoFar = -maxint - 1;     // 全局最大和，初始值设为最小值
  let maxEndingHere = 0;          // 当前子数组的最大和

  // 遍历数组
  for (let index = 0; index < arr.length; index++) {
    maxEndingHere = maxEndingHere + arr[index]; // 更新当前子数组和

    // 如果当前子数组和大于全局最大和，则更新全局最大和
    if (maxSoFar < maxEndingHere) {
      maxSoFar = maxEndingHere;
    }

    // 如果当前子数组和小于 0，则重新开始计算子数组
    if (maxEndingHere < 0) {
      maxEndingHere = 0;
    }
  }

  return maxSoFar; // 返回全局最大和
}

// 测试用例
const arr = [-2, -3, 4, -1, -2, 1, 5, -3];
console.log(maxSubArraySum(arr)); // 输出: 7
```

---

### 算法解析

1. **初始化**：
   - `maxSoFar`：记录全局最大和，初始值设为最小值（`-Infinity` 或 `-Math.pow(2, 53) - 1`）。
   - `maxEndingHere`：记录当前子数组的最大和，初始值为 `0`。

2. **遍历数组**：
   - 每次将当前元素加入 `maxEndingHere`，表示扩展当前子数组。
   - 如果 `maxEndingHere` 大于 `maxSoFar`，则更新 `maxSoFar`。
   - 如果 `maxEndingHere` 小于 `0`，说明当前子数组对后续结果无贡献，重置为 `0`。

3. **返回结果**：
   - 遍历结束后，`maxSoFar` 即为最大子数组和。

---

### 时间复杂度与空间复杂度

- **时间复杂度**：`O(n)`  
  - 只需遍历数组一次，效率较高。
- **空间复杂度**：`O(1)`  
  - 只使用了常量级额外空间。

---

### 总结

Kadane 算法通过动态规划的思想，以线性时间复杂度解决了最大子数组和问题。该算法适用于处理大规模数据，且实现简单、高效。对于类似问题（如最大子矩阵和），也可以基于此算法进行扩展。