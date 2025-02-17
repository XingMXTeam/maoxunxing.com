---
title: "Longest Palindromic Substring"
date: 2022-04-16T23:59:19+08:00
description: "双指针用法"
tags:
  - 算法
images:
  - substring-longest/test.png
---
## 目录

1. [问题描述](#问题描述)
2. [解答思路](#解答思路)
3. [代码实现](#代码实现)
4. [复杂度分析](#复杂度分析)

---

## 问题描述

给定一个字符串，找到其中最长的回文子串。

### 示例

#### 示例 1
输入：
```text
"forgeeksskeegfor"
```
输出：
```text
"geeksskeeg"
```

#### 示例 2
输入：
```text
"Geeks"
```
输出：
```text
"ee"
```

---

## 解答思路

要找到字符串中的最长回文子串，可以采用**中心扩展法**。具体步骤如下：

1. 遍历字符串的每个字符，将其视为回文中心。
2. 向左右两侧扩展，检查是否满足回文条件（即左右字符相等）。
3. 跳过重复字符以处理偶数长度的回文。
4. 记录当前最长回文子串的起始位置和长度，并在遍历结束后返回结果。

---

## 代码实现

以下是基于 TypeScript 的代码实现：

```ts
function longestPalindrome(str: string): string {
  const n = str.length;
  if (n === 0) return "";

  let maxLength = 1; // 最长回文子串的长度
  let start = 0;     // 最长回文子串的起始位置

  for (let index = 0; index < n; index++) {
    let low = index - 1;
    let high = index + 1;

    // 跳过右侧重复字符
    while (high < n && str[high] === str[index]) {
      high++;
    }

    // 跳过左侧重复字符
    while (low >= 0 && str[low] === str[index]) {
      low--;
    }

    // 中间部分是回文，继续向外扩展
    while (low >= 0 && high < n && str[low] === str[high]) {
      low--;
      high++;
    }

    // 计算当前回文子串的长度
    const length = high - low - 1;
    if (maxLength < length) {
      maxLength = length;
      start = low + 1;
    }
  }

  // 返回最长回文子串
  return str.substring(start, start + maxLength);
}
```

---

## 复杂度分析

### 时间复杂度
- **O(n²)**：  
  - 外层循环遍历整个字符串，时间复杂度为 O(n)。
  - 内层循环从每个字符为中心向两侧扩展，最坏情况下会扩展到头尾，时间复杂度为 O(n)。
  - 因此，总时间复杂度为 O(n²)。

### 空间复杂度
- **O(1)**：  
  - 只使用了常量级别的额外空间（如 `low`、`high`、`maxLength` 等变量），因此空间复杂度为 O(1)。

---

## 总结

通过**中心扩展法**，我们能够高效地找到字符串中的最长回文子串。该方法的核心在于利用回文的对称性，逐步扩展并记录最长的结果。尽管时间复杂度为 O(n²)，但在实际应用中表现良好，且空间复杂度仅为 O(1)，非常适合处理中小型字符串。
