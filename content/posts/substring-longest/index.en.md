---
title: "Algorithm  #5: String Part 1 - Longest Palindromic Substring"
date: 2022-04-16T23:59:19+08:00
description: "Double Pointer Usage"
tags:
  - Algorithm 
  - String
  - Double Point
images:
  - substring-longest/test.png
---

## Questions

Given a string, find the longest substring which is a palindrome.
For Example:

Input: Given string :"forgeeksskeegfor",
Output: "geeksskeeg".

Input: Given string :"Geeks",
Output: "ee".

## Code

```ts
low = index - 1;
high = index + 1;
// 跳掉重复
while (high < n && str[high] == str[index]) {
  high++;
}
// 跳掉重复
while (low >= 0 && str[low] == str[index]) {
  low--;
}
// 中间是回文
while (low >= 0 && high < n && str[low] == str[high]) {
  low--;
  high++;
}
let length = high - low - 1;
if (maxLength < length) {
  maxLength = length;
  start = low + 1;
}
```

## Time Complex

There are two loops, the outside traverses the whole string, the inside expands from i to the outside, the worst is to expand to the beginning and the end, so the time complexity is O(n)
The space is only a single variable, and the space complexity is O(1)
