---
title: "Detect Cycle in an Undirected Graph"
date: 2021-08-24
tags:
- algorithm
- graphs
- programming
- union-find
description: "I am learning algorithm. This is my first post about tree and dp problem."
---


## Question Definition(T & S)

Given an undirected graph, how to check if there is a cycle in the graph ?

Example, Input 
n  = 4 , e = 4,
ediges = { 0 1, 1 2, 2 3, 0 2 }
Output: yes

Diagram:

The diagram clearly shows a cycle 0 to 2 to 1 to 0

Input:n = 4, e = 3 
0 1, 1 2, 2 3 
Output:No 
Explanation: 
## Problem Analysis(A)
1 First, we need to create a data constructor to save the undirected graph.
### Code
``` js

class Graph {
  constructor(n, v) {
    this.n = n
    this.v = v
    this.edges = new Map()
  }


}

```

## Time Complex(R)


