---
title: "Tree Part 4 - Find a pair with given sum in a Balanced BST"
date: 2022-04-28T20:47:18+08:00
tags:
- Tree
description: "正反中序遍历，栈"
images:
- pair-of-bst/test.png
---

## 问题

Given a Balanced Binary Search Tree and a target sum, write a function that returns true if there is a pair with sum equals to target sum, otherwise return false. Expected time complexity is O(n) and only O(Logn) extra space can be used. Any modification to Binary Search Tree is not allowed. Note that height of a Balanced BST is always O(Logn)

## 解答

Method 1: 遍历树，然后用数组去存节点的值。然后遍历数组。空间复杂度是O(n)。
Method 2: 这个正常遍历树。另一个逆序遍历树（因为最大的值在最右边）。然后和数组是一样的判断逻辑，左右指针向中间移动。

``` ts
// class Stack {
//     constructor() {
//         this.size = 0; // 分配的数组大小
//         this.top = 0;//-1 保存推到数组里的长度
//         this.array;
//     }
// }

// 适用于遍历一个节点。 然后做一个处理

while(true) {
    // 中序（正）遍历树
    while (done == false) {
        if (curr != null)
        {
            push(s, curr); // 将父节点推送到栈里缓存
            curr = curr.left;
        }
        else
        {
            if (isEmpty(s)) {
                done = true;
            }
            else
            {
                curr = pop(s1);
                curr = curr.right;
                done = true;
                // do something
            }
        }
    }

    // 中序（反）遍历树
    while (done == false) {
        if (curr != null)
        {
            push(s, curr);
            curr = curr.right;
        }
        else
        {
            if (isEmpty(s)) {
                done = true;
            }
            else
            {
                curr = pop(s1);
                curr = curr.left;
                done = true;
                // do something
            }
        }
    }

    // do something
}
```
