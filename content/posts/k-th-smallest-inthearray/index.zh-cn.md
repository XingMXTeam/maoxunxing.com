---
title: "Array Part 4 - K’th Smallest/Largest Element in Unsorted"
date: 2022-04-21T22:37:20+08:00
draft: true
tags:
  - 濯茶算法课
description: "1 快速排序 2 大顶堆 小顶堆"
images:
  - k-th-smallest-inthearray/test.png
---

## 问题

Given an array and a number k where k is smaller than the size of the array, we need to find the k’th smallest element in the given array. It is given that all array elements are distinct.

Input: arr[] = {7, 10, 4, 3, 20, 15}
k = 3
Output: 7

Input: arr[] = {7, 10, 4, 3, 20, 15}
k = 4
Output: 10

## 解答

```ts
function getKthSmallest(arr, k) {
  const newarr = arr.sort(a - b > a - b);
  return newarr[k - 1];
}
```

排序一般 O(nlogn)

大顶堆和小顶堆也可以解决。
