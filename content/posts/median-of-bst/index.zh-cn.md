---
title: "Tree Part 3 - Find median of BST in O(n) time and O(1) space"
date: 2022-04-25T08:58:13+08:00
tags:
- Tree
images:
- median-of-bst/test.png
description: "Morris中序遍历"
---


## 问题

Given a Binary Search Tree, find median of it. 
If no. of nodes are even: then median = ((n/2th node + (n+1)/2th node) /2 
If no. of nodes are odd : then median = (n+1)/2th node.
## 解答

第一反应是中序遍历出来，然后直接打印出来中间的值。但是如果用递归的话，空间复杂度不是1。我们要采用Morris遍历的方式:

代码模版：

``` ts
 while(current != null) {
    // 到最左边了 。访问该数字
    if(current.left === null) {
        count++
        current = current.right
    }
    else {
        // 一直往右（这里pre.right==current 表示到了最后一个节点
        pre = current.left
        while(pre.right !== null && pre.right !== current) {
            pre = pre.right
        }
        
        // 设置最右边的右节点指向current 保证能回到起始位置
        if(pre.right === null) {
            pre.right = current
            current = current.left
        }
        // 走到了最右边了。 访问该数字
        else {
            pre.right = null
            count++
            current = current.right
        }
    }
}
```

因为每个元素都遍历了一遍，所以时间复杂度是O(n)
因为只使用了current和pre指针，所以空间复杂度为O(1)