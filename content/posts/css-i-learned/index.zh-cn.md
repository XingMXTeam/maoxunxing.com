---
title: "[WIP] CSS编写准则"
date: 2021-12-23T20:03:38+08:00
description: ""
tags:
  - 技术课系列
  - CSS
images:
  - css-i-learned/test.jpg
---

> [原文点此](https://w3cplus.medium.com/%E9%98%B2%E5%BE%A1%E5%BC%8F-css-%E7%B2%精%E8%AE%B2-2d45a58dcbf1)  
本文是一篇非常优秀的文章，内容涵盖了防御式 CSS 的核心原则和实践技巧。以下是整理后的网络备份，并添加了一些补充说明和个人经验。

---

## 一、布局

### 1. 布局原则
- **避免使用 `wrapper` DOM 结构**：减少不必要的嵌套。
- **避免表格思维**：不要引入多余的行/列元素。
- **禁止使用 JavaScript 控制布局**：所有布局和对齐应通过 **Flexbox/Grids** 实现，避免使用以下属性：
  - `absolute`
  - `display: table`
  - `float`
  - `height/line-height`
  - `display: inline-block` 和 `vertical-align: middle`（不可靠）

---

## 二、滚动条问题

### 1. 滚动行为控制
```css
/* Chrome 63+ / Firefox 59+ 支持，Safari 和 Edge 不支持 */
overflow-behavior: contain;
```

### 2. 避免同时出现水平和垂直滚动
```css
overflow-x: auto;
overflow-y: hidden;
```

---

## 三、折行与溢出

### 1. 折行处理
```css
overflow-wrap: break-word; /* 自动换行 */
hyphens: auto; /* 自动断字 */
/* 限制行数 */
-webkit-line-clamp: 3;
```

### 2. 不折行的场景
适用于标题、列头、按钮等需要单行显示的内容：
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

/* 在 Flexbox 容器中可能会溢出？解决方法： */
min-width: 0; /* 配合 flex: 1 使用 */
```

### 3. 对比 `width: max-content`
```css
width: max-content; /* 可能导致容器宽度超出预期 */
```

---

## 四、防止内容显示不全/被截断

### 1. 图标和图片的适配
- **图标支持缩放**：确保图标在不同分辨率下清晰可见。
- **图片限制尺寸**：
  ```css
  max-width: 100%;
  max-height: 100%;
  min(100px, 100%);
  ```

### 2. 避免容器定义 `overflow: hidden`
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

/* 处理 inline 元素 */
display: block;
```

---

## 五、避免定宽/定高

### 1. 使用 `min-width` 和 `min-height`
定宽高可能导致内容溢出，建议使用 `min-width` 和 `min-height` 替代：
```css
min-width: 200px;
min-height: 100px;
```

### 2. 对齐方式
使用 **Flexbox** 进行对齐，避免传统布局方式。

---

## 六、避免侵入性样式

### 1. 样式模块化
- **变量模块化**：通过 CSS 变量管理全局样式。
- **z-index 规范**：
  - 小范围：`1-9`
  - 中范围：`10-99`
- **避免使用内联样式和 `!important`**。

---

## 七、避免 CSS 代码误改、漏改

### 1. 选择器拆分
将复杂选择器拆分为多个简单选择器，便于维护。

### 2. 分模块编写样式
- 按功能模块划分样式文件。
- 将 `@media` 查询与模块样式放在一起。

### 3. 微调样式具体化
微调样式时尽量写得具体，避免影响其他模块。

---

## 八、防止内容被遮挡

### 1. 负边距问题
负边距可能导致内容被遮挡，需谨慎使用：
```css
position: relative;
margin: -10px;
```

---

## 九、防止内容过度拥挤

### 1. 设置 `margin`
确保每个元素都有适当的间距，避免内容过于拥挤：
```css
margin: 10px;
```

---

## 十、点击区域太小

### 1. 伪元素扩展点击区域
通过伪元素增加点击区域：
```css
button {
  position: relative;
}
button::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
}
```

---

## 十一、防止图片变形

### 1. 图片适配
```css
object-fit: cover; /* 保持图片比例并裁剪多余部分 */
```

### 2. Flexbox 默认拉伸问题
在 Flexbox 布局中，图片可能被自动拉伸，可通过以下设置修复：
```css
align-items: center; /* 或者 stretch */
```

---

## 十二、防止图片加载失败

### 1. 占位样式
为图片加载失败时提供占位样式：
```css
background: #eee;
box-shadow: inset 0 0 0 1px #aaa;
```

---

## 十三、防止 CSS 变量未被引入

### 1. 提供默认值
确保 CSS 变量未定义时有默认值：
```css
font-size: var(--default-size, 12px);
```

---

## 十四、Flexbox 默认行为

### 1. 常用设置
```css
flex-wrap: wrap; /* 自动换行 */
justify-content: space-between; /* 子元素均匀分布 */
align-items: center; /* 垂直居中 */
gap: 4px; /* 子元素间距 */
```

### 2. 注意事项
- **子节点没有宽度时，默认是 `max-content`**。
- **`flex-basis: 0` 忽略实际宽度**。
- **默认不换行**。
- **子节点默认等高**：`align-items: stretch`。
- **子节点不折叠 `margin`**。

### 3. 空间分配
- `space-evenly`：子元素之间的宽度总是一致的。
- `space-around`：只有中间的子元素的间距是一致的。

---

## 十五、Grid 布局

### 1. 常用设置
```css
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
grid-gap: 8px;
```

### 2. 注意事项
- **不会自动折行**：需要结合 `@media` 查询实现响应式布局。
- **兼容性**：PC 场景无问题，移动端兼容性有待确认。

---

## 十六、浏览器最小字体限制

不同浏览器对最小字体的支持不同：
- **UC 浏览器**：`8px`
- **Chrome（PC）**：`12px`
- **Safari/Firefox/Chrome（移动端）**：`1px`