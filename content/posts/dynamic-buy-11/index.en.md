---
title: "The Double 11 Roundup Problem"
date: 2023-06-23T11:26:08+08:00
tags:
- Algorithm 
description: "Solving dynamic planning from state tables is easy, but not all dynamic planning problems can be solved with state tables"
images:
- dynamic-buy-11/img.png
---
## Case

Suppose we have n items in our shopping cart (at a known price) and pick from these n items that just meet the price required for a full sale, say $200. How do we pick them?
This is simplified: let's say we have [2,2,4,6,3], an array storing the prices of the items, and our full price reduction requirement is $10.

## Analysis

The most conventional approach to this problem is to be able to list all the permutations and then find the item that meets the requirement. This idea is essentially the backtracking idea.
But this solution can be slow to compute results if the number of items is large, because the time complexity is exponential. So what's the solution?

We take our cue from the backpack problem, which is the problem of loading the most items from a known backpack with a known maximum load.
For example, we already have items: [2,2,4,6,3] the maximum number of items we can fit in the backpack without exceeding its maximum weight of 9.

Again we can traverse each permutation and draw a recursive tree, i.e. each decision node is f(i,cw). where i is the decision about which item to put in the backpack and cw (current weight) is the weight of the current item.
Through this tree, you can see that there are some duplicate nodes (if you are interested, draw the recursive tree to see how many nodes there are. (Compare this to the complexity of going through the state table)


1. Method 1: By recording the duplicate nodes one at a time (using a memo, a two-dimensional array [number of items][maximum weight]) and returning them directly if there is a value, rather than repeating the calculation.

2. Method 2: By recording only the different states in the state table (a two-dimensional array [number of items][maximum weight]), the set of states in the next layer is derived based on the set of states in the previous layer, which ensures that the number of states in each layer does not exceed w.
   This ensures that the number of states in each layer does not exceed w (w being the maximum weight the pack can carry)

{{< img src="img_1.png" alt="ex1" maxWidth="960px" caption="State table filling process" >}}

With both methods, exponential growth of the state can be avoided. Here we use method 2 (which is generally done by dynamic programming and is more general).
The double 11 pooling problem is similar, in that it is essentially about selecting items with a price of 10. Here we assume that our upper limit is 10*3, i.e. the sum of the prices of the items exceeds 30, and we give up buying if we go too far beyond that



Code: 

```js
function double11advance(items, n, w) {
    // 以下代码和背包问题没差别
    let states = new Array(n); // 初始化状态表
    for (let i = 0; i < n; i++) {
        states[i] = new Array(3 * w + 1).fill(false);
    }

    states[0][0] = true; // 首先第一次决策
    if (items[0] <= 3 * w) {
        states[0][items[0]] = true;
    }

    for (let i = 1; i < n; i++) {
        for (let j = 0; j <= 3 * w; j++) { // 不选择
            if (states[i - 1][j] === true) {
                states[i][j] = states[i - 1][j]; // 状态保持不变和上一次一样
            }
        }
        for (let j = 0; j <= 3 * w - items[i]; j++) { // 选择
            if (states[i - 1][j] === true) {
                states[i][j + items[i]] = true; // 标记该点位为已决策
            }
        }
    }
    
    // 以下部分和背包问题有差异

    let j;
    for (j = w; j < 3 * w + 1; j++) { // 找到最接近200的决策价格
        if (states[n - 1][j] === true) {
            break;
        }
    }

    if (j === 3 * w + 1) { // 找不到这样的组合
        return;
    }

    for (let i = n - 1; i >= 1; i--) { // 从第一个商品开始
        // 从n个商品中检测，如果上一个标记点位[i-1, j-items[i]]标记是1表示是选择了该商品
        if (j - items[i] > 0 && states[i - 1][j - items[i]] === true) {
            console.log(items[i] + " ");// 打印已选商品
            j = j - items[i];
        }
    }

    if (j !== 0) { // 如果还有钱剩余，表示第0个商品也选了（因为我们状态表是从上一个状态推导到下一个）如果没有买第0个，到这里j == 0了，如果j不为0，说明买了第0个
        console.log(items[0]);
    }
}
```



