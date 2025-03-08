---
title: "网格布局实现响应式商品卡片"
description: "grid, grid-template-columns, grid-template-rows等属性的使用"
date: 2024-09-13
tags:
  - CSS
  - Web开发
images:
  - css-2/a.png
---

## 1. HTML 结构

以下代码展示了一个简单的商业卡片布局，包含产品标题、描述、价格和购买按钮。

```html
<div class="card-content">
  <h2>Product Title</h2>
  <p>
    Description of the product goes here. It highlights the key features
    and benefits.
  </p>
  <span class="price">$49.99</span>
  <button class="buy-button">Buy Now</button>
</div>
```

---

## 2. CSS 样式

以下代码使用了 **CSS Grid** 布局来定义卡片的结构和样式。

```css
.business-card {
  display: grid;
  grid-template-columns: 200px 1fr; /* 定义两列：第一列固定宽度 200px，第二列占据剩余空间 */
  grid-template-rows: 50px 200px 1fr; /* 定义三行：第一行高度 50px，第二行高度 200px，第三行占据剩余空间 */
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(185, 156, 156, 0.1); /* 添加阴影效果 */
  max-width: 800px; /* 卡片最大宽度 */
  width: 100%; /* 卡片宽度自适应 */
}

.card-image {
  grid-row-start: 1; /* 图片从第一行开始 */
  grid-row-end: 2;   /* 图片到第二行结束 */
}
```

---

## 3. 说明

### 关键概念解释

1. **`1fr` 的含义**:
   - `1fr` 表示在网格布局中，每一列或每一行的大小是相等的，并且大小是相对于容器的总大小来分配的。
   - 例如，`grid-template-columns: 200px 1fr` 表示第一列固定宽度为 200px，第二列占据剩余的所有空间。

2. **`grid-template-columns`**:
   - 定义网格布局中的列数和每列的宽度。
   - 示例：
     ```css
     grid-template-columns: 200px 1fr;
     ```
     上述代码表示：
     - 第一列宽度为 200px。
     - 第二列占据剩余的空间。

3. **`grid-template-rows`**:
   - 定义网格布局中的行数和每行的高度。
   - 示例：
     ```css
     grid-template-rows: 50px 200px 1fr;
     ```
     上述代码表示：
     - 第一行高度为 50px。
     - 第二行高度为 200px。
     - 第三行占据剩余的空间。

4. **`grid-row-start` 和 `grid-row-end`**:
   - 用于指定某个元素在网格布局中的起始行和结束行。
   - 示例：
     ```css
     grid-row-start: 1;
     grid-row-end: 2;
     ```
     上述代码表示该元素从第一行开始，到第二行结束。

---

### 应用场景

- **商业卡片**: 适用于电商网站的产品展示、博客文章卡片等场景。
- **响应式设计**: 使用 `grid-template-columns` 和 `grid-template-rows` 可以轻松实现响应式布局，适配不同屏幕尺寸。
- **图片与内容分离**: 通过 `grid-row-start` 和 `grid-row-end`，可以灵活控制图片和其他内容的布局位置。

