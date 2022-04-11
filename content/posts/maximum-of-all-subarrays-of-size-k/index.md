---
title: "Tree Part 3 - 长度为k的子数组的最大值"
date: 2021-08-26T15:16:39+08:00
tags:
- Tree
description: "滑动窗口的用法，AVL树的用法"
images:
- maximum-of-all-subarrays-of-size-k/maxresdefault.jpeg
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

``` js

function getMaxK(arr, k) {
    if(!arr) return;
    if(arr.length<=k) {
        return Math.max(...arr)
    }
    for (let index = 0; index <= arr.length - k; index++) {
        let result = Math.max(arr[index], arr[index+1], arr[index+2])
        console.log(result+' ')
    }
}

```

二层遍历，外层循环是(n-k)，里层是k, 根据乘法原则：(n-k) * k，所以时间复杂度是O(n*k) 
不要额外空间，所以空间复杂度是O(1)

Method 2: 用AVL树

AVL是一个人名的简称，是一种高度平衡(左右子树高度差不超过1)的二叉搜索树，它**方便寻找最值，并且保证查找/删除/插入时间复杂度都是O(logn)**。二叉搜索树也叫BST，它的左子树小于根节点，根节点小于右子树。

只需要构建k个节点的树，并且打印出这个树的最值。在JS中可以用sort函数去获得最值（底层实现用了AVL树）。

```ts
function getMaxK(arr, k) {
    const res = []

    const queue = []
    let index = 0
    for (; index < k ; index++) {
        queue.push(arr[index])
    }
    
    queue.sort((a, b) => b-a)
    res.push(queue[0])

    // 删除数组第一个元素
    queue.splice(arr[0], 1);

    for (; index < arr.length; index++) {
        const element = arr[index];
        queue.push(element)
        queue.sort((a,b) => b-a)
        res.push(queue[0])   
        
        queue.splice(arr[index-k+1], 1)     
    }
    return res
}

```

时间复杂度： 遍历数组n， 删除元素logk, 所以n*logk
空间复杂度： logk

如何用js构建AVL树？ 主要是节点做左右子旋的理解。
