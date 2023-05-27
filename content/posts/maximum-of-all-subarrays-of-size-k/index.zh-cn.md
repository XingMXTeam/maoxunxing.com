---
title: "Array Part 1 - 长度为k的子数组的最大值"
date: 2021-08-26T15:16:39+08:00
tags:
  - Array
  - Tree
  - AVL
  - Slide Window
description: "滑动窗口的用法，AVL树的用法"
images:
  - maximum-of-all-subarrays-of-size-k/test.png
---

## 问题

Give an array and an integer **K**, find the maximum for each and every condiguous subarray of size k.

Examples:  
Input: arr[] = { 1, 2, 3, 1, 4, 5, 2, 3, 6 } K = 3  
Ouput: 3 3 4 5 5 5 6  
Maximum of 1, 2, 3 is 3  
Maximum of 2, 3, 1 is 3  
Maximum of 3, 1, 4 is 4  
Maximum of 1, 4, 5 is 5  
Maximum of 4, 5, 2 is 5  
Maximum of 5, 2, 3 is 5  
Maximum of 2, 3, 6 is 6

## Problem Analysis(A)

Method 1: 暴力解法 [代码示例](./暴力解法.ts)

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

二层遍历，外层循环是(n-k)，里层是 k, 根据乘法原则：(n-k) * k，所以时间复杂度是 O(n*k)
不要额外空间，所以空间复杂度是 O(1)

Method 2: 用 AVL 树

AVL 是一个人名的简称，是一种高度平衡(左右子树高度差不超过 1)的二叉搜索树，它**方便寻找最值，并且保证查找/删除/插入时间复杂度都是 O(logn)**。二叉搜索树也叫 BST，它的左子树小于根节点，根节点小于右子树。

只需要构建 k 个节点的树，并且打印出这个树的最值。在 JS 中可以用 sort 函数去获得最值（底层实现用了 AVL 树）。

```ts
function getMaxK(arr, k) {
  const res = [];

  const queue = [];
  let index = 0;
  for (; index < k; index++) {
    queue.push(arr[index]);
  }

  queue.sort((a, b) => b - a);
  res.push(queue[0]);

  // 删除数组第一个元素
  queue.splice(arr[0], 1);

  for (; index < arr.length; index++) {
    const element = arr[index];
    queue.push(element);
    queue.sort((a, b) => b - a);
    res.push(queue[0]);

    queue.splice(arr[index - k + 1], 1);
  }
  return res;
}
```

时间复杂度： 遍历数组 n， 删除元素 logk, 所以 n\*logk
空间复杂度： logk

如何用 js 构建 AVL 树？ 主要是节点做左右子旋的理解。

这里总结了一套代码模版：

1 节点平衡模版

```ts
const balance = this.getBalance(node);
//  左左
if (balance > 1 && data < node.left.data) {
  return this.rightRotate(node);
}

// 右右
if (balance < -1 && data > node.right.data) {
  return this.leftRotate(node);
}

// 左右
if (balance > 1 && data > node.left.data) {
  node.left = this.leftRotate(node.left);
  return this.rightRotate(node);
}

// 右左
if (balance < -1 && data < node.right.data) {
  node.right = this.rightRotate(node.right);
  return this.leftRotate(node);
}
```

2 左旋模版

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

3 右旋模版

```ts
function rightRotate() {
  let x = y.left;
  let T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;
  return x;
}
```

插入节点简单就是递归删除，删除节点需要考虑删除根节点的情况

Method 3: Two Stack 双栈

代码模版：

```ts
const s1 = []; // 划动窗口
const s2 = []; // 临时窗口

const n = arr.length;

// 初始
for (let index = 0; index < k - 1; index++) {
  insert(s2, arr[index]);
}

for (let i = 0; i <= n - k; i++) {
  // 更新
  if (i - 1 >= 0) update(s1, s2);

  // 插入
  insert(s2, arr[i + k - 1]);

  //res.push(Math.max(s1[s1.length-1].max, s2[s2.length-1].max))
}
```

因为只需要遍历一次，所以时间复杂度是 O(n) 因为两个栈最多只有 k 个元素 再根据加法原理，空间复杂度是 O(k)

Method 4: Max-Heap 大顶堆
