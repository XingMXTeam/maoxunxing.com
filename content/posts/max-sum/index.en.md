---
title: "Array Part 3 - Find the Largest Sum of Contiguous Subarray "
date: 2022-04-17T20:44:08+08:00
description: "DP Solution"
tags:
  - Array
images:
  - max-sum/test.png
---

## Question

Write an efficient program to find the sum of contiguous subarray within a one-dimensional array of numbers that has the largest sum.

arr = [-2, -3, 4, -1, -2, 1, 5, -3]

OutPut: 7
Explain: 4 + -1 + -2 + 1 + 5 = 7

## Code

This can handle the all-negative case

```ts
// DP ?
let maxSoFar = arr[0];
let maxEndingHere = arr[0];

for (let i = 1; i < arr.length; i++) {
  // 计算出来的和 和当前值 取更大的那个作为当前最大值
  maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
  maxSoFar = Math.max(maxEndingHere, maxSoFar);
}
```

```ts
let maxSoFar = Number.MIN_VALUE;
let maxEndingHere = 0;
for (let i = 0; i < arr.length; i++) {
  // 如果和累积 则继续添加
  if (maxEndingHere + arr[i] >= arr[i]) {
    maxEndingHere += arr[i];
  }
  // 否则重新开始
  else {
    maxEndingHere = arr[i];
  }
  if (maxEndingHere > maxSoFar) {
    maxSoFar = maxEndingHere;
  }
}
```

```ts
// let maxint = Math.pow(2, 53)
// let maxSoFar = -maxint - 1
let maxSoFar = Number.MIN_VALUE;
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

## Time Complex

Only traversed once, time complexity is O(n) space complexity is O(1)
