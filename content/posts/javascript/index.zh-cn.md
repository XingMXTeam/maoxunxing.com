---
title: "Javascript"
date: 2022-04-02T10:36:11+08:00
draft: true
---


## Map/Set

不保证顺序

map初始化：

``` ts
let myMap = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
myMap.get(1) // => one
```
 
## Object.freeze

浅拷贝

## 迭代器 

迭代对象(必须定义可迭代)或者数组，如果作为参数使用是转换为数组
```ts
const iterableObj = {
  current: 1, 
  last: 4,
  [Symbol.iterator]() {
    return this
  },
  next() {
    if(this.current<this.last) {
      return {
        done: false, 
        value: this.current++
      }
    }
    else {
      return {
        done: true
      }
    }
  }
}

console.log(...iterableObj)
```

//---

``` ts
const iterableObj = {}
iterableObj[Symbol.iterator] = function* () {
  yield 123
  yield 2
}

console.log(...iterableObj)
```

//---

``` ts
class Foo {
  *[Symbol.iterator] () {
    yield 1;
    yield 2;
    yield 3;
  }
}

console.log(...new Foo)
```

## RegExp

## Symbol

是一个基本数据类型
Object.getOwnPropertySymbols() 获取所有的symbol属性
Symbol.for(key) 先到全局注册表找，找到则直接返回，否则创建一个新的全局标识符。全局的意思是跨文件可用。
Symbol(key) 作为对象属性的标识符，它是唯一的，不是全局的

## Immutable

理念：
JS的对象是可变的（Mutable），为了解决数组和对象引用复制可能会影响到原先的对象，应用复杂下这种情况会比较烦。 而我们如果通过拷贝避免被修改，会造成CPU和内存的浪费，另外Mutable导致数据很难被追溯。怎么解决这个问题呢？我们会通过把数据转为一个有向无环图数据结构，会共享哪些被改变的属性（节点），保留那些没有变的节点，达到不可变数据结构的目的（原先的对象没有任何改变，同时我们优化了我们的内存的占用）

特性：

* ● immutable使用了结构共享技术(字典树\有向无环图（directed acyclic graph）），尽可能的复用内存
* ● 每次数据都是不一样的
* ● 并发安全
* ● Cursor访问深层数据

结构共享技术： 
● bitmap vectro trie(index trie): 高效地访问和修改
● hash array mapped trie(hash trie)

关键词：
toJS(返回普通对象)、fromJS（创建Immutable对象）、is(判断数据是否变化，相比deepCompare性能更好)

## Lodash

● setWith:  大数据对象的设置和取值非常高效

## Proxy

apply是基于函数的调用
get是基于属性获取


