---
title: "Tree Part 2 - Given N, Find The Total Number of Unique BSTs"
date: 2021-08-16
tags:
  - Algorithm
description: "1 Recursive tree 2 DP solution method"
images:
  - find-the-total-number-of-unique-bsts-of-n/test.png
---

## Question Definition (S & T)

Given N, Find the total number of unique BSTs that can be made using values from 1 to N

**Examples:**  
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

## Problem Analysis(A)

At first, I did not quite understand what the question means. What is BST? its definition is: the value of any node is less than any node in the right subtree, greater than any node in the left subtree. I think it is one probably, but there can be a variety of cases.

For example, given the nodes 3 1 2, at least the below arrangement can satisfy the condition of BST.{{< img src="ex1.png" alt="ex1" maxWidth="900px" >}} If you think about it carefully, you can continue to come up with other arrangements {{< img src="ex2.png" alt="ex2" maxWidth="900px" >}}
ok, the meaning of the question is clearly understood. Then, how to analyze the number of BST trees with n nodes. The algorithm is the key, currently, we don't know what data structure to use. We use the method of analytical induction to find the pattern.

- 1 There is only one node, it is obviously only one case: T(1) = 1
- 2 If there are two nodes, there are two cases: T(2) = 2
- 3 If there are three nodes:

  - Assuming that 1 is the root node, and 2 3 is to the right of the root node, the result will be: T(0) \* T(2)( we already know T(2) = 2)
  - Assuming that 2 is the root node, and 1 3 are on each side， the result will be: T(1) \* T(1)
  - Assuming that 3 is the root node, and 1 2 is to the left of the root node, the result will be: T(2) \* T(0)
    In this way, we traverse all the possible cases: T(2)+T(1)+T(2) = 2 + 1 + 2 = 5
    so the result is 5, which matches the result in the problem definition's cases

- 3 What if there are 4 nodes, such as 1 2 3 4. Again along the lines of the above, there are:
  - T(0) \* T(3), i = 1
  - T(1) \* T(2), i = 2
  - T(2) \* T(1), i = 3
  - T(3) \* T(0), i = 4

Then, add them all： 5+2+2+5=14 yeah, the result is correct

Based on the above analysis, we can probably know the rule: assuming that i is the root node, T[i-1]\*T[n-i] is the number of BST trees in the current case. And the final number of BST trees is obtained by traversing all the nodes as the root node and then. Adding their numbers together.

### Code

Violent solution. Recursive solution exactly according to the above analysis

```javascript
// i is the root, n is the total nodes' number
const G = (i, n) => {
  return fn(i - 1) * fn(n - i);
};

// Get the total number of BST trees with n nodes.
const fn = (n) => {
  let _ = 0;
  if (n === 0 || n === 1) return 1;
  for (let i = 1; i <= n; i++) {
    _ += G(i, n);
  }
  return _;
};
console.log(fn(3));
```

If you had learned the CS course before, because the code is all about recursive. We can draw the recursive tree: f(3) is the final results, numbers of 3 nodes. G(1,3) denotes 1 as the root, and 3 is the total numbers of nodes.
we can also made a conclution: G(i, n) = f(i-1)\*f(n-i)

{{< img src="ex3.jpeg" alt="ex3" maxWidth="900px" >}}

From the recursive tree, we can also see that f(1) f(2) f(0) are double computed, we can cache these data to avoid double computation.

```js
// get the total number of BST tress with i as the root node
const G = (i, n) => {
  return fn(i - 1) * fn(n - i);
};
const dp = [];
const fn = (n) => {
  let _ = 0;
  if (n === 0 || n === 1) return 1;
  if (dp[n]) {
    console.log("hit cache");
    return dp[n];
  }
  // loop all nodes
  for (let i = 1; i <= n; i++) {
    // add them all
    _ += G(i, n);
  }
  // cache result
  dp[n] = _;
  return _;
};
console.log(fn(3));
```

There should be three hits. But we only have one. So this way, we cannot fully utilize the repeated calculations. We can rule from to bottom. For example, in the case of i as the root, we first calculate the value with i-1...1 as the value of the root of i.

so, we can optimze as follows:

```js
const getNumberOfBSTs = (n) => {
  const T = [];
  T[0] = 1;
  T[1] = 1;
  for (let i = 2; i <= n; i++) {
    // j form 1 to i represents the already calculated results
    for (let j = 1; j <= i; j++) {
      // This is the conclusion derived from the recursive tree above
      T[i] += T[j - 1] * T[i - j];
    }
  }
};
```

## Time Complex

Double loop, so the time complex is O(n^2)
