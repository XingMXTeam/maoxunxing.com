---
title: "更平滑的阴影"
description: "box-shadow分层抬升"
date: 2024-09-14
tags:
  - CSS
images:
  - css-2/a.png
---

## 1. 效果展示

![效果展示](effect.png)
*图：商业卡片阴影效果*

---

## 2. HTML 结构

以下代码展示了两个商业卡片的布局，分别应用了不同的阴影效果。

```html
<!DOCTYPE html>
<html style="height: 100%">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body style="height: 100%; margin: 0">
    <!-- 卡片 1：基础阴影 -->
    <div class="business-card1"></div>

    <!-- 卡片 2：分层阴影 -->
    <div class="business-card2"></div>
  </body>
</html>
```

---

## 3. CSS 样式

以下代码定义了两种不同的阴影效果，分别应用于两个商业卡片。

```css
/* 页面背景颜色 */
body {
  background-color: #f1cffb;
}

/* 卡片 1：基础阴影 */
.business-card1 {
  background-color: white;
  width: 100px;
  height: 100px;
  margin: 20px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  /* 正常使用：x-offset y-offset blur color */
}

/* 卡片 2：分层阴影 */
.business-card2 {
  background-color: white;
  width: 100px;
  height: 100px;
  margin: 20px;
  box-shadow: 
    0 1px 1px rgba(0, 0, 0, 0.03), 
    0 2px 2px rgba(0, 0, 0, 0.03),
    0 4px 4px rgba(0, 0, 0, 0.03), 
    0 8px 8px rgba(0, 0, 0, 0.03),
    0 16px 16px rgba(0, 0, 0, 0.03), 
    0 64px 64px rgba(0, 0, 0, 0.03);
  /* 通过等比数列，调整 y-offset 和 blur，将投影分层，获得更平滑和真实的阴影效果 */
}

/* 离界面越近的元素：模糊值越小，x/y-offset 越小；越远则越大 */
```

---

## 4. 说明

### 关键概念解释

1. **`box-shadow` 属性**:
   - `box-shadow` 用于为元素添加阴影效果。
   - 基本语法：
     ```css
     box-shadow: x-offset y-offset blur spread color;
     ```
     - `x-offset`: 阴影水平偏移量（正值向右，负值向左）。
     - `y-offset`: 阴影垂直偏移量（正值向下，负值向上）。
     - `blur`: 模糊半径（值越大，阴影越模糊）。
     - `spread`: 阴影扩展半径（正值扩大阴影，负值缩小阴影）。
     - `color`: 阴影颜色。

2. **基础阴影 vs 分层阴影**:
   - **基础阴影**: 使用单一的 `box-shadow` 定义，适用于简单的阴影效果。
     ```css
     box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
     ```
   - **分层阴影**: 使用多个 `box-shadow` 定义，通过等比数列调整 `y-offset` 和 `blur`，实现更平滑、更真实的阴影效果。
     ```css
     box-shadow: 
       0 1px 1px rgba(0, 0, 0, 0.03), 
       0 2px 2px rgba(0, 0, 0, 0.03),
       0 4px 4px rgba(0, 0, 0, 0.03), 
       0 8px 8px rgba(0, 0, 0, 0.03),
       0 16px 16px rgba(0, 0, 0, 0.03), 
       0 64px 64px rgba(0, 0, 0, 0.03);
     ```

3. **阴影层次感**:
   - 离界面越近的元素：`blur` 值越小，`x/y-offset` 越小。
   - 离界面越远的元素：`blur` 值越大，`x/y-offset` 越大。

---

### 应用场景

- **基础阴影**: 适用于简单的卡片或按钮设计，提供基本的立体感。
- **分层阴影**: 适用于需要更高视觉质量的设计，例如高端产品展示、UI 组件等。
- **响应式设计**: 可根据屏幕尺寸动态调整阴影效果，提升用户体验。