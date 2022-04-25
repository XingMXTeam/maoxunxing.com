---
title: "Tree Part 3 - Find median of BST in O(n) time and O(1) space"
date: 2022-04-25T08:58:13+08:00
---


## 问题

Given a Binary Search Tree, find median of it. 
If no. of nodes are even: then median = ((n/2th node + (n+1)/2th node) /2 
If no. of nodes are odd : then median = (n+1)/2th node.

Given BST(with odd no. of nodes) is : 
                    6
                 /    \
                3       8
              /   \    /  \
             1     4  7    9

Inorder of Given BST will be : 1, 3, 4, 6, 7, 8, 9
So, here median will 6.

Given BST(with even no. of nodes) is :  
                    6
                 /    \
                3       8
              /   \    /  
             1     4  7    

Inorder of Given BST will be : 1, 3, 4, 6, 7, 8
So, here median will  (4+6)/2 = 5.

## 解答

第一反应是中序遍历出来，然后直接打印出来中间的值。但是如果用递归的话，空间复杂度不是1



