---
title: "算法解析 - dp问题"
date: 2021-08-16T19:46:23+08:00
draft: true
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

## 代码实现(S)

``` javascript
const getBSTCountOfN = n => {
  const T = [];
  T[1] = 1;
  T[2] = 2;
  for(let i = 3; i <= n - 1; i++) {
    // 假定i作为根节点， 我们知道它的BST树个数依赖于T[i-1]和T[n-i+1] 也就是说比如i=3， T[3]的结果依赖T[1] T[2]。 我们假定j为更1 2 这样的节点数
    // for(let j = 1; j < i; j++) {
    //   T[i] += T[i - 1] + T[j - i + 1] 
    // }
  }
  
}

```
