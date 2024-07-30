---
title: "算法日记 #4期： Array Part 3 - Find the Largest Sum of Contiguous Subarray "
date: 2022-04-17T20:44:08+08:00
description: "DP解法"
tags:
  - 算法日记
images:
  - max-sum/test.png
---

## 问题

Write an efficient program to find the sum of contiguous subarray within a one-dimensional array of numbers that has the largest sum.

arr = [-2, -3, 4, -1, -2, 1, 5, -3]

OutPut: 7
Explain: 4 + -1 + -2 + 1 + 5 = 7

## 解答

```ts
let maxint = Math.pow(2, 53);
let maxSoFar = -maxint - 1;
let maxEndingHere = 0;
for (let index = 0; index < arr.length; index++) {
  maxEndingHere = maxEndingHere + arr[index];
  if (maxSoFar < maxEndingHere) {
    maxSoFar = maxEndingHere;
  }
  // 总和变小了 重新开始
  if (maxEndingHere < 0) {
    maxEndingHere = 0;
  }
}
```
