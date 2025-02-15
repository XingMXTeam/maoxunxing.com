---
title: "网格布局实现响应式商品卡片"
description: "grid, grid-template-columns, grid-template-rows等属性的使用"
date: 2024-09-13
tags:
  - CSS
images:
  - css-2/a.png
---

{{< table_of_contents >}}

## 代码

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

```css
.business-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 50px 200px 1fr;

  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(185, 156, 156, 0.1);
  max-width: 800px;
  width: 100%;
}

.card-image {
  grid-row-start: 1;
  grid-row-end: 2;
}

```


## 说明

1fr 表示在网格布局中，每一列或每一行的大小都是相等的，并且大小是相对于容器的总大小来分配的。

grid-template-columns： 定义列数和列宽度
grid-template-rows: 定义列数和列宽度



