---
title: "Regular的Redux实现整理"
date: 2019-11-25
tags:
  - Redux
  - JavaScript
  - State Management
  - Frontend
---

### Regular的Redux实现整理

什么问题？
组件的树形结构决定了数据的流向，导致的数据传递黑洞

怎么解决？
所有组件都通过中介者传递共享数据
方案：
中介者：

```javascript
(function createStore() {
    var store;
    return function() {
            if(!store) {
                store = new Regular;    
            }
            return store;
    }
})()
```

组件A修改数据

```javascript
define(['./store.js'], function(createStore) {
 var A = Regular.extend({
   name: "组件A",
   data: {
     title: '标题'
   },
      getData: function() {
         this.data.title = createStore().data.title;
      },
   setData: function() {
        store.data.title = '新标题'
        //通知所有其他组件
     store.$emit('change', {
      title: '新标题'
     })
   }
 });
 return A;
});
```

其他组件可以监听，也可以主动拿：

```javascript
define(['./store.js'], function(store) {
 var B = Regular.extend({
   name: "组件B",
   init: function() {
     createStore().$on('change', function(newTitle){
      this.data.title = newTitle
     })
   }
 });
 return B;
});
```

两个问题：
1 store.data可以直接被访问和修改->data和store分开&通过接口拿
2 只需要订阅和派发（派发的时候会把数据存起来并通知其他订阅者）

```javascript
(function createStore() {
  var store;
  return function() {
   if(!store) {
    var store = new Regular;
                var state = {};
  store.getState = function(){ return state; };
  store.subscribe = function(listener) { store.$on('change', listener); }
  store.dispatch = function(action) {    
                  if(action.type == 'changeTitle') {
                       state.title = action.data.title;
                  }
    store.$emit('change', state);
  }
   }
   return store;
  }
})()

define(['./store.js'], function(createStore) {
 var A = Regular.extend({
   name: "组件A",
   data: {
     title: '标题'
   },
      getData: function() {
         this.data.title = createStore().data.title;
      },
   setData: function() {
                store.dispatch({
                         type: 'changeTitle', 
                         data: {title: '新标题'}
                })
 });
 return A;
});

define(['./store.js'], function(store) {
 var B = Regular.extend({
   name: "组件B",
   init: function() {
     createStore().subscribe(mapState)
   },
          mapState: function(state) {
             this.data.title = state.title
          }
 });
 return B;
});

```

这个就是基本的redux雏形。后面的其实都是一些改进。
改进1： 数据处理耦合在store当中->抽出reducer并能传入初始state

```javascript
(function createStore(reducer, initState) {
  var store;
  return function() {
   if(!store) {
    var store = new Regular;
                var state = initState;
  store.getState = function(){ return state; };
  store.subscribe = function(listener) { store.$on('change', listener); }
  store.dispatch = function(action) {    
                  state = reducer(state, action);
    store.$emit('change', state);
  }
   }
   return store;
  }
})()
```

reducer长这样：

```javascript
function reducer1(state, action) {
  switch(action.type) {
    case 'CHANGE_TITLE':
      //es6写法
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
      //return {
      //...state,
      //title: action.data.title
      //}
      return Object.assign({}, state, {title: action.data.title});
      break;
  }
}
```

reducer说是一个纯函数，本质上就是它不改变输入的参数，最后返回了一个新对象（规约）。也解决了可变数据结构的问题。
改进2：每个组件都需要依赖store，并且需要调用store的subscribe和dispatch方法->创建顶层容器并且扩展它的组件的能力

```javascript
const App = Regular.extend({
  name: 'App',
  template: `
    <StoreProvider>
      <A />
      <B />
    </StoreProvider>
  `
});

var StoreProvider = Regular.extend({
      template: '{#include this.$body}',
      config: function(){
        this.store = createStore();
      },
      modifyBodyComponent: function( component ){
        component.dispatch =  this.store.dispatch.bind(store)
        //把订阅这个工作给做了
        this.store.subscribe(function () {
          var state = this.store.getState();
          component.mapState(state);
        }.bind(this));
        component.getState = this.store.getState.bind(store)
      }
});
```

然后子组件内就可以这样调用了：

```javascript
define([], function() {
 var B = Regular.extend({
   name: "组件B",
   init: function() {
     this.subscribe(mapState)
   },
          mapState: function(state) {
             this.data.title = state.title
          }
 });
 return B;
});
```

改进3： 这里的store没法传reducer和初始状态，因为你是里面调用的->createStore在外面做，然后把store传给顶层容器

