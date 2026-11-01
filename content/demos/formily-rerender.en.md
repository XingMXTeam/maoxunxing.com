---
title: "Formily Page-Level Re-renders and Long Tasks"
description: "A page-wide observer reading form.values re-renders all 100 rows. Compare two fixes: a field effect, and a narrower observer."
date: 2026-11-01
slug: formily-rerender
tags: ["Formily", "React", "Performance"]
---

**Scenario**: the observer is too coarse. The page component reads `form.values.items` to compute a total, so any field change re-renders the whole page and causes a long task.

**How to read it**: click the blue button (row 0 quantity +1). Rows that flash yellow were re-rendered; the boxes on top show re-rendered rows, main-thread blocking time, and long tasks.

- ❌ Problem: page-wide `observer`, 100 rows re-render per input
- ✅ Route i: `form.addEffects` + `onFieldValueChange('items.*.qty')`, only the total updates
- ✅ Route ii: move `observer` down to the total; each `Field` subscribes to itself only

[Open full screen](/demos/formily-rerender/)

{{< demo-embed src="/demos/formily-rerender/" height="900" >}}
