---
title: "Tree Part 1 - Find postorder traversal of BST from preorder traversal"
date: 2022-04-24T21:03:45+08:00
tags:
- Recursive
description: "递归法； 分治思想"
images:
- postorder/test.png
---

## 问题

Given an array representing preorder traversal of BST, print its postorder traversal. 

Input : 40 30 35 80 100
Output : 35 30 100 80 40

Input : 40 30 32 35 80 90 100 120
Output : 35 32 30 120 100 90 80 40

## 解答

从先序遍历里构造BST树，然后再后序遍历出来

Method 1: 遍历数组，然后逐个创建

``` ts

let node;

function createNode(node, data) {
    if (!node) {
        node = new TreeNode(data)
    }
    if (node.data > data) {
        node.left = createNode(node.left, data)
    }
    if (node.data < data) {
        node.right = createNode(node.right, data)
    }
    return node
}

for (let i = 0; i < arr.length; i++) {
    node = createNode(node, arr[i])
}

```

因为一开始遍历了一遍，然后创建节点的时候又循环了一遍，所以时间复杂度是O(n^2)

Method 2:  通过划分元素为两部分，然后分别构造BST树

从根节点开始构建，把{ Number.MIN_VALUE ... value } 放在左子树，{ value ... NUMBER.MAX_VALUE } 放右子树，递归创建即可

``` ts
function construct(arr, value, min, max, size) {
    if (index > size) return null
    var root = null
    // 如果不在这个范围内，会自动跳出循环
    if (value > min && value < max) {
        root = new TreeNode(value)
        index += 1
        root.left = construct(arr, arr[index], min, value, size)
        root.right = construct(arr, arr[index], value, max, size)
    }
    return root
}

```

这个算法index，逐渐递增，只会遍历一遍数组，所以时间复杂度是O(n) 

直接通过划分的方式找出后序遍历的顺序

``` ts

function postOrder(arr) {
    let preIndex = new Int(0) // 索引
    return loopUtil(arr, arr.length, Number.MIN_VALUE, Number.MAX_VALUE, preIndex)
}

function loopUtil(pre, size, min, max, preIndex) {
    if(preIndex.data == size) return 

    // 1 不属于当前子树
    if(pre[preIndex.data] < min && pre[preIndex.data] > max) {
        return 
    }

    
    let val = pre[preIndex.data]
    preIndex.data++

    // 在{ min, val }区间的在左子树
    loopUtil(pre, size, min, val, preIndex)
    
    // 在{ val, max }区间的在右子树
    loopUtil(pre, size, val, max, preIndex)

    // 2 打印当前值
    console.log('val', val)
}

```

因为只遍历一遍，所以时间复杂度是O(n) n是节点个树
空间复杂度是O(n) n是函数调用栈分配的大小

