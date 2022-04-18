---
title: "【总结篇】React核心技术总结和版本18最新特性介绍"
date: 2021-12-09T14:43:31+08:00
draft: true
description: ""
---

## 设计理念

React的目标是创建快速响应的web架构。而需要快速响应面临两个问题:

1 减少IO延迟：无法避免IO延迟，只能通过UI交互提供更好的体感。  

比如时间超出一个范围再显示Loading 18版本通过用Suspense useDeferedValue实现 

2 CPU瓶颈： 交互过程中，用户有时候会抱怨卡？ 因为浏览器刷新频率是60Hz，也就是每16.6ms浏览器刷新一次，这期间需要执行任务： js脚本+（js线程） 样式布局+样式绘制（GUI渲染线程）才能渲染出用户需要的内容，当js脚本执行时间太长，导致渲染没时间（*掉帧*），页面表现就是卡顿。还有一种卡顿是说用户在操作的过程中，重新渲染耗时非常长，占据了主进程，无法响应用户的行为，本质也是渲染任务没有完成。

> 掉帧一般是指由于硬件不足以负荷游戏能够流畅运行的画面刷新频率（60fps以下），从而帧率过低所造成的画面出现卡顿停滞（或短时间或长时间）现象。 掉帧在游戏中就是玩游戏过程中，出现卡这种情况，图像未及时刷新造成，画面粘滞。

18版本会将js执行分到不同的任务中执行，也就是*时间切片*，将同步的更新变为可中断的异步更新，也就是说16.6ms能把渲染任务完成。React中称之为Fiber架构，小任务完成后立即去执行高优先级的任务（比如用户点击、动画等的渲染），保证了渲染的帧率。

## 架构

{{< img src="arch.png" alt="arch" maxWidth="220px" >}}

React架构是包含三个部分： 
1 调度器：管理任务优先级
2 协调器：找出变化的部分
3 渲染器：负责渲染

## 原理

我们先从渲染器说起，其他部分主要是辅助，渲染函数是将jsx转为dom节点通过原生dom api进行渲染。 JSX是什么？jsx是一种描述当前组件内容的数据结构，在react中，babel编译jsx格式为dsl对象后，底层通过React.createElement的方法调用创建属性类型$$type是Element的对象。 而react component是一个另一个对象，通过 ClassComponent.prototype.isReactComponent判断。Fiber节点是虚拟DOM节点，也是一个对象。

> Fiber节点： packages/react-reconciler/src/ReactInternalTypes.js

我们上面设计原理讲了React引入了Fiber架构，我们将jsx转为dom节点渲染时，如果jsx节点非常多，这个过程会非常长（导致卡顿），所以需要利用fiber架构，拆分渲染任务。 Fiber架构其实就是一颗树，每个节点作为一个单独的工作单元。


## react 18新特性

### Suspense

request library： Relay

### concurrent rendering

1 默认能批量更新； 
2 新API:
  useTransition and startTransition 优先级控制；
  useDeferredValue 渲染旧数据
  <Suspense> 处理loading


### Diff算法 

只比较同级别



### 参考资料

https://react.iamkasong.com/
https://juejin.cn/post/7016512949330116645

