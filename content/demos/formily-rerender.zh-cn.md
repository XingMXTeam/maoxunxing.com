---
title: "Formily 页面级重渲染与 Long Task"
description: "整页 observer 读取 form.values 导致 100 行全部重渲染；对比两种收敛方案：effect 监听、拆细 observer。"
date: 2026-11-01
slug: formily-rerender
tags: ["Formily", "React", "性能"]
---

**场景**：Observer 粒度不够细，页面组件为了算「合计」读了 `form.values.items`，任意一个字段变化都会让整页重渲染，产生 long task。

**怎么看**：点蓝色按钮（第 0 行数量 +1），黄色闪烁的行就是被重渲染的行，顶部色块显示重渲染行数、主线程阻塞时间和 long task。

- ❌ 问题写法：整页 `observer`，一次输入重渲染 100 行
- ✅ 路线 i：`form.addEffects` + `onFieldValueChange('items.*.qty')`，只更新合计组件
- ✅ 路线 ii：`observer` 下沉到合计组件，每个 `Field` 只订阅自己

[全屏打开](/demos/formily-rerender/)

{{< demo-embed src="/demos/formily-rerender/" height="900" >}}
