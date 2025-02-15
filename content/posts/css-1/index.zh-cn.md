---
title: "实现播放暂停效果"
description: "animation，animation-play-state，:checked，transform的使用"
date: 2024-09-10
tags:
  - CSS
images:
  - css-1/a.png
---

{{< table_of_contents >}}

## 代码

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
    <input type="checkbox" id="toggleAnimation" />
    <label for="toggleAnimation">Pause/Play</label>

    <div class="scroll-container">
      <div class="scroll-content">This is a scrolling text!</div>
    </div>
  </body>
</html>

```

```css
.scroll-container {
  width: 100%;
  height: 50px;
  overflow: hidden;
  background-color: lightgray;
  position: relative;
}

.scroll-content {
  white-space: nowrap;
  position: absolute;
  animation: scroll-animation 10s linear infinite;
  animation-play-state: running;
}

/* 滚动动画 */
@keyframes scroll-animation {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Use the :checked selector to toggle play/pause */
input[type="checkbox"]:checked ~ .scroll-container .scroll-content {
  animation-play-state: paused;
}

```

## 翻转动画

```css
@keyframes roll {
  0% {
    transform: translateX(-0px)
  }

  100% {
    /* 200宽的容器 翻转100次 */
    transform: translateX(cal(100 * -200px)) 
  }

}
```

