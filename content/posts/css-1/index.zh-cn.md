---
title: "CSS 动画：滚动与翻转"
description: "animation，animation-play-state，:checked，transform的使用"
date: 2024-09-10
tags:
  - CSS
images:
  - css-1/a.png
---

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

---

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

---

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

---

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
