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

## 什么时候用哪种

**为什么会有路线 i**：`observer` 会自动追踪渲染时读到的所有响应式数据。整页一旦读了 `form.values.items`，就等于订阅了每个字段。手动写 effect 是把这份订阅从渲染里挪出来，显式写清楚「监听哪些路径、变化后更新谁」。

**只是想少渲染**：优先用路线 ii，把 `observer` 下沉到真正用到数据的小组件，代码最少，也最符合 Formily 的写法。

**这些情况用路线 i（effect）**：

- 老页面整页包着 `observer`，一时拆不动，先用 effect 把派生数据挪出去止血
- 变化很频繁，需要节流、防抖或批量计算
- 变化后要做副作用：发请求、联动其他字段、把合计写回 form（`form.setValuesIn('total', ...)`），这些本来就不该放在渲染里
- 派生逻辑想和 UI 解耦，放在表单模型层统一维护

**注意**：effect 要用唯一 id 注册，组件卸载时 `form.removeEffects(id)`，否则会重复监听。

[全屏打开](/demos/formily-rerender/)

{{< demo-embed src="/demos/formily-rerender/" height="900" >}}
