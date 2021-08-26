---
title: "Maximum of all subarrays of size k"
date: 2021-08-26T15:16:39+08:00
tags:
- algorithm
- programming
- BST
- AVL
- max-top-heap
description: "I am learning algorithm."
---
## Question Definition(S & T)

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
Method 1: violent solution

``` js

```

Method 2: use AVL tree data structure to solve the problem

BST definition: left tree is lower than root , root is greater 
AVL: is a unique BST,any left and right tree's height diff less than 1. It has benefits: we can lookup, insert, delete at log n time, and the maximum is  at the deep right tree. The problem is how we keep the balance of AVL tree,  we need to know if the tree is unbalanced( we can calculated the left tree and right tree's height diff value, if greater than 1, then the tree is not balanced), rotate nodes when we delete and add nodes. And we should know what rotate operation we should do.

Basically, rotate should have a node with.


``` js
/*
we need to create a AVL tree
keep balance operations:
1 leftRotate
2 rightRotate

basic operations:
1 insert
2 delete
*/
const max = (a, b) => {
  return a > b ? a : b
}
class Node {
  constructor(data) {
    this.data = data
    this.height = 1
    this.left = null
    this.right = null
  }
}
class AVLTree {
  constructor()
  {
    this.root = null
  }
  height(node) {
    if(!node) return 0
    return node.height
  }
  getBalance(node) {
    if(!node) return 0
    return this.height(node.left) - this.height(node.right)
  }
  /*
    because we need recursive, so wee need pass node reference 
    @params {Node} node - the root of current insert tree
    @params {any}  data - the inserted data
    @return {Node} tree root 
  */
  insert(node, data) {
    // if leaf node (when root is null , return a new node)
    if(!node) {
      return new Node(data)
    }

    // 1 insert to the tree
    if(data < node.data) {
      node.left = this.insert(node->left, data)
    }
    else if(data > node.data) {
      node.right = this.insert(node->right, data)
    }
    else {
      // duplicated data
      return node
    }

    // 2 update node's height
    node.height = max(this.height(node.left), this.height(node.right)) + 1

    // 3 balance tree
    const balance = this.getBalance(node)
    //  we always think about three nodes
    if(balance > 1 && data < node.left.data) {
      return this.rightRotate(node)
    }
    if(balance < -1 && data > node.right.data) {
      return this.leftRotate(node)
    }
    if(balance > 1 && data > node.left.data) {
      // rotate left part
      node.left = this.leftRotate(node.left)
      return this.rightRotate(node)
    }
    if(balance < -1 && data < node.right.data) {
      // rotate right part
      node.right = this.rightRotate(node.right)
      return this.leftRotate(node)
    }
    return node
  }
  rightRotate(node) {
    // use two pointer
    const x = node.left
    // ref to old x.right
    const y = x.right

    // perform rotate
    x.right = node // change x.right keep x.left
    node.left = y // change node.left keep node.right

    // update nodes

    return x
  }
  leftRotate(node) {

  }
  
}

```


## Time Complex(R)



