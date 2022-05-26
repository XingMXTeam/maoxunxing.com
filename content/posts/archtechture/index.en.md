---
title: "Archtechture"
date: 2022-05-26T21:14:25+08:00
draft: true
---

背景介绍
首先配置项是能解决问题的，比如我们的操作系统，但是前提是这个配置项是产品人员提供的，不是什么都是配置项，这个配置项是一开始就实现好的（是开发需求）。  配置项（扩展点）有三种：模型、逻辑、UI(数据+界面）。模型可以理解为领域模型，比如在订单下面有主子订单，但是在服饰里有颜色，size，两者是不一样的。 什么是逻辑扩展点，逻辑扩展可以举一个例子，比如你要出国用人名币取日元，到取款机，它会提供几个SOP给你操作，比如验钞，金额，人民币到日币的转换，验钞，打开取款机。当我们租户不一样的时候，比如我们是要出国到美国，中间汇率转换要更换为另一个元件，仍然能完成这个取款机的功能。取款机(pass服务)是要有这个配置项。如果只是软件，我们就叫sass。有时候软件需要我们的pass服务去支持我们的服务。这里的配置项，可以认为是我们的process  unit。可以做到页面级别的甚至模块级别的pu，怎么做到不同的单元是通过我们的数据驱动。

这三个扩展点是可以合并的，sass平台统一的透出。

前端在设计一个较大系统的时候，不可避免的需要考虑扩展性来满足多变的业务诉求。那么实际开发中怎么做到具备良好扩展性是我们考虑的事情。回到软件开发起始点， 软件开发当中，面向对象的SOLID原则这个名词大家都知道，也就是要满足开闭原则，单一职责等等，而在我们实际的框架中，我们大都可以看到依赖倒置、依赖注入、中间件、插件之类的名词。 如果去深入理解他们的关系，他们的关系又是什么呢？ 当我们检查我们的架构实现的时候，是否都用到了这些思想或者至少我们知道怎么用他们。

基本概念
先了解下概念：

什么是中间件？  我理解中间件是一个HOOK框架，嵌在我们的系统或者框架的主机制或者流程中。也可以认为是一个插件系统，可以修改我们的主机制或流程的上下文，来实现自定义的行为。 如果从这里看，中间件是能很好的扩展系统的能力，也就是满足开闭原则（对修改封闭，对扩展能力开放）。所以中间件机制可以认为是一种软件SOLID原则的实践行为。如何实现好我们的中间件，意味着我们的系统是否扩展性好。

依赖注入和依赖倒置的关系？
依赖倒置的意思是A调用B，但是B却对A有依赖关系。A具有控制权。依赖注入很好理解，就是一种依赖关系的实现方式。比如A依赖B,  我们在A定义接口，在A内部用这个接口编程（依赖它具体的接口，不会依赖它的实现）。运行时，动态注入这个接口的实例。这就是依赖注入和依赖倒置，它的理念在我们的软件实现中几乎无处不在。

具体实现
在软件开发当中，我们是怎么实现扩展能力的？

在java知识体系当中，我了解到的有Java的SPI（Service Provider Interface）思想：Provider提供方只需要根据接口实现API，使用方实现SPI。调用的时候根据项目中的配置文件（配置好Provider的class)动态加载Provider的具体实现。这种思路提供了一种方式，让业务有自定义能力。本质上是一种策略模式，基于规则动态加载实现是满足我们上面的SOLID规则的。在我们的前端领域， 比如常见的If/else过多的情况，也是可以通过这种策略模式优化。

而在前端知识体系中，我们大都通过中间件、插件这种方式来实现扩展性。实际项目实现中，我发现可以有非常多的实现。

1 基于代码动态代理

