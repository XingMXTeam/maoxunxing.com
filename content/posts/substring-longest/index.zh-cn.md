---
title: "Longest Palindromic Substring"
date: 2022-04-16T23:59:19+08:00
description: "双指针用法"
tags:
  - 算法
images:
  - substring-longest/test.png
---

## 问题

Given a string, find the longest substring which is a palindrome.
For Example:

Input: Given string :"forgeeksskeegfor",
Output: "geeksskeeg".

Input: Given string :"Geeks",
Output: "ee".

## 解答

代码模版：

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

存在两个循环，外面遍历整个字符串，里面从 i 开始往外扩，最坏就是扩到头尾，所以时间复杂度是 O(n)
空间只有单个变量，空间复杂度是 O(1)
