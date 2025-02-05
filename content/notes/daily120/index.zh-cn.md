---
title: "redux实现"
date: 2019-11-25
---

```js
//应用层
const store = applyMiddleware(logger,xxx)(createStore)(reducer1, {title: '12313'});

store.subscribe(() => {
  let state = store.getState();
});

store.dispatch({
  type: 'CHANGE_TITLE',
  data: {
    title: '123123'
  }
});


//reducer
function reducer1(state, action) {
  switch(action.type) {
    case 'CHANGE_TITLE':
      return Object.assign({}, state, {action.data});
      break;
    //...
  }
}


//redux
function createStore(reducer, initstate) {
  let store = new Regular;
  let state = initstate;
  store.getState = () => state;
  store.subscribe = listener => store.$on('change', listener);
  store.dispatch = function(action) {
      state = reducer(state, action)
      store.$emit('change');
      //可以连续调用
      return action;
  }
  return store;
}

//applymiddleware
function applyMiddleware(middlewares) {
  return function(createStore) {
      return function(reducer, initState) {
          //代理createStore
          let store = createStore(reducer, initState);
          //返回一个新的dispatch
          let dispatch = middlewares.reduceRight(function(dispatch, middleware) {
     return middleware(dispatch);
    }, store.dispatch)
          // let dispatch = wrapDispatch(store.dispatch, middleware);
          //返回一个新的store
          return Object.assign({}, store, {dispatch: dispatch})
          // return {
          //  ...store,
          //  dispatch
          // }
     }
  }
}

//middleware
function logger(next) {
    return function(action) {
      console.log("....")
      var action = next(action);
      console.log("....")
      return action;
    }
}
```
