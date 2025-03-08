---
title: "非法的 Hooks 调用导致按钮无反应"
date: 2025-02-24
tag:
  - React
---

## 目录

1. [问题背景](#问题背景)
2. [问题描述](#问题描述)
3. [问题分析](#问题分析)
4. [解决方案](#解决方案)
   - [4.1 开发阶段通过 ESLint 提示错误](#41-开发阶段通过-eslint-提示错误)
   - [4.2 线上监控非法 Hooks 调用](#42-线上监控非法-hooks-调用)
   - [4.3 处理独立 DOM 树中的错误](#43-处理独立-dom-树中的错误)
   - [4.4 安全封装回调函数](#44-安全封装回调函数)
5. [总结与建议](#总结与建议)

---

## 问题背景

在 React 项目中，Hooks 的使用需要遵循一定的规则（如只能在函数组件或自定义 Hook 中调用）。如果违反这些规则，可能会导致运行时错误或意外行为。

---

## 问题描述

在以下代码中，`Dialog.confirm` 的 `onOk` 回调函数中直接调用了 Hook：

```javascript
Dialog.confirm({
  title: '请确认',
  content: '确定批量删除吗？',
  style: { width: 400 },
  onOk: () => {
    const useProfitPouchGray = useInitGrayManage((s: any) => s.useProfitPouchGray());
  }
});
```

这种非法的 Hooks 调用会导致以下问题：

1. **按钮无反应**：由于 Hooks 调用违反了规则，React 抛出错误，导致回调函数无法正常执行。
2. **ErrorBoundary 无法捕获错误**：`componentDidCatch` 生命周期函数无法捕获到这类错误，因为它们发生在渲染阶段之外。
3. **独立 DOM 树中的错误无法被捕获**：`Dialog.confirm` 使用了独立的 DOM 树（通过 `ReactDOM.createPortal` 实现），因此根组件中的 `ErrorBoundary` 对其无效。
4. **`onOk` 回调中的错误无法被捕获**：`onOk` 是普通函数，其错误不会被 React 的错误边界捕获。

---

## 问题分析

根据 React 官方文档，Hooks 的使用必须遵循以下规则：

1. **只在顶层调用 Hooks**：不能在条件语句、循环或嵌套函数中调用 Hooks。
2. **只在函数组件或自定义 Hook 中调用 Hooks**：不能在普通函数或类组件中调用 Hooks。

上述代码的问题在于，`useInitGrayManage` 是一个 Hook，但被直接调用在 `onOk` 回调函数中。这违反了第二条规则，导致 React 抛出运行时错误。

此外：
- `ErrorBoundary` 只能捕获主 React DOM 树中的渲染错误。
- `onOk` 是普通函数，其错误不会被 `ErrorBoundary` 或 React 的任何内置机制捕获。

---

## 解决方案

### 4.1 开发阶段通过 ESLint 提示错误

为了在开发阶段及时发现非法的 Hooks 调用，可以配置 ESLint 规则来强制检查 Hooks 的使用是否符合规范。

以下是 `.eslintrc.js` 的配置示例：

```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint-config-ali/typescript/react',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended', // 推荐的 React Hooks 规则
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'react-hooks'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hooks 使用是否符合规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 useEffect 等依赖项是否完整
  },
};
```

#### 关键规则说明：
- **`react-hooks/rules-of-hooks`**：用于检测 Hooks 是否在合法的上下文中调用。如果发现非法调用，ESLint 会在开发阶段报错。
- **`react-hooks/exhaustive-deps`**：确保 `useEffect` 等 Hook 的依赖数组完整，避免潜在的副作用问题。

通过以上配置，可以在开发阶段及时发现并修复非法的 Hooks 调用问题。

---

### 4.2 线上监控非法 Hooks 调用

尽管开发阶段可以通过 ESLint 捕获大部分问题，但仍需在线上环境中对非法 Hooks 调用进行监控，以防止未被捕获的错误影响用户体验。

#### 实现方式：
1. **全局错误捕获**：
   在应用入口文件中添加全局错误监听器，捕获未处理的异常：

   ```javascript
   window.addEventListener('error', (event) => {
     console.error('捕获到全局错误:', event.message);
     // 上报错误到监控系统
   });

   window.addEventListener('unhandledrejection', (event) => {
     console.error('捕获到未处理的 Promise 错误:', event.reason);
     // 上报错误到监控系统
   });
   ```

2. **日志上报工具**：
   使用第三方日志上报工具（如 Sentry、Bugsnag）记录和分析线上错误。这些工具可以帮助快速定位问题并提供详细的错误堆栈信息。

---

### 4.3 处理独立 DOM 树中的错误

对于 `Dialog.confirm` 使用的独立 DOM 树（通过 `ReactDOM.createPortal` 实现），可以为其内容部分封装局部的 `ErrorBoundary`。例如：

```javascript
class LocalErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.error('LocalErrorBoundary 捕获到错误:', error, info);
    // 上报错误到监控系统
  }

  render() {
    if (this.state.hasError) {
      return <div>发生错误，请刷新页面或联系管理员。</div>;
    }
    return this.props.children;
  }
}

function SafeDialogConfirm(options) {
  return Dialog.confirm({
    ...options,
    content: (
      <LocalErrorBoundary>
        {options.content}
      </LocalErrorBoundary>
    ),
  });
}
```

这种方式可以捕获 `content` 渲染部分的错误，但无法捕获 `onOk` 回调中的错误。

---

### 4.4 安全封装回调函数

为了捕获 `onOk` 回调中的错误，可以对回调函数进行安全封装。例如：

```javascript
function safeCallback(callback) {
  return (...args) => {
    try {
      return callback(...args);
    } catch (error) {
      console.error('捕获到回调函数中的错误:', error);
      // 上报错误到监控系统
    }
  };
}

const MyComponent = () => {
  const handleConfirm = () => {
    Dialog.confirm({
      title: '请确认',
      content: '确定批量删除吗？',
      style: { width: 400 },
      onOk: safeCallback(() => {
        const useProfitPouchGray = useInitGrayManage((s: any) => s.useProfitPouchGray());
      }),
    });
  };

  return <button onClick={handleConfirm}>打开对话框</button>;
};
```

#### 关键点：
- **`safeCallback`**：封装回调函数，捕获其中的错误并进行处理。
- **错误上报**：将捕获到的错误上报到日志系统，便于后续分析。
