---
title: "React Field 字段值丢失问题总结"
date: 2025-08-13
description: ""
draft: true
---

# React Field 字段值丢失问题总结

## 问题描述

在使用 React 表单库（@alife/next）的 Field 组件时，当表单字段通过条件渲染（`{condition ? <Component /> : null}`）被隐藏时，Field 会自动清理这些字段的值，导致切换类型时数据丢失。

### 具体表现
- 第一次切换类型时，Field 的 `onChange` 回调包含完整的表单数据
- 第二次切换类型时，之前被隐藏的字段值丢失，只保留当前可见字段的值

### 问题原因
1. **Field 字段注册机制**：Field 只管理当前在 DOM 中存在的表单字段
2. **条件渲染影响**：当字段通过条件渲染被隐藏时，Field 认为这些字段不存在，自动清理其值
3. **响应式更新**：Field 的 `getValues()` 方法只返回当前注册的字段值

## 解决方案

### 核心思路
将条件渲染改为始终渲染 + CSS 隐藏，保持所有字段在 DOM 中，避免 Field 清理字段值。

### 具体实现

#### 1. 修改渲染逻辑
```javascript
// 之前：条件渲染
{currentType === DINAMICX ? (
    <Form.Item name="code">...</Form.Item>
) : null}

// 现在：始终渲染 + CSS 控制
<div className={showDxFields ? '' : 'hidden-field'}>
    <Form.Item name="code">...</Form.Item>
</div>
```

#### 2. 添加显示状态计算
```javascript
const showDxFields = currentType === DINAMICX || currentType === NATIVEJS
const showNativeField = currentType === NATIVE
// ... 其他类型
```

#### 3. 添加 CSS 样式
```scss
.hidden-field {
    display: none !important;
}
```

## 优势

1. **数据完整性**：切换类型时所有字段值都被保留
2. **用户体验**：用户切换回之前的类型时，之前填写的内容还在
3. **代码简洁**：逻辑清晰，易于维护
4. **性能友好**：只是 CSS 隐藏，不涉及 DOM 重建

## 适用场景

- 表单中有多个互斥的字段组
- 需要根据用户选择动态显示/隐藏字段
- 要求保持用户输入数据的完整性

这种方案是处理 React 表单字段值保持的标准做法，既解决了技术问题，又提升了用户体验。