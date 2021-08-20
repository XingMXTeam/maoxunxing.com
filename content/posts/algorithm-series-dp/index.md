---
title: "Algorithm Series - DP"
date: 2021-08-16
tags:
- algorithm
- dp
- tree
- programming
description: "我正在学习算法，这是我的算法系列第一篇."
images:
- algorithm-series-dp/tree.jpg
---
## 问题定义(T & S)

Given N, Find the total number of unique BSTs that can be made using values from 1 to N

Examples:
Input: n = 3
Output: 5
For n = 3, preorder traversal of 
1. 1 2 3
2. 1 3 2
3. 2 1 3
4. 3 1 2
5. 3 2 1
   
Input: 4
Output: 14

## 问题解析(A)
一开始这个问题没太懂是什么意思，咋一想觉得就一种情况（思维定势了），什么是BST（binary search tree），它的定义是： 任意节点的值小于右子树任意节点，大于左子树任意节点。先想，边画出来，其实是可以有多种情况的。 比如给出节点3 1 2，至少可以这么排列， 是满足BST的条件的
![https://img.alicdn.com/imgextra/i4/O1CN012epCeb1gxJLOy60PJ_!!6000000004208-2-tps-1629-716.png](https://img.alicdn.com/imgextra/i4/O1CN012epCeb1gxJLOy60PJ_!!6000000004208-2-tps-1629-716.png)
再认真想一下可以继续想出其他排列方式：
![https://img.alicdn.com/imgextra/i2/O1CN01LCisNs1F4MCD9ujmy_!!6000000000433-2-tps-3287-1443.png](https://img.alicdn.com/imgextra/i2/O1CN01LCisNs1F4MCD9ujmy_!!6000000000433-2-tps-3287-1443.png)

OK，理解清楚了题意。 那么，怎么分析这出n个节点的BST树的个数呢。 们用分析归纳法，找规律

+ 1 如果只有一个节点，显然只有一种情况，我们标记为T(1) = 1
+ 2 如果有两个节点，有两种情况 我们标记为T(2) = 2
![https://img.alicdn.com/imgextra/i4/O1CN01eEPUIg1urGjsKPygS_!!6000000006090-0-tps-580-255.jpg](https://img.alicdn.com/imgextra/i4/O1CN01eEPUIg1urGjsKPygS_!!6000000006090-0-tps-580-255.jpg)
+ 3 如果是三个节点，从上面的例子，我们可以看出来T(3) = 5. 从图可以看出来，每个节点都可能作为根节点，比如这三个节点是1，2，3，我们依次把遍历： 
  * 假设1为根节点，2 3在根节点右边，根据2可知T(2) = 2
  * 假设2为根节点，1和2分别在两边，T(1)=1
  * 假设3为根节点， 1和2在根节点左边，T(2) = 2
这样，我们遍历了所有情况, T(2)+T(1)+T(2) = 2 + 1 + 2 = 5
所以结果是5，符合问题定义中的结果。 

+ 3 如果有4个节点呢，比如 1 2 3 4. 同样按照上面的思路，有
  + T(3)
  + T(1) * T(2) 为什么是相乘？很好理解，是相交的关系，遍历下就清楚了
  + T(2) * T(1)
  + T(3)
加起来： 5+2+2+5=14 结果符合问题定义的输出结果
我们根据以上的遍历，大概能知道规律了：假定i是根节点，T[i-1]*T[n-i+1]就是当前情况的BST树个数，最终的BST树的个数，是遍历所有的节点作为根节点，然后把他们的个数相加。

我们把递归树画出来： f(3)表示3个节点的最终BST树个数，G(1,3)表示1作为根节点，3是总共的节点个数
![https://img.alicdn.com/imgextra/i2/O1CN01TOo2Es1zDUQANviIO_!!6000000006680-0-tps-654-433.jpg](https://img.alicdn.com/imgextra/i2/O1CN01TOo2Es1zDUQANviIO_!!6000000006680-0-tps-654-433.jpg)
得出结论： i是当前节点 n是总节点
G(i, n) = f(i-1)*f(n-i)

从递归树可以看出来，f(1) f(2) f(0)都存在重复计算。 我们缓存这些数据，避免重复计算。
## 代码实现(S)

暴力解法: 完全按照以上分析思路，递归求解

``` javascript
  // 获取i作为根节点的总BST树个数
  const G = (i,n)=>{
      return fn(i - 1) * fn(n - i)
  }
  
  // 获取n个节点的总BST树个数
  const fn = n=>{
      let _ = 0
      if(n===0||n===1) return 1
      // 遍历所有节点
      for (let i = 1; i <= n; i++) {
         // 将BST树相加
          _ += G(i, n)
      }
      return _
  }
  console.log(fn(3))
```

dp解法（缓存递归树中重复计算的值）

``` js
  // 获取i作为根节点的总BST树个数
  const G = (i,n)=>{
      return fn(i - 1) * fn(n - i)
  }
  // 用来缓存数据
    const dp = []; 
  // 获取n个节点的总BST树个数
  const fn = n=>{
      let _ = 0
      if(n===0||n===1) return 1;
      // 如果有值，则直接返回
      if(dp[n]) {
        console.log('命中缓存')
        return dp[n]
      }
      // 遍历所有节点
      for (let i = 1; i <= n; i++) {
         // 将BST树相加
          _ += G(i, n)
      }
      // 缓存结果
      dp[n] = _
      return _
  }
  console.log(fn(3))
```
通过以上方式，可以看到缓存命中率，当n=3时只有一次。
![https://img.alicdn.com/imgextra/i4/O1CN01pKHWio1pUlCHLnccm_!!6000000005364-2-tps-810-166.png](https://img.alicdn.com/imgextra/i4/O1CN01pKHWio1pUlCHLnccm_!!6000000005364-2-tps-810-166.png)

正常理解应该命中三次才对。所以这种写法不能完全利用了重复计算。 我们可以从上到下的规则，比如以i为根的情况，我们先计算以i-1...1为i根的值。

```js

const getNumberOfBSTs = n => {
  const T = []
  // 已知结果
  T[0] = 1
  T[1] = 1
  // T[n]是表示最终的结果
  for(let i = 2; i <= n; i++) {
    // j从1到i 表示已计算的节点
    for(let j = 1; j <=i; j++) {
        // 这个是根据上面递归树，推导出的结论
        T[i] += T[j-1]*T[i-j]
    }
  }
}
```

## 时间复杂度分析
从上面代码可以看出， 双层循环时间复杂度为O(n^2)
