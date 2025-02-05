---
title: "Regular的脏检查机制"
date: 2019-11-25
---

当调用$update的时候，会首先找到DigestRoot（默认情况下，即顶层使用new创建的组件），再层层向下进行组件的$digest()检查。
抽象是为了复用。
脏检查稳定性是指什么？不稳定的监听器是什么？

```
this.$watch('firstName', (firstName) => {
    this.data.nickname = firstName = "先生";
});
```

当firstName改变时，nickname也随之改变，所以为了确保不出错，框架会检查多轮直到监听表达式不再变化。
稳定的监听器有哪些，比如文本插值，r-html,属性插值等

```
this.$watch('title', (title) => {
    this.$refs.top.innerHTML = title;
}, {stable: true})
```

list是最容易产生性能的地方，为什么？
Regular的莱文斯坦编辑距离是什么？：不需要额外标记，就可以找到尽可能少的步骤从一个字符串过渡到另一个。做到尽可能少的步骤变更DOM. 算法时间复杂度是O（n^2）
列表更新时，不会尝试销毁重建，而是直接更新内部的值。内部的diff复杂度是O(n)。但是config、init不会被触发。

如何证明你行，你擅长某一事物？对比如何证明你有钱。
什么时候你才是你知道了这个东西，你熟悉了这个东西：就是你一想，脑子里就有一幅图，能很快按照这个图说明出来一二三。

__proto__是对象的属性。原型prototype是构造函数上的。
