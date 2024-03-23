---
title: "Array Part 2 - Minimum number of jumps to reach end"
date: 2022-04-16T22:29:56+08:00
tags:
  - Array
description: "数组移动"
images:
  - mininumber-to-end/test.png
---

## 问题

Given an array of integers where each element represents the max number of steps that can be made forward from that element. Write a function to return the minimum number of jumps to reach the end of the array (starting from the first element). If an element is 0, then we cannot move through that element. If we can’t reach the end, return -1.
Examples:

Input: arr[] = {1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9}
Output: 3 (1-> 3 -> 8 -> 9)
Explanation: Jump from 1st element to 2nd element as there is only 1 step, now there are three options 5, 8 or 9. If 8 or 9 is chosen then the end node 9 can be reached. So 3 jumps are made.

Input: arr[] = {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
Output: 10
Explanation: In every step a jump is
needed so the count of jumps is 10.

## 解答

1 Method 1： 暴力解法

```ts
//   i=1
// 1 0 0 0 0  1  4
// maxR 1 1
// step 1 2 1 0
// jump 2
function miniJumpsToEnd(arr) {
  const n = arr.length;
  if (n <= 1) return 0;
  if (arr[0] == 0) return -1;

  let maxReach = arr[0]; // 最大能走得到的索引
  let step = arr[0]; // 当前还剩几步
  let jumps = 1; // 总共走了多少步

  for (let index = 0; index < arr.length; index++) {
    if (index == arr.length - 1) {
      return jumps;
    }

    maxReach = Math.max(maxReach, index + arr[index]);

    step--;

    if (step == 0) {
      jumps++;

      // 不能继续往前走了 表示没有走到最后
      if (index >= maxReach) {
        return -1;
      }
      step = maxReach - index;
    }
  }
}
```

暴力解法有点不暴力呀，只遍历了一遍时间复杂度是 O(n)
通过三个变量记录当前状态，空间复杂度是 O(1)
