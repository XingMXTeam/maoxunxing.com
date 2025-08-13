---
title: "纯前端图片下载"
date: 2025-08-13
description: ""
draft: true
---

目标服务器没有设置 Content-Disposition: attachment 或浏览器策略导致“未发现文件”，而 canvas 方案是把图片内容转成 blob，再由本地生成的 blob url 触发下载，完全不依赖远端服务器的响应头，所以能正常下载。

```js
   const image = new Image();
      // 解决跨域 canvas污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url + '?time=' + new Date().valueOf(); // 加时间戳
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          // 可自定义下载图片名称
          a.download = '测试图片';
          a.href = url;
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        });
      };
```