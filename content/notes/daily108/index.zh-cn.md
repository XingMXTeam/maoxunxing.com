---
title: "响应式编程"
date: 2019-11-25
tags:
  - Programming
  - Reactive Programming
  - JavaScript
  - Architecture
---

# 什么是响应式编程

不用响应式编程：

```javascript
class Calculator {
    sum(a, b) {
        return a + b;
    }
}
class Receipt {
    constructor(calculator) {
        this.calc = calculator;
    }
    print(itemA, itemB) {
        const total = this.calc.sum(itemA, itemB);
        console.log(`total receipt £${total}`);
    }
}
const pizza = 6.00;
const beer = 5.00;
const calc = new Calculator();
const receipt = new Receipt(calc);
receipt.print(pizza, beer);
```

采用响应式：

```javascript
class Calculator {
    constructor(itemA, itemB) {
        const obs = Rx.Observable.of(itemA, itemB);
        const sum$ = obs.reduce((acc, item) => (acc + item));
        return {
            observable: sum$
        }
    }
}
class Receipt {
    constructor(observable$) {
        observable$.subscribe(value => console.log(`total receipt: £${value}`))
    }
}
const pizza = 6.00;
const beer = 5.00;
const calc = new Calculator(pizza, beer);
const receipt = new Receipt(calc.observable);
```

## 编程范式

1 命令式编程

```javascript
const JEANS = 80.00;
const SHIRT = 35.00;
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
const calc = new Calculator();
const receipt = new Receipt(calc);
receipt.print(JEANS, SHIRT, SHOES, COAT, HAT); //"total receipt £456.28"
```

2 函数式编程

+ 纯函数：输入什么 一定输出什么； 没有副作用

+ 不可变数据结构：不会改变原对象
原数组变化了：

```javascript
const originalArray = [1, 4, 8, 12];
for(let i = 0; i < originalArray.length; i++){
    originalArray[i] = originalArray[i] + 1;
}
console.log(originalArray) //[2, 5, 9, 13]
```

原数组不变：

```javascript
const originalArray = [1, 4, 8, 12];
const finalArray = originalArray.map(value => value+1);
console.log(finalArray); //[2, 5, 9, 13]
```

+ 状态管理：redux
+ 高阶函数：函数作为参数，返回一个新函数
更关注行为而不是实现

```javascript
class Calculator {
    getTotal(...items) {
        const total = items.map(::this.addVAT)
            .reduce(this.sumElements);
        return total;
    }
    addVAT(itemValue) {
        return itemValue + this.calculateVAT(itemValue);
    }
    calculateVAT(value) {
        const VAT = 22;
        return value * VAT / 100;
    }
    sumElements(accumulator, value) {
        return accumulator + value
    }
}


class Receipt {
    print(total) {
        console.log(`total receipt £${total.toFixed(2)}`);
    }
}
const JEANS = 80.00;
const SHIRT = 35.00;
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
const calc = new Calculator();
const receipt = new Receipt();
receipt.print(calc.getTotal(JEANS, SHIRT, SHOES, COAT, HAT)); 
```

3 响应式编程
响应式编程是一种基于生命周期内流转改变的异步数据流的编程范式

响应式转为命令式：

```javascript
class Calculator {
    constructor() {
        this.VAT = 22;
    }
    sum(items) {
        const items$ = Rx.Observable.from(items);
        const total$ = items$.map(value => value + (value * this.VAT / 100))
            .reduce((acc, value) => acc + value);
        return total$;
    }
}
class Receipt {
    constructor(calculator) {
        this.calc = calculator;
    }
    print(...items) {
        const total$ = this.calc.sum(items);
        total$.subscribe(total => console.log(`total receipt £${total.
toFixed(2)}`));
    }
}
const JEANS = 80.00;
const SHIRT = 35.00;
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
const calc = new Calculator();
const receipt = new Receipt(calc);
receipt.print(JEANS, SHIRT, SHOES, COAT, HAT);
```

响应式转为函数式：

