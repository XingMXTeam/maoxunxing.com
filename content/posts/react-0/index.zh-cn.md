---
title: "React解决什么问题"
description: "Why React ?"
date: 2024-07-15
tags:
  - React
images:
  - react-1/a.png
---

{{< table_of_contents >}}

## 设计理念

React 的目标是创建快速响应的 web 架构。而需要快速响应面临两个问题:

1 减少 IO 延迟：无法避免 IO 延迟，只能通过 UI 交互提供更好的体感。

比如时间超出一个范围再显示 Loading 18 版本通过用 Suspense useDeferedValue 实现

2 CPU 瓶颈： 交互过程中，用户有时候会抱怨卡？ 因为浏览器刷新频率是 60Hz，也就是每 16.6ms 浏览器刷新一次，这期间需要执行任务： js 脚本+（js 线程） 样式布局+样式绘制（GUI 渲染线程）才能渲染出用户需要的内容，当 js 脚本执行时间太长，导致渲染没时间（_掉帧_），页面表现就是卡顿。还有一种卡顿是说用户在操作的过程中，重新渲染耗时非常长，占据了主进程，无法响应用户的行为，本质也是渲染任务没有完成。

> 掉帧一般是指由于硬件不足以负荷游戏能够流畅运行的画面刷新频率（60fps 以下），从而帧率过低所造成的画面出现卡顿停滞（或短时间或长时间）现象。 掉帧在游戏中就是玩游戏过程中，出现卡这种情况，图像未及时刷新造成，画面粘滞。

18 版本会将 js 执行分到不同的任务中执行，也就是*时间切片*，将同步的更新变为可中断的异步更新，也就是说 16.6ms 能把渲染任务完成。React 中称之为 Fiber 架构，小任务完成后立即去执行高优先级的任务（比如用户点击、动画等的渲染），保证了渲染的帧率。

## 架构

{{< img src="arch.png" alt="arch" maxWidth="220px" >}}

React 架构是包含三个部分：
1 调度器：管理任务优先级
2 协调器：找出变化的部分
3 渲染器：负责渲染

## 原理

我们先从渲染器说起，其他部分主要是辅助，渲染函数是将 jsx 转为 dom 节点通过原生 dom api 进行渲染。 JSX 是什么？jsx 是一种描述当前组件内容的数据结构，在 react 中，babel 编译 jsx 格式为 dsl 对象后，底层通过 React.createElement 的方法调用创建属性类型$$type 是 Element 的对象。 而 react component 是一个另一个对象，通过 ClassComponent.prototype.isReactComponent 判断。Fiber 节点是虚拟 DOM 节点，也是一个对象。

> Fiber 节点： packages/react-reconciler/src/ReactInternalTypes.js

我们上面设计原理讲了 React 引入了 Fiber 架构，我们将 jsx 转为 dom 节点渲染时，如果 jsx 节点非常多，这个过程会非常长（导致卡顿），所以需要利用 fiber 架构，拆分渲染任务。 Fiber 架构其实就是一颗树，每个节点作为一个单独的工作单元。

## 框架设计

功能集:  

- 约定式路由
- API路由
- SSR+SSG
- 通过编译时的临时文件扩展框架能力
- 插件和扩展机制

Remix: loader + action的数据加载机制  ; Fresh: OJS + deno + 真bundless

- 基于路由的声明式数据获取: 除了useEffect, swr, react-query等社区方案，如果要追求极致的请求速度，只有运行时库不够，还需要和框架结合（路由和编译态结合），才能尽快发起，并行执行（还有缓存）。

Remix: export loader方法  
Umi: export  clientLoader  
Qwik: export onGet方法  
Fresh： export 包含Get方法的handler对象  
Solid Start: export routeData  