```javascript
const App = Regular.extend({
  name: 'App',
  template: `
    <StoreProvider store={store}>
      <A />
      <B />
    </StoreProvider>
  `
  config(data) {
     data.store = createStore(reducers, { title: "标题" })
   }
});


var StoreProvider = Regular.extend({
      template: '{#include this.$body}',
      config: function(data){
        this.store = data.store;
      },
      modifyBodyComponent: function( component ){
        component.dispatch =  this.store.dispatch.bind(store)
        //把订阅这个工作给做了
        this.store.subscribe(function () {
          var state = this.store.getState();
          component.mapState(state);
        }.bind(this));
        //这个方法其实不用了。因为数据通过connect获得了，而初始数据通过一开始就传到store进去了
        component.getState = this.store.getState.bind(store)
      }
});
```

改进3： 并且这样每个组件都有一个mapState方法，而且做得事都比较类似就是把state的数据过来-> 抽出一个connect函数

```javascript
function connect(config, B) {
 B.implement({ 
  mapState: function(state) {//this指向B
    const mappedData = config.mapState.call(this, state);
    mappedData && Object.assign(this.data, mappedData);
  }
 });
}

connect({
  //es6简写
  //mapState(state) { 
  //...
  //}
  mapState:  function(state) {
    return {
      title: state.title 
    }
  },  A);
```

以上，就是redux核心的基本实现原理。

中间件是干嘛用的？
<https://guoyongfeng.github.io/book/15/04-redux-logger%E7%9A%84%E5%BA%94%E7%94%A8%E5%92%8C%E7%90%86%E8%A7%A3.html>
比如上面的logger中间件，就是想在store的dipatch方法里面做点其他事，比如打印下个性化的日志。
怎么实现？

正常想法：代理dispatch方法

```javascript
function applyMiddleware() {
  let store = createStore(reducer1, initState);
  store.dispatch = function(action) {
    console.log("....")
    store.dispatch(action);
    console.log("....")
  }
  return store;
}
```

后面呢也是改进。。
改进1：不希望改变原先store&dispatch内打印日志部分希望能做其他事情->传递一个middleware回调进去

```javascript
function logger(dispatch, action) {
    console.log("....")
    dispatch(action);
    console.log("....")
}


function applyMiddleware(middleware) {
  let store = createStore(reducer1, initState);
  let dispatch = function(action) {
      middleware(store.dispatch,  action)
  }
  return Object.assign({}, store, {dispatch: dispatch});
}

var store = applyMiddleware(logger)

```

改进2： 如何处理多个中间件（每个中间件做的事不一样）而且store的dispatch应该只被执行一次

```javascript
var store = applyMiddlewares(logger,  someMiddleware)
function applyMiddlewares(logger, someMiddleware) {
  let store = createStore(reducer1, initState);
  let dispatch = function(action) {
      //希望一层层代理地执行中间件，最左边的先执行
      someMiddleware(logger(store.dispatch, action), action)
  }
  return Object.assign({}, store, {dispatch: dispatch});
}

//所以logger必须return一个函数，给其他middleware执行
function logger(dispatch) {
   return function(action) {
        console.log("....")
        dispatch(action);
        console.log("....")
   }
}
```

改进3： 仔细看这里面的实现发现就是数组的reduceRight方法

```javascript
function applyMiddlewares(middlewares) {
  let store = createStore(reducer1,  initState);
  let dispatch =  middlewares.reduceRight(function(dispatch, middeware) {
        return middeware(dispatch);
  }, store.dispatch)
  return Object.assign({}, store, {dispatch: dispatch});
}
```

改进4： 中间件里面的next函数是干嘛用的？->其实就是传进去的dispatch方法

```javascript
function logger(next) {
   return function(action) {
        console.log("....")
        next(action);
        console.log("....")
   }
}
```

以上，就是redux中间件实现的基本原理。

Action Creator是什么？
是对dispatch函数参数(也就是action)的一种抽象，便于Action的复用
比如我们这么写：

```javascript
this.$dispatch({
    action: 'CHANGE_TITLE',
    data: { title: '新标题' }
})
```

可能其他组件也需要写相似的代码，你需要复制代码。其实我们可以抽出一个creator。

```
//这部分可以被复用
const  CHANGE_TITLE = 'CHANGE_TITLE';
function changeTitle(newTitle) {
  return {
        type: CHANGE_TITLE ,
        data: { 
               title:  newTitle
        }
  }
}

this.$dispatch(changeTitle('新标题'))
```

最后的一张图总结：
![alt text](image.png)