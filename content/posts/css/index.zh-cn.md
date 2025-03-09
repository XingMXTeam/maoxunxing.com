---
title: "CSS 你需要知道的"
description: "网格布局；动画：animation，animation-play-state，:checked，transform的使用；CSS编写准则、案例"
date: 2024-09-10
tags:
  - CSS
  - Web开发
images:
  - css/a.png
custom_toc:
  - title: "CSS 动画：滚动与翻转"
  - title: "网格布局"
  - title: "更平滑的阴影"
  - title: "CSS 案例"
  - title: "CSS 编写准则"
  - title: "CSS 资料"
---

## CSS 动画：滚动与翻转

## 1. 滚动动画（带暂停功能）

### HTML 结构
以下代码实现了一个带有暂停/播放功能的滚动文本效果。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Animation Scroll with Pause</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <!-- 复选框用于控制动画暂停/播放 -->
    <input type="checkbox" id="toggleAnimation" />
    <label for="toggleAnimation">Pause/Play</label>

    <!-- 滚动容器 -->
    <div class="scroll-container">
      <div class="scroll-content">This is a scrolling text!</div>
    </div>
  </body>
</html>
```

### CSS 样式

```css
/* 滚动容器样式 */
.scroll-container {
  width: 100%;
  height: 50px;
  overflow: hidden; /* 隐藏超出部分 */
  background-color: lightgray;
  position: relative;
}

/* 滚动内容样式 */
.scroll-content {
  white-space: nowrap; /* 禁止换行 */
  position: absolute;
  animation: scroll-animation 10s linear infinite; /* 定义滚动动画 */
  animation-play-state: running; /* 默认动画运行 */
}

/* 滚动动画 */
@keyframes scroll-animation {
  0% {
    transform: translateX(100%); /* 从右侧进入 */
  }
  100% {
    transform: translateX(-100%); /* 从左侧移出 */
  }
}

/* 使用 :checked 选择器控制动画暂停/播放 */
input[type="checkbox"]:checked ~ .scroll-container .scroll-content {
  animation-play-state: paused; /* 停止动画 */
}
```

## 2. 翻转动画

以下代码实现了一个简单的翻转动画，适用于需要重复移动的场景。

```css
@keyframes roll {
  0% {
    transform: translateX(-0px); /* 初始位置 */
  }
  100% {
    /* 200px 宽的容器，翻转 100 次 */
    transform: translateX(calc(100 * -200px)); /* 最终位置 */
  }
}
```

### 补充说明

1. **滚动动画**:
   - `animation-play-state` 属性用于控制动画的运行状态（`running` 或 `paused`）。
   - 通过复选框的 `:checked` 伪类实现动画的暂停和播放切换。

2. **翻转动画**:
   - 使用 `calc()` 函数动态计算位移距离。
   - 可根据实际需求调整容器宽度和翻转次数。

3. **应用场景**:
   - 滚动动画适用于公告栏、跑马灯等场景。
   - 翻转动画适合需要循环移动的元素，例如轮播图或背景动画。

---

## 网格布局

一个简单的商业卡片布局，包含产品标题、描述、价格和购买按钮。

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

用 **CSS Grid** 布局来定义卡片的结构和样式。

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

### 应用场景

- **商业卡片**: 适用于电商网站的产品展示、博客文章卡片等场景。
- **响应式设计**: 使用 `grid-template-columns` 和 `grid-template-rows` 可以轻松实现响应式布局，适配不同屏幕尺寸。
- **图片与内容分离**: 通过 `grid-row-start` 和 `grid-row-end`，可以灵活控制图片和其他内容的布局位置。

---

## 更平滑的阴影

{{< img src="effect.png" alt="商业卡片阴影效果" maxWidth="140px" caption="商业卡片阴影效果" >}}

两个商业卡片的布局，分别应用了不同的阴影效果。

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

两种不同的阴影效果，分别应用于两个商业卡片。

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

### 应用场景

- **基础阴影**: 适用于简单的卡片或按钮设计，提供基本的立体感。
- **分层阴影**: 适用于需要更高视觉质量的设计，例如高端产品展示、UI 组件等。
- **响应式设计**: 可根据屏幕尺寸动态调整阴影效果，提升用户体验。

---

## CSS 案例

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

## CSS 选择器

### `nth-child` 的高级用法
使用 `nth-child(n of selector)` 选择特定类别的子元素：
```css
article:nth-child(2 of .bar) {
  color: red;
}
```
**案例**: 高亮第二个 `.bar` 元素。

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

## import css

`import styles  from "./index.module.css"`需要在`js import`之后，如果在中间，可能会导致CSS构建产物的 类名 优先级 不一样。

---

## CSS 编写准则


> [原文点此](https://w3cplus.medium.com/%E9%98%B2%E5%BE%A1%E5%BC%8F-css-%E7%B2%精%E8%AE%B2-2d45a58dcbf1)  
本文是一篇非常优秀的文章，内容涵盖了防御式 CSS 的核心原则和实践技巧。以下是整理后的网络备份，并添加了一些补充说明和个人经验。

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

## 五、避免定宽/定高

### 1. 使用 `min-width` 和 `min-height`
定宽高可能导致内容溢出，建议使用 `min-width` 和 `min-height` 替代：
```css
min-width: 200px;
min-height: 100px;
```

### 2. 对齐方式
使用 **Flexbox** 进行对齐，避免传统布局方式。

## 六、避免侵入性样式

### 1. 样式模块化
- **变量模块化**：通过 CSS 变量管理全局样式。
- **z-index 规范**：
  - 小范围：`1-9`
  - 中范围：`10-99`
- **避免使用内联样式和 `!important`**。

## 七、避免 CSS 代码误改、漏改

### 1. 选择器拆分
将复杂选择器拆分为多个简单选择器，便于维护。

### 2. 分模块编写样式
- 按功能模块划分样式文件。
- 将 `@media` 查询与模块样式放在一起。

### 3. 微调样式具体化
微调样式时尽量写得具体，避免影响其他模块。

## 八、防止内容被遮挡

### 1. 负边距问题
负边距可能导致内容被遮挡，需谨慎使用：
```css
position: relative;
margin: -10px;
```

## 九、防止内容过度拥挤

### 1. 设置 `margin`
确保每个元素都有适当的间距，避免内容过于拥挤：
```css
margin: 10px;
```

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

## 十二、防止图片加载失败

### 1. 占位样式
为图片加载失败时提供占位样式：
```css
background: #eee;
box-shadow: inset 0 0 0 1px #aaa;
```

## 十三、防止 CSS 变量未被引入

### 1. 提供默认值
确保 CSS 变量未定义时有默认值：
```css
font-size: var(--default-size, 12px);
```

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

## 十五、Grid 布局

### 1. 常用设置
```css
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
grid-gap: 8px;
```

### 2. 注意事项
- **不会自动折行**：需要结合 `@media` 查询实现响应式布局。
- **兼容性**：PC 场景无问题，移动端兼容性有待确认。

## 十六、浏览器最小字体限制

不同浏览器对最小字体的支持不同：
- **UC 浏览器**：`8px`
- **Chrome（PC）**：`12px`
- **Safari/Firefox/Chrome（移动端）**：`1px`

---

## CSS 资料
https://www.w3.org/People/xiaoqian/talks/bytedance-2021/Overview.html
https://2024.stateofcss.com/en-US/
https://www.w3.org/Style/CSS/read
https://www.w3.org/TR/css-2020/
https://www.w3.org/Style/CSS/
https://linxz.github.io/blog/defensive-css

