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

## When to use which

**Why route i exists**: `observer` tracks every reactive value read during render. Once the page reads `form.values.items`, it subscribes to every field. A manual effect moves that subscription out of render and states it explicitly: which paths to watch, and what to update.

**If you just want fewer renders**: prefer route ii. Push `observer` down to the small component that actually uses the data. Least code, most idiomatic Formily.

**Use route i (effect) when**:

- A legacy page is wrapped in one big `observer` you can't split yet; move the derived data out first
- Changes are frequent and need throttling, debouncing, or batching
- A change triggers side effects: a request, linked fields, or writing the total back to the form (`form.setValuesIn('total', ...)`), none of which belong in render
- You want derived logic decoupled from UI, maintained in the form model layer

**Note**: register the effect with a unique id and call `form.removeEffects(id)` on unmount, or you'll stack duplicate listeners.

[Open full screen](/demos/formily-rerender/)

{{< demo-embed src="/demos/formily-rerender/" height="900" >}}
