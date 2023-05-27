---
title: "CSS编写原则"
date: 2021-12-23T20:03:38+08:00
description: "以下是我积累的基本CSS编写原则，希望对你有帮助"
draft: true
tags:
  - 技术课系列
  - CSS
images:
  - css-i-learned/test.jpg
---

### 布局

- 不要用 wrapper 这样的 dom 结构，
- 避免表格思维，有多余的行/列元素
- 不用 javascript 控制布局，所有布局和对齐都用 Flexbox/Grids 实现，不用 absolute, display:table, float, height/line-height，display: inline-block/vertical-align: middle 不可靠

### 滚动条问题

```css
/* chrome63+ firefox 59+ / safari edge not support */
overflow-behaviour: contain;
```

避免同时出现水平和垂直滚动：

```css
overflow-x: auto;
overflow-x: hidden;
```

### 折行

```css
overfloww-wrap: break-word;
hyphens: auto;
/* 限制行数 */
-webkit-line-clamp: 3;
```

不折行： 标题 列头 按钮

```css
overflow: hidden;
text-overflow: ellipsis;
/* th   */
white-space: nowrap;
```

以上在 flexbox 容器还是会溢出？ min-width: 0(配合 flex: 1 使用)

vs:

```css
width: max-content;
```

### 防止内容显示不全/被截断

防止内容溢出

- 图标支持 resize
- 图片限制 max-width max-height min(100px, 100%)
- 不要在容器元素定义 overflow: hidden

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
/* 处理inline元素 */
display: block;
```

### 避免定宽/定高，用 min-width/min-height 替代

定宽高会出现内容溢出，对齐用 Flex-box

### 避免侵入性样式

- 变量模块化
- z-index: 1-9 10~99
- 不要用 style，!important

### 避免 css 代码的误改、漏改

- 选择器拆开写
- 分模块写样式；@media 和模块放一起
- 微调样式 要写具体

### 防止内容被遮挡

- position: relative margin: 为负 导致

### 防止内容过度拥挤

- margin: 必须设置

### 点击区域太小

伪元素处理

### 防止图片变形

```css
object-fit: cover;
```

- flex-box 布局时， 图片会被自动拉伸（align-items: stretch 默认）

### 防止图片加载失败

```css
background: #eee;
box-shadow: inset 0 0 0 1px #aaa;
```

### 防止 css 变量未被引入

```css
font-size: var(--default-size, 12px);
```

### flex 默认属性

flex-box\*(Flex Formatting Context)：对齐 通用需要以下设置

```css
flex-wrap: wrap;
justify-content: space-between;
align-items: center;
/* 子元素： 兼容性考虑用margin */
gap: 4px;
```

- 不指定固定宽高 或者百分比。 flex-box 计算能精确到浮点数
- min-width: max-content 禁止内容换行
- 分配空间： space-evenly(子元素之间的宽度总是一致的) space-around(只有中间的子元素的间距是一致的)
- 对齐： 不再用 float/display: table

**默认行为：**

- 子节点没有宽度时，默认是 max-content(也就是默认收缩); flex-basics: 0 忽略其实际宽度
- flex 默认不换行
- 如果有具体高度子节点，默认等高：align-items: stretch
- 子节点不折叠 margin

### Grid：布局 兼容性： PC 场景没啥问题 mobile 兼容有待确认

- 不要固定宽度 minmax(最小值，1fr)
- grid-gap: 8px
- 不会自动折行。需要结合 media 查询

### 不同浏览器支持的最小字体不一样

- uc: 8px
- chrome(pc): 12px
- safari,firefox,chrome: 1px
