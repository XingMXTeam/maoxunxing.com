---
title: "现代化React开发最佳实践"
date: 2021-12-02T15:00:46+08:00
draft: true
---


## hooks还是class?

显然hooks目前正大行其道。 class有啥弊端呢？ 
1 一般class结合typescript时，需要定义一堆的类型，而Hooks 函数能简化
2 hooks能规避掉HOC的嵌套地狱，HOC层层嵌套一般通过迭代器模式实现，hooks通过组合模式能很好规避这个问题
3 HOC存在消费黑盒，props下传排查难度大，可能某些props丢失导致渲染异常
4 多个HOC使用存在前后依赖关系

class有啥好处？
1 消费数据实体的时候，非常清晰。因为面向对象的缘故，而不是散落的字段
2 扩展方便。需要扩展对数据的处理，只要新增方法就行
3 数据之间的关联关系，通过类型判断能清晰理解
4 多个数据判断做UI渲染或者交互时，会显得更清晰

所以数据模型借助class， 而组件渲染借助hooks。利用装饰器、类元数据、依赖注入，将数据、服务、消费灵活组合。以前需要借助目录规定定义、特殊命名规则定义来完成相互调用和组合。借助装饰器可以在项目任意位置进行自由组合。


## 如何状态管理 

> 破窗效应

Hooks状态不共享，不持久，数据是多份


方案1: [umi/hox](https://github.com/umijs/hox)  
优点：
1 持久化，数据全局共享  
2 支持订阅更新和不订阅更新  
缺点：
1 持久化和非持久的界限： createModel?
2 缺少devtools？无法查看变化的状态
3 可否在model里面写副作用？

方案2: Redux
方案3: Dva
方案4: mobx
方案5: immer


## Render Props

通过props传递函数，达到组件间共享状态的目的（Hooks只能封装状态，它每次都是不同的实例，无法做到组件间状态共享而且不是持久化）

方式1： 在Mouse组件内部可以调用render方法 传递给Cat组件

```ts
function App extends React.Component {
  render() {
    return <Mouse render={(data) => <Cat data={data}>}> 
  }
}

```方式2:  采用HOC方式封装

```ts
function useMouse(Component) {
  return class extends React.component {
     render() {
       return <Mouse render={data => <Component {...this.props} data={data} />} />
     }
  }
}

```方式3: 使用Children传递

```ts
function App() {
  return <Mouse>
    {
      data => <Cat data={data} />
    }
  </Mouse>
}

function App() {
  // 注意: 这里的方法，每次的引用都会重新创建。如果想避免它，最好挂载在对象下面或者用useCallBack
  return <Mouse children={data => <Cat data={data} />} />
}


```

## Pure Component

* ● 会实现一个shouldComponentUpdate，它会浅比较prop和state，告知要不要调用render 来提高性能。对于复杂的props或者state数据变更，你可以调用forceUpdate主动实现渲染
* ● 跳过子组件的Props更新，所以需要子组件也是pure