```javascript
class Calculator {
    getTotal(...items) {
        const items$ = Rx.Observable.from(items);
        const total$ = items$.map(::this.addVAT)
            .reduce(this.sumElements);
        return total$;
    }
    addVAT(itemValue) {
        return itemValue + this.calculateVAT(itemValue);
    }
    calculateVAT(value) {
        const VAT = 22;
        return value * VAT / 100;
    }
    sumElements(accumulator, value) {
        return accumulator + value
    }
}
class Receipt {
    print(total$) {
        total$.subscribe(total => console.log(`total receipt £${total.
toFixed(2)}`));
    }
}
const JEANS = 80.00;
const SHIRT = 35.00;
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
const calc = new Calculator();
const receipt = new Receipt();
receipt.print(calc.getTotal(JEANS, SHIRT, SHOES, COAT, HAT));
```

## 什么时候用响应式编程

1 财务报表之类强数据驱动的
2 实时应用需要大量数据异步处理

微软和谷歌也在驱动响应式编程：比如 <http://reactivex.io/>

## 怎么让你的应用响应式

# 框架比较

框架和设计的区别
框架：不同的元素之间如何交互， 比如M和V层如何交互
设计：选择具体的库，算法或者设计模式
![框架时间线](index_files/da76ac5b-e0be-4a5a-98a5-4696eaa753b1.jpg)

## MVC

### mvc是怎么工作的

controller和view的关系  可以是1对多
controller和model的关系 可以是1对多

controller依赖model， 监听view抛出的事件，并调用model处理。

model和view没有直接关联，主要是用来保存程序的状态，应该负责对数据进行处理，暴露API供外部调用。
当程序状态改变或者data被更新时，model都应该触发一个事件出来。

view依赖model， 监听model抛出的事件， 展示数据和监听用户行为。

## MVP

![MVP](index_files/c5a0df4a-9cb4-4671-b435-d24be4de988c.png)

view感受不到Presenter。model和view更加感受不到彼此。

Presenter用来控制行为。

MVP优势在于：当我们需要复用views层或者行为。
它更加关注模块化和前端。

MVP和MVC的区别是：
1 MVP有一个展示层（Presenter）替代了控制层
2 view和presenter是1对1的关系
3 当我们设计的时候考虑到view是可变的，view能更加可复用。比如我们有不同的设备，但是需要不同的UI展示。

### mvp是怎么工作的

展示层从model拿到所有view层需要的数据，并传递给view。同时需要处理用户交互行为并且更新model。

view层通过注入的一个方法和Presenter联系。

MVP比MVC更好。

## MVVM

MVVM是微软2005年为了解决WPF的GUI管理而创建的。
![MVVM](index_files/07d5041f-11c1-484a-99a3-3979ebb6de9a.jpg)

### MVVM是怎么工作的

view-model层的data是为view层准备的，它的逻辑和view层要展示的东西是强耦合的，比如我们要展示欧元，那么我们的货币就需要转化为欧元的格式。

view-model和view的关系是1对多。

MVVM中view层和model层也必须完全隔离。

view-model监听view层的事件，触发一个事件更新view层

## Angular

Angular大概是10年开始的，它是google开源和维护的。

17年发行了一个新版本，提供了一个完整的生态，它的第二版采用TypeScript作为主要语言。

Angular有四个概念：
1 依赖注入
2 NgModules和组件的模块化
3 模板和组件的数据绑定
4 定义组件和模块的decorators

Angular的模块必须显示声明依赖的组件。组件声明依赖的服务。

至少有一个root-module。

decorators包裹了一个函数。

decorators添加的方法或者属性应该在项目中运行时公用，这也是为什么decorator被这么频繁使用的原因。这样我们可以不用继承基类写一些功能，从而和框架内部功能建立联系。

Angular的组件看成模板系统和REST API之间的一种桥梁。通过绑定系统将数据给到模板。组件是一系列属性的集合。
1 组件通过绑定更新view
2 组件和模板的关系是1对1
3 组件处理所有的用户交互

```
@Component({
    selector: 'app-root',//作为id
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [UpdateTotalService, CalculatorModel]//依赖注入，CalculatorModel不会被组件使用，但是如果service有用到，必须在这里写它。
})
```

```javascript
export class AppComponent implements OnInit {
  onScreenKeyboard = ON_SCREEN_KEYBOARD;
  total:string;

  constructor(private updateTotalService:UpdateTotalService){}

  //初始化时调用
  ngOnInit(): void {
    this.total = this.updateTotalService.reset();
  }
}
```

