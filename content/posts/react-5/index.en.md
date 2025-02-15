---
title: "Why React Hooks"
description: ""
date: 2019-12-05 11:53
tags:
  - React
images:
  - react-1/a.png
---

Why React Hooks

Earlier we use createClass, then we use React.component after React v0.13.0. But it is not so perfect as i think. Because below two reasons:

in constructor, you must invoke super method before use this & you must pass the props to super
you must autobind this

All right, we can use Class Fields to avoid use constructor, arrow function to avoid autobind.

But maybe you will implement a component like this:

duplicate code!! right?
![alt text](image.png)

Again, you can use HOC to avoid write these duplicate code. But in my opinion, HOC is not so easy to understand what it does inside, and it will lead to “wrapper hell”.

That was why React Hooks produced.

How to use

Basicly in React, view = fn(state). Since React v0.14.0, we can use Class or Function to create a component.Now we can always use function.

now, we can implement it by React Hooks like this:
![alt text](image-1.png)

useState
useState is the first hook we use now. What does it do? it accept the initial state (value or function), and return an array, first is the value, second is the set function like setRepos. The set function will trigger React to re-render when it was invoked.

The difference between useState and setState is that

setState controll all the state in React
the set function will replace all the state while setState will merge the previous object

![alt text](image-2.png)

useEffect
But where are our lifecycle functions. Basicly in React, lifecycle was used to sync the effect when state changed.To do this, now we use useEffect in React Hooks.

![alt text](image-3.png)

The hard parts are when useEffect was invoked. Shortly, when you didn’t pass the second params,  it will run after every re-render.

But when it run inside invoking the set function, it  will trigger re-render again then it will re-run.... So it became an infinite loop.The second params can control the useEffect run, [] will make it run only initial render or specific keys which it depended value had changed.

![alt text](image-4.png)

Additionally, when we use addEventListener or websocket in our useEffect function, we need to cleanup so that it won’t memory leap. So useEffect provide a way to do this:

![alt text](image-5.png)

rules
Because React relies the call order of Hooks to keep track the internal state and references. React.useState and useEffect can only be invoked at top level. Details showed bellow:

✅from the top function component
✅from the top level of a custom Hook
❌from inside a  React component
❌from inside a  normal function
Advanced
custom Hooks
React are all about UI component composing, but there were also a lot non-visual logic. we need a way to reuse the logic. Before we use HOC

or pass in a render function through Render Props. For example we

want to write a tooltip UI, maybe we will do like this:

HOC:

![alt text](image-6.png)

Render Props:

![alt text](image-7.png)

Now we can use Custom Hooks, it avoid wrapper hell in HOC and Render Props and it was more easy to understand.

We define a function start with a use:

![alt text](image-8.png)

we use it like this:
![alt text](image-9.png)

useReducer
React provide a way to manage the state using the reducer pattern.We can invoke dispatch to change the state

![alt text](image-10.png)
![alt text](image-11.png)

If you understand the reduce function. It will be easy to understand the reducer. When we use reduce, the initialState will not changed, and return a new state.

![alt text](image-12.png)

So the hard parts are when we use this pattern and when to use the set function to setState. In short, the dispatch way is

a more declarative to change state when we had many states to change.
minimize dependency array

update state based on another state
![alt text](image-13.png)
![alt text](image-14.png)

useRef

useRef solve the problem that we want to persist the value across renders.Also, we can use closure to solve this problem.Every time re-render we can refer the closure state through the current.
![alt text](image-15.png)

useRef is just like usePersistentValue. Here is an example:
![alt text](image-16.png)

Another use case of useRef is  to getting access the DOM node.
![alt text](image-17.png)

useContext
As we all know, we share data between components through passing props and context is another way to share data between multi-components. In Hooks, we use useContext.

![alt text](image-18.png)

Performance
React.memo
it was a HOC which used to skip re-render. The component’s result will memorized.

useCallback
it was used to memorize the callback ref.When use React.memo, the function ref will changed, this is how useCallback used to fix this problem.
useMemo
useMemo can replace useCallback and React.momo. Here is a case:
![alt text](image-19.png)

End.
