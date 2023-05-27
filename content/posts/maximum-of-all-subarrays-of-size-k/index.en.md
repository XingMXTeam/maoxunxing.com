---
title: "Array Part 1 - The maximum value of a subarray of length k"
date: 2021-08-26T15:16:39+08:00
tags:
  - Array
  - Tree
  - AVL
  - Slide Window
description: "Usage of sliding window, usage of AVL tree"
images:
  - maximum-of-all-subarrays-of-size-k/test.png
---

## Question

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

Method 1: Violent solution [code example](./暴力解法.ts)

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

Two-level traversal, outer loop is (n-k), inner layer is k, according to the multiplication principle: (n-k) * k, so the time complexity is O(n*k)
No extra space, so the space complexity is O(1)

Method 2: Using AVL tree

AVL is a short name for a highly balanced (left and right subtree height difference not more than 1) binary search tree, which ** facilitates finding the most value and guarantees that the find/delete/insert time complexity is O(logn)**. A binary search tree, also called a BST, has a left subtree smaller than the root node and a root node smaller than the right subtree.

It is only necessary to construct the tree with k nodes and print out the most value of this tree. In JS you can use the sort function to get the most value (the underlying implementation uses an AVL tree).

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

## Time and Space Complex

Time complexity: traverse array n, delete element logk, so n\*logk
Space complexity: logk

How to build AVL tree with js? The main thing is that the nodes do left and right subspin understanding.

Here is a summary of a set of code templates:

1 Node balancing template

```ts
const balance = this.getBalance(node);
//  left left
if (balance > 1 && data < node.left.data) {
  return this.rightRotate(node);
}

// right right
if (balance < -1 && data > node.right.data) {
  return this.leftRotate(node);
}

// left right
if (balance > 1 && data > node.left.data) {
  node.left = this.leftRotate(node.left);
  return this.rightRotate(node);
}

// right left
if (balance < -1 && data < node.right.data) {
  node.right = this.rightRotate(node.right);
  return this.leftRotate(node);
}
```

2 Left-rotate template

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

3 right-rotate template

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

Inserting a node is simply recursive deletion, and deleting a node requires consideration of the deletion of the root node

Method 3: Two Stack

Code Template：

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

Because it only needs to be traversed once, the time complexity is O(n) Because the two stacks have at most k elements And according to the addition principle, the space complexity is O(k)

Method 4: Max-Heap
