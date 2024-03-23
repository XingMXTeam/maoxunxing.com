---
title: "Spelling correction for search engines"
date: 2023-06-23T20:46:15+08:00
tags:
- Algorithm
description: "The spelling correction function was never discovered, but it turns out to be calculated via the Levenstein distance!"
images:
- dynamic-lwst/nerdgirl.png
---

{{< img src="nerdgirl.png" alt="bg" maxWidth="960px" align="center" caption="Photo by Stable Diffusion" >}}

## Case

Given two strings, how to quantify their similarity. This introduces the concept of "edit distance", which is the minimum number of edits required to convert one string to another. The number of edits
The lower the number of edits, the higher the similarity. Let's say we have two strings: mitcmu and mtacnu. What is their edit distance?

## Analysis

One way is still to list all possibilities, achieved by a backtracking algorithm:  
If a[i] and a[j] match, then recursively examine a[i+1] and b[j+1]  
If a[i] and b[j] do not match, there are multiple ways to handle this  
1. delete a[i] and recursively examine a[i] and b[j+1], or delete b[j] and recursively examine a[i+1] and b[j]  
2. add: add a character equal to b[j] in front of a[i], then recursively consider a[i] and b[j+1]; or add a character equal to a[i] in front of b[j], then recursively examine a[i+1] and b[j]  
3. substitution: replace a[i] with b[j], or replace b[j] with a[i], and then recursively examine a[i+1] and b[j+1]  

This approach uses a backtracking algorithm and has a high time complexity. We draw recursive trees for f(i,j,edit_dist) and find that duplicate child nodes appear, indicating that they can be optimised.
How to optimise, for nodes with the same (i,j) we only need to keep the node with a smaller edit_dist to continue the recursion, the other nodes can be discarded. Thus the state goes from (i,j,edit_dist) to (i,j,min_edit_dist).
min_edit_dist is also our minimum number of edit operations, which is the minimum number of edits to convert the string a[0,i-1] to b[0,j-1]. Furthermore, by recursive trees, we find that the state (i,j) can be transformed from (i-1,j), to
(i, j - 1), (i-1, j-1) from any one of the states. Writing out the state transfer equation is:  
  
If a[i-1] ! = b[j-1], then minDist[i,j] = Min(minDist(i-1,j) + 1, minDist(i,j-1) + 1, minDist(i-1,j-1) + 1)  
if a[i-1] == b[j-1], then minDist[i,j] = Min(minDist(i-1,j)+1, minDist(i,j-1)+1, minDist(i-1,j-1))

Translated into code this is:


```js
function lwstDP(a, n, b, m) {
    const minDist = new Array(n + 1);
    for (let i = 0; i < n + 1; i++) {
        minDist[i] = new Array(m + 1);
        minDist[i][0] = i;
    }

    for (let j = 0; j < m + 1; j++) {
        minDist[0][j] = j;
    }

    for (let i = 1; i < n + 1; i++) {
        for (let j = 1; j < m + 1; j++) {
            if (a[i - 1] === b[j - 1]) {
                minDist[i][j] = minOfThree(
                    minDist[i - 1][j] + 1,
                    minDist[i][j - 1] + 1,
                    minDist[i - 1][j - 1]
                );
            } else {
                minDist[i][j] = minOfThree(
                    minDist[i - 1][j] + 1,
                    minDist[i][j - 1] + 1,
                    minDist[i - 1][j - 1] + 1
                );
            }
        }
    }

    return minDist[n][m];
}

function minOfThree(n1, n2, n3) {
    return Math.min(n1, Math.min(n2, n3));
}

```
