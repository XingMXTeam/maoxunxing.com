---
title: "全站https和http2.0升级"
date: 2019-11-25
tags:
  - HTTPS
  - Security
  - Web Development
---

## 百度认证

搜索结果直接跳转到https站点，需要通过百度认证。
百度认证的时候只会爬不需要登录的页面

## 问题记录

1. 后端做redirect的时候https 转为http。
2. 当页面请求为https时，如果其中的图片请求为http时，在ie8版本以下无法正常访问。
3. 前端localstorage 不能跨http和https使用。全站顶部搜索历史记录http和https下不能同步。
4.

## 图片

http访问htttps 可以的
https访问http 浏览器会提示不安全。 IE8下面，图片都会挂掉
iframe里面的http图片会有影响吗

## js

https访问http 会block
