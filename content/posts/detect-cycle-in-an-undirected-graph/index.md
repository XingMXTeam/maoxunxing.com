---
title: "Detect Cycle in an Undirected Graph"
date: 2021-08-24
tags:
- algorithm
- graphs
- programming
- union-find
- interview
description: "I am learning algorithm. This article talk about undirected graph."
images:
- detect-cycle-in-an-undirected-graph/graph.png
---


## Question Definition(S & T)

Given an undirected graph, how to check if there is a cycle in the graph ?

Example 1: 

Input：n  = 4 , e = 4, edges = { 0 1, 1 2, 2 3, 0 2 }

Output: yes

Diagram:

The diagram clearly shows a cycle 0 to 2 to 1 to 0

Example 2:

Input: n = 4, e = 3 the edges: {0 1, 1 2, 2 3}

Output:No

Explanation:

## Problem Analysis(A)
+ First, we need to create a data structures to save the undirected graph. we can use **adjacency list**, If vertex 1 is connected to vertices 2,3, hence adjacency list : { 1 : [2, 4] }. We can use **map** data structures by javascript. we can also use **adjacency matrix** 

+ Second, we need to check if there is a cycle 
  + **Method1**: disjoint set, make set、union、find set
      + initially, all vertexes are different sets
      + then we loop all edges's nodes, if the nodes are in different set, we union them. How we check they are in the same set, every node's parent is the present node, we think 
    they are in the same set. And the represent node's parent is negative n, n represent it has n child in its set
      + if the nodes are in the same set, then we know they have other way to reach each other, that means the cycle exists
  + **Method2**: bfs
  + **Method3**: dfs
      + we need a visited queue, if we visited a node, we make it visited. If we can a node is current node's adjacency node and meanwhile it is visited, then we find a cycle

### Code
``` js
/*
Graph using adjacency list. Support opertaions:
1 traverse by dfs\bfs
2 hasCircleByDfs
3 hasCircleByBfs
4 hasCircleByDss
*/
    class Graph {
      constructor() {
          this.allVertexes = []
          this.allEdges = []
          // map item link to []
          this.adList = new Map()
      }

      addV(v) {
          if (!this.adList.has(v)) {
              this.adList.set(v, [])
          }
          this.allVertexes.push(v)
      }

      addE(source, dest) {
          if (!this.adList.has(source)) {
              this.addV(source)
          }
          if (!this.adList.has(dest)) {
              this.addV(dest)
          }
          this.adList.get(source).push(dest)
          this.adList.get(dest).push(source)
          this.allEdges.push({
            dest,
            source
          })
      }

      removeV(v) {
          for (let adV of this.adList.get(v)) {
              this.removeE(v, adV)
          }
          this.adList.delete(v)
      }

      removeE(source, dest) {
          this.adList.set(source, this.adList.get(source).filter(v=>v !== dest))
          this.adList.set(dest, this.adList.get(dest).filter(v=>v !== source))
      }

      print() {
          for (let v of this.adList.keys()) {
              let cons = ''
              for (let dest of this.adList.get(v)) {
                  cons += dest + ' '
              }
              console.log(v + ' -> ' + cons)
          }
      }

      hasCircleByDss() {
        const dss = new DisjointSet()
        this.allVertexes.forEach(v => {
          dss.makeSet(v)
        })
        // if  union return true, we find a cycle
        return this.allEdges.some(e => this.union(e.source, e.dest))
      }

      bfs(start) {
          const queue = [start]
          const result = []
          const visited = {}
          visited[start] = true
          let curV
          while (queue.length) {
              curV = queue.shift()
              result.push(curV)
              this.adList.get(curV).forEach(dest=>{
                  if (!visited[dest]) {
                      visited[dest] = true
                      queue.push(dest)
                  }
              }
              )
          }
          return result
      }

      /*
        1 initial, all nodes are white. 
        2 the node is visited is gray
        3 the node's adejancey all visited, then this node is black
        if we find a node is gray(visited), but this node is not the current node's parent
      */
      hasCircleByBfs(start) {
        const result = false
        const queue = [{ v: start, parent: -1 }]
        const visited = {}
        visited[start] = false
        while(queue.length) {
          const curV = queue.shift()
          visited[curV] = true
          this.adList.get(curV).forEach(dest => {
            if(!visited[dest]) {
              visited[dest] = true
              queue.push({ v: dest, parent: curV })
            }
            else if(dest !== curV.parent) {
              return true
            }
          })
        }
        return false
      }
      dfsRecursive(start) {
          const result = []
          const visited = {};
          const adList = this.adList;
          (function dfs(v) {
              if (!v)
                  return null
              visited[v] = true
              result.push(v)
              adList.get(v).forEach(dest=>{
                  if (!visited[dest]) {
                      return dfs(dest)
                  }
              }
              )
          })(start);
          return result
      }

      dfsIterative(start) {
          const result = []
          const visited = {}
          const stack = [start]
          let curV
          visited[start] = true
          while (stack.length) {
              curV = stack.pop()
              result.push(curV)
              this.adList.get(curV).forEach(dest=>{
                  if (!visited[dest]) {
                      visited[dest] = true
                      stack.push(dest)
                  }
              }
              )
          }
          return result
      }


      dfsHasCircle() {
        
      }
      
  }

  // test code
  const g = new Graph()
  var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
      g.addV(vertices[i]);
  }

  g.addE('A', 'B');
  g.addE('A', 'D');
  g.addE('A', 'E');
  g.addE('B', 'C');
  g.addE('D', 'E');
  g.addE('E', 'F');
  g.addE('E', 'C');
  g.addE('C', 'F');

  g.print()

  
```

### Code
```js
/*
three operation: 
1 makeset
2 find
3 union
*/
class DisjointSet {
  constructor() {
    this.map = new Map()
  }
  makeSet(data) {
    this.map.set(data, -1)
  }
  find(x) {
    const parent = this.map.get(x)
    if(parent < 0) {
      return x
    }
    else {
      // recurse until you find x's parent
      return this.find(this.map.get(x))
    }
  }
  union(x, y) {
    const xparent = this.find(x)
    const yparent = this.find(y)
    if(xparent !== yparent) {
      // make the represent node's negative plus 1
      this.map.set(xparent, this.map.get(xparent) + this.map.get(yparent))
      // make y point to represents node x
      this.map.set(yparent, xparent)
    }
    else {
      // same set
      return true
    }
  }

  console_print() {
		console.log(JSON.stringify(this.map.values()))
	}
}

const dss = new DisjointSet()
const data = [1, 2, 3, 4, 5, 6, 7, 8]
data.forEach(item => {
  dss.makeSet(item)
})

dss.union(1,2)
dss.console_print();
dss.union(3,4)
dss.console_print();
dss.union(5,6)
dss.console_print();
dss.union(7,8)
dss.console_print();
dss.union(2,4);
dss.console_print();
dss.union(2,5);
dss.console_print();
dss.union(1,3);
dss.console_print();
dss.union(6,8);
dss.console_print();
dss.union(5,7);
dss.console_print();

var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];


```



## Time Complex