一个典型的例子是Webpack插件系统Tapable，实现上也最复杂。它暴露了很多hook类作为API给用户使用，但是底层主要只有两个大类hook和hookCodeFactory, 前者主要定义接口，在我们注册不同的钩子函数时，会通过数组管理这些钩子函数，当调用的时候，实际是调用的动态生成的代码（通过new Function执行)。这些动态代码是根据不同的hook类型生成不同的执行流程。Tapable提供了非常多类型的Hook类型函数，来满足不同的业务诉求。简单来说一种是同步，一种是异步。同步又分为普通同步，带钩子同步（返回值则中途终止），循环同步（可以循环执行钩子函数），同步带上下文传递。同步函数的顺序可以动态调整。异步又分为异步并行（主应用回调函数是先注册先调用则触发，后续不再触发，这里并行是指每个回调函数按照顺序执行）、带钩子异步并行（返回值可终止）、异步串行
非常强的流程管理能力，能很好地将流程和代码实现解耦。


2 基于事件驱动设计
目前我了解到的有 MTOP中间件、Babel插件、Koa/midway插件、workbox等等。基本都是基于事件驱动。
总体思路是基于EventEmitter事件总线，责任链的设计模式。初始化在需添加某个插件（链的节点），然后执行阶段会从节点列表里捞出来节点，绑定事件并触发它的事件（也就是执行插件的钩子函数）。附上： 最小实现Demo

使用方式：
class App extends PluginTarget {
  constructor() {
    this.method() // start 
  }
  
  async method() {
    super.method() // will set event and call method
  }
}

class PluginA extends BasePlugin {
  async method(next) {
    return await next() // run next plugin
  }
}

class PluginB extends BasePlugin {
  async method(next) {
    return await this.interrupt();//interrupt the chain exec
  }
}
测试用例：
test("case 1", () => {
  const app = new App();
  app.add(new PluginA());
  const spy = jest.spyOn(app, "exec");
  app.exec();
  spy.mockRestore();
});

test("case 2: interupt", () => {
  const app = new App();
  app.add(new PluginB());
  app.add(new PluginA());
  const spy = jest.spyOn(app, "exec");
  app.exec();
  spy.mockRestore();
});

3 基于装饰器设计
是一个借助lodash-decorators动态代理，实现了在主流程App的函数动态插入插件的同名钩子函数的能力。注册的时候主要注册的是类，通过decortors的动态方式实例化插件和调用相应的方法。这种实现方式的好处是使用上非常简单。因为通过类的方式注册，webpack可以打包成多个插件cdn，结合combo加载方式能减少包大小和动态插拔。附上：最小实现Demo

使用方式：
class App extends PluginTarget {
  constructor() {
    this.method() //start
  }
  
  @hook
  async method() {
    
  }
  
  @once
  @hook
  async method2() {
    
  }
  
}

class PluginA extends BasePlugin {
  @inject
  async method(next) {
    return await next() // run next plugin
  }
}

测试用例：
test("case 1", () => {
  App.install(PluginA);
  App.install(PluginB);
  const app = new App();

  const spy = jest.spyOn(app, "test");
  const res = app.test();
  spy.mockRestore();
});

4 基于Proxy代理
首先把所有插件实例注册到插件管理器，注册的会调用初始化方法，它会调用主App中提供的插件能力方法（本质是通过Proxy方式向实例注入新的方法，新的方法里面代理调用插件的方法）向主App中动态注册插件的方法。这样凡是通过插件注册进去的方法，我们的主App流程都可以调用，并且插件里面的方法是能链式调用的。这样的方式就把主流程的能力外化出来了。当然缺陷是所有的插件都是一起打包的，不具备动态插拔。附上：最小实现Demo

使用方式： 
class App extends PluginTarget {
  async onClick() {}
}

class PluginA {
  async onClick(context, next, options) {
    return await next() 
  }
}

测试用例： 
test("case 1", () => {
  const app = new App({
    pluginManager: new PluginManager(),
    plugins: [PluginB, PluginC]
  });
  const spy = jest.spyOn(app, "onClick");
  const onClick = app.onClick();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
启发思考

中后台后期可能要整体重构中后台核心基建。 可能会做一个库或者框架，来解决工程规范、微应用模块调度等等问题。 插件体系或者中间件是框架的底座，如何设计好，需要深度的思考。





