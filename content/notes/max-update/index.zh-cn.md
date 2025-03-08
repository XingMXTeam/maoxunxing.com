---
title: "Maximum update depth exceeded. "
date: 2022-07-15T17:39:23+08:00
tags:
  - React
---

## **1. 错误描述**

### **错误信息**

```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

### **问题原因**

- 一个 React 组件内嵌了其他 React 组件。
- 其他组件在 `useEffect` 中调用了 `setState` 或 `field.setValue` 等更新状态的操作。
- 导致其他组件进入循环更新状态。

---

## **2. 解决办法**

### **解决方案**

将嵌套的其他组件移出到单独的文件中定义，避免因嵌套导致的状态更新冲突。

---

## **3. 示例说明**

### **问题场景**

```jsx
function ParentComponent() {
  return (
    <div>
      <ChildComponent />
    </div>
  );
}

function ChildComponent() {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(true); // 可能触发父组件或其他组件的重新渲染
  }, []);

  return <div>Child Component</div>;
}
```

### **解决后代码**

将 `ChildComponent` 移动到单独的文件中定义：

**ChildComponent.js**

```jsx
import React, { useState, useEffect } from 'react';

function ChildComponent() {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(true); // 不再影响父组件
  }, []);

  return <div>Child Component</div>;
}

export default ChildComponent;
```

**ParentComponent.js**

```jsx
import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  return (
    <div>
      <ChildComponent />
    </div>
  );
}

export default ParentComponent;
```

---

## **4. 注意事项**

1. **避免循环更新**：
   - 确保 `useEffect` 的依赖项正确设置，避免不必要的状态更新。
   - 避免在 `useEffect` 中直接调用可能触发父组件或子组件重新渲染的操作。

2. **模块化设计**：
   - 将组件拆分为独立的模块，有助于减少组件间的耦合性，提升代码可维护性。

3. **调试工具**：
   - 使用 React DevTools 检查组件的渲染次数和状态变化，定位问题源头。

---
