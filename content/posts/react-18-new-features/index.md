---
title: "React技术总结"
date: 2021-12-09T14:43:31+08:00
draft: true
description: ""
---

## 理念

1 减少IO延迟： 时间超出一个范围再显示loading
  比如用Suspense useDeferedValue
2 为什么会卡？CPU瓶颈 浏览器刷新频率是60Hz。每16.6m浏览器刷新一次 需要执行任务： js脚本+（js线程） 样式布局+样式绘制（GUI渲染线程） 如果js脚本执行时间太长，导致渲染没时间（*掉帧*），页面卡顿。 
React将js执行分到不同的任务中执行，也就是*时间切片*，将同步的更新变为可中断的异步更新

## 架构

## jsx

本质是React.createElement

jsx和react component的区别：jsx是一个对象，$$type标记是Element; 判断是否是react component： ClassComponent.prototype.isReactComponent

jsx和Fiber节点：jsx是一种描述当前组件内容的数据结构，Fiber节点是为虚拟dom 两个是独立的东西 



## react 18新特性

### Suspense

request library： Relay

### concurrent rendering

1 默认能批量更新； 
2 新API:
  useTransition and startTransition 优先级控制；
  useDeferredValue 渲染旧数据
  <Suspense> 处理loading

