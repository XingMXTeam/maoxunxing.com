---
title: "Maximum update depth exceeded. "
date: 2022-07-15T17:39:23+08:00
---

Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

一个 react 组件内嵌了其他 react 组件，其他 react 组件在 useEffect 里面调用了 setState 或者 field.setValue 等其他更新状态的操作，导致其他组件循环更新。

解决办法：

将其他组件移出去，单独文件定义
