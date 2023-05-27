---
title: "我对A/B实验的理解"
date: 2021-09-09
draft: true
tags:
  - A/B Test
  - User Growth
description: "我对A/B实验的理解"
images:
  - ab-test/ab.png
---

## 关键概念

H0: A、B 没有本质差异
H1: A、B 确实存在本质差异

p 值： 根据 z 检验算出 p 值，如果 p<0.05，则取 H0
置信区间：是一个我们相当肯定会包含真实值的数据范围 比如 95%置信区间 在[0.88, 0.97]范围内。 因为是采样，所以结果有好（在置信区间的数值范围内）有坏（不在范围内）。
[解释](https://www.shuxuele.com/data/confidence-interval.html)

## 分流原理

《overlapping experiment infrastructure: more, better, faster experimentation》

未完待续...