Service是用来从服务端获取数据或者获取、传递数据给model。

## React&&Redux

Redux主要包含了三个部分：
1 Actions
2 Reducers
3 Stores
Actions是一个js对象。
Reducers主要是用来更新状态的。
Stores传递给Reducers,等Reducers返回新的状态后，再更新状态树，并通知给所有监听者。
Redux基于以下几点：
1 应用程序的状态保存在一个单例对象Store中
2 state是可读的，改变状态只能通过action
3 修改是通过纯函数的方式修改的。reducers是纯函数。

### Redux是如何工作的

![redux](index_files/bd5f45ea-dce9-493b-80b0-70089bc8f6d5.png)

# 响应式编程

observable是一个对象，包含了一些数据，可以被observer订阅（消费），并且一旦实例化，它会提供一个取消函数。

observer是一个对象，它可以从observable取得数据。它提供了三个方法：next, error, complete

观察者模式（pub/sub订阅模式）
迭代器模式：
![迭代器模式](index_files/d29969f6-0898-4e24-a21b-cf601475f5c9.jpg)
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators#Iterators>

具体的代码例子：

```javascript
const observable = Observable.range(1, 10);
const observer = observable.subscribe(onData, onError, onComplete);
function onData(value){
    console.log(value);
}
function onError(err){
    console.error(err);
}
function onComplete(){
    console.log("stream complete!");
}
```

## Rx.JS

Angular2集成了Rx.JS。Rx.JS可以用在前端应用或者Node应用。

```javascript
import Rx from "rxjs"
const data = [1,2,10,1,3,9,6,13,11,10,10,3,19,18,17,15,4,8,4];
const onData = (value) => console.log(`current sum is ${value}`);
const onError = _ => console.log("stream error");
const onComplete = _ => console.log("stream completed");
const obs = Rx.Observable.from(data)
                        .filter(value => value % 2 === 0)
                        .distinct()
                        .reduce((acc, value) => acc + value);
obs.subscribe(onData, onError, onComplete);
```

每次通过转换（比如filter）都会产生新的observable。所有数据都在内部流转，无法通过外部修改。

```javascript
import Rx from "rxjs";
const URL = "https://jsonplaceholder.typicode.com/users";
const simplifyUserData = (user) => {
    return {
        name: user.name,
        email: user.email,
        website: user.website
    }
}
const intervalObs = Rx.Observable.interval(1000)//每隔1s
                                .take(2)//执行2次
                                .mergeMap(_ => fetch(URL))
                                .mergeMap(data => data.json())
                                .mergeAll()
                                .map(simplifyUserData)
intervalObs.subscribe(user => {
    console.log(`user name is ${user.name}`);
    console.log(`user email is ${user.email}`);
    console.log(`user website is ${user.website}`);
    console.log('------------------------------');
},
error => console.error("error", error),
complete => console.log("completed"))
```

1 Rx.JS可以识别Promise
2 MergeMap是一个操作符，通常做两件事。第一件事是合并两个流成一个，第二件是遍历它。这里它返回了一个流。
3 mergeAll通常是用来合并所有的observables。这里它通过遍历的形式返回单个值，而不是整个数组。

## Hot and Cold Observables

cold observables是单一传播的，只有订阅才会变化值。生产者在observable中，每次订阅都会生成生产者。
Hot observable是多播的，不需要触发；生产者是唯一的和被共享的。

cold:

```javascript
import Rx from "rxjs";
// 每隔2s生成一个值，从0开始到无穷，连续的值。不中断。因为没有指定触发多少次。
// startWith展示一个初始值或者不用等异步事件回来触发一个事件
const source = Rx.Observable.interval(2000).startWith(123)
source.subscribe(value => console.log("first observer", value))
setTimeout(_ =>{
    source.subscribe(value => console.log("second observer", value))
}, 5000);
setTimeout(_ =>{
    source.subscribe(value => console.log("third observer", value))
}, 8000)
```

hot:立即触发值

