---
title: "下载文件如何规避跨域问题"
date: 2021-12-01T14:53:11+08:00
draft: true
---

一般我们的下载功能会通过XHR对象 发送，不可避免的会出现跨域问题。

解决办法：

可以通过修改为http Get请求，前端通过window.open(`downloadLink`)的方式下载
