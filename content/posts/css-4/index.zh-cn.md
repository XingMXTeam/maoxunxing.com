---
title: "CSS案例整理"
date: 2024-09-13
tags:
  - CSS
images:
  - css-2/a.png
---

本文档整理了前端CSS开发中的常见技术点及其实现案例，涵盖布局、样式控制、响应式设计、图片优化等内容，旨在为开发者提供全面的参考。

---

## 目录

1. [CSS 定位与布局](#css-定位与布局)
   - `position: fixed` 的特殊行为
   - Flex 布局与等宽问题
   - Slider 布局技巧
2. [响应式设计](#响应式设计)
   - 图片正方形自适应
   - 文本换行与不换行
3. [图片与背景优化](#图片与背景优化)
   - 图片压缩与适配
   - 背景图设置技巧
4. [Flexbox 与 Grid](#flexbox-与-grid)
   - 等宽子元素处理
   - 滑动容器间距调整
5. [文本与溢出](#文本与溢出)
   - 文本省略号
   - 字体对齐与行高
6. [CSS 选择器](#css-选择器)
   - `nth-child` 的高级用法
7. [其他技巧](#其他技巧)
   - Chrome 兼容性问题
   - React-Slick 使用指南

---

## CSS 定位与布局

### `position: fixed` 的特殊行为
当父元素使用了 `transform` 属性时，`position: fixed` 的元素会相对于父元素定位，而不是视口。
```css
.parent {
  transform: translate(0, 0);
}
.child {
  position: fixed;
  top: 0;
}
```

### Flex 布局与等宽问题
在 Flex 布局中，若子元素内容超出导致无法等宽，可通过以下方式解决：
```css
.child {
  flex-grow: 1;
  flex-basis: 0; /* 或者设置百分比 */
}
.parent {
  flex-wrap: wrap; /* 子元素过多时自动换行 */
}
```
**案例**: 自适应卡片布局中保持等宽。

### Slider 布局技巧
为了确保滑动列表左右顶到边，避免 `margin` 影响计算：
```css
.slider-list {
  margin: 0 -8px;
}
.slick-slider {
  margin: 0; /* 不要额外设置 margin */
}
```
**案例**: 如何让 Slider 左右顶到边（如宽度 1616，每个卡片间距 16px）。

---

## 响应式设计

### 图片正方形自适应
通过 `padding-bottom` 和绝对定位实现正方形容器：
```css
.container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 正方形 */
}
.image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```
**案例**: 卡片图在宽度自适应的情况下，如何保证始终是一个正方形。

### 文本换行与不换行
使用 `white-space: nowrap` 防止文本换行：
```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
**案例**: 响应式下卡片是 Flex 布局，屏幕小时文本换行问题。

---

## 图片与背景优化

### 图片压缩与适配
CDN 图片压缩时，优先考虑显示效果而非设计稿尺寸。例如，商卡图片默认大小为 480x480。

### 背景图设置技巧
- **背景图适配模块高度**:
  ```css
  .module {
    background-color: rgb(255, 248, 220);
    background-image: url('image.jpg');
    background-size: auto 100%;
    background-position: center top;
    background-repeat: no-repeat;
  }
  ```
- **响应式背景图**:
  ```css
  .responsive-bg {
    background-size: 100% auto; /* 避免拉伸或压缩 */
  }
  ```

---

## Flexbox 与 Grid

### 等宽子元素处理
通过 `flex-grow` 和 `flex-basis` 实现等宽布局：
```css
.child {
  flex-grow: 1;
  flex-basis: 0;
}
.parent {
  display: flex;
  flex-wrap: wrap;
}
```

### 滑动容器间距调整
避免 `slider` 计算错误：
```css
.slider-list {
  margin: 0 -8px; /* 外部容器设置负边距 */
}
```

---

## 文本与溢出

### 文本省略号
无需设置宽度即可实现文本省略：
```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 字体对齐与行高
- **避免字体被遮挡**:
  ```css
  .text {
    line-height: 1.2;
  }
  ```
- **图片与文字顶部对齐**:
  ```css
  .container {
    display: flex;
    align-items: flex-start;
  }
  ```

---

## CSS 选择器

### `nth-child` 的高级用法
使用 `nth-child(n of selector)` 选择特定类别的子元素：
```css
article:nth-child(2 of .bar) {
  color: red;
}
```
**案例**: 高亮第二个 `.bar` 元素。

---

## 其他技巧

### Chrome 兼容性问题
低版本 Chrome 中 `unset` 不兼容，可能导致样式异常：
```css
.card {
  height: unset; /* 替代方案：height: auto; */
}
```
**案例**: Chrome 旧版本中悬停卡片样式异常。

### React-Slick 使用指南
React-Slick 是一个强大的轮播组件库，支持上下滚动和复杂布局：
```javascript
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true, // 上下滚动
};

<Slider {...settings}>
  <div>Slide 1</div>
  <div>Slide 2</div>
</Slider>;
```
**案例**: 如何实现上下滚动的轮播组件。

## css压缩
https://forgemia.inra.fr/lisc/geopat/-/tree/master/web_application/node_modules/csso

csso webpack plugin Selector can't has classes from different scopes
有一些className没有被归到scopes里面。