```javascript
import Rx from "rxjs";
// 返回ConnectableObservable对象
const source = Rx.Observable.interval(2000)
                            .startWith(123)
                            .publish()
                            .refCount(); // 不控制开始和结束 其他方法：multicast connect

source.subscribe(value => console.log("first observer", value))
setTimeout(_ =>{
    source.subscribe(value => console.log("second observer", value))
}, 5000);
setTimeout(_ =>{
    source.subscribe(value => console.log("third observer", value))
}, 8000)
```

Rx.js默认是cold observable.  XStream是hot， 它不用observables和observers，而是流的概念和事件触发，包含多个监听者。监听者包含next, error, complete方法。流就像observables，而监听者就像observers.

其他：Most.js\IxJS\Kefir\FlyD\Bacon.js

```javascript
import xs from 'xstream';
const data = [1, 2, 10, 1, 3, 9, 6, 13, 11, 10, 10, 3, 19, 18, 17, 15, 4, 8, 4];
const filterEven = (value) => value % 2 === 0;
const removeDuplicates = (inputStream) => {
    const buffer = [];
    const outputStream = xs.fromArray(buffer);
    inputStream.addListener({
        next(value) {
            if (buffer.length === 0 || buffer.indexOf(value) < 0)
                buffer.push(value);
        }
    })
    return outputStream;
}
const sumValues = (acc, value) => acc + value;
const listener = {
    next(value) {
        console.log(`current sum is ${value}`);
    },
    error() {
        console.error("stream error");
    },
    complete() {
        console.log("stream completed");
    }
}
const stream = xs.fromArray(data)
    .filter(filterEven)
    .compose(removeDuplicates)
    .fold(sumValues, 0);
stream.addListener(listener);
```

## back pressure

```javascript
const stockValuesProducer = Rx.Observable.interval(50)
                                         .map(value => { return (Math.random() * 50 + 100).toFixed(2)});

return stockValuesProducer.sampleTime(500);
```

# reactive框架之一cycle.js

消息传递架构，通过流沟通，强封装，很好地隔离。

三个关键概念：
1 纯函数
2 流
3 Drivers

```javascript
import xs from 'xstream';
import {
    run
} from '@cycle/run';
import {
    makeDOMDriver,
    p
} from '@cycle/dom'
const main = sources => {
    const sinks = {
        DOM: xs.periodic(1000).map(v => p(`seconds: ${v}`))
    }
    return sinks;
}
const drivers = {
    DOM: makeDOMDriver('#app')
};
run(main, drivers);
```

用Snabbdom实现虚拟dom
更多->关键字：

+ React-less Virtual DOM with Snabbdom
+ Snabbdom JSX

在响应式编程里面任何东西都可以是流

## MVI（Model View Intent Architecture）

比Redux和Angular更佳的架构

它采用了单向数据流（很多前端框架必备的特性）
![flux](index_files/07a7e882-0728-4c1b-9403-58bca39190af.png)

流输入 另一个流输出

1 model: 处理用户交互和保存state
2 view: 展示UI
3 intent: 订阅用户交互，然后给model
![mvi](index_files/d3e81965-bcc4-4c29-bba9-ead1b232bbc4.png)

1 每个部分可以被复用和独立测试
2 用了流以后更灵活和关注点分离
3 每个组件都可以用MVI架构

## circle.js的状态管理

Onionify

应用程序的状态是一个流被Onionify内部管理，每个组件可以管理他们自己的状态，和父组件的状态通过reducers

库：isolate 和组件进行隔离

Onionify不是一个driver 而是一个wrapper

可以结合组件的多个流组成程序更复杂的state.

# 响应式框架之二Mobx

在非响应式的编程中，我们想要更新状态。我们手动更改model的某些部分，并且更新views。导致它们耦合。

关键字：
1 Observables
2 Computed Values
3 Reactions
4 Actions: 更新state的唯一方式
5 Observers

更多内容：关键字：

+ In-depth explanation of MobX
+ Fundamental principles behind MobX

## 第一个Mobx和React程序

关注：

+ 数据流如何在程序中被管理
+ 如何处理用户交互
+ 如何处理请求
+ 如何管理程序状态

@observer ： 当状态改变的时候，自动调用render方法
Provider： 提供上下文，使在任何组件都可以访问到store

store和view是一对一的关系

![data-flow](index_files/2da29785-0b6c-4bbb-83be-fbbe14797f4c.png)

库：mobx-state-tree

# SAM（State-Action-Model）
