---
title: "Regular的脏检查机制"
date: 2019-11-25
tags:
  - Web开发
  - Regular
---

## 1. `$update` 的工作原理

当调用 `$update` 方法时，Regular 会从 **DigestRoot**（默认情况下是顶层通过 `new` 创建的组件）开始，逐层向下对每个组件进行 `$digest()` 检查。这一过程确保了所有绑定的数据变化能够被正确检测并更新到视图中。

### 脏检查稳定性

- **脏检查稳定性** 是指在数据变化后，监听器是否会引发新的数据变化。如果监听器在执行过程中改变了其他被监听的数据，则框架需要进行多轮检查，直到监听表达式不再变化为止。
  
#### 不稳定的监听器示例

```javascript
this.$watch('firstName', (firstName) => {
    this.data.nickname = firstName + "先生";
});
```

在这个例子中，`firstName` 的变化会触发 `nickname` 的更新，而 `nickname` 的更新可能会再次触发其他监听器的变化。为了确保最终状态稳定，框架会进行多轮检查。

#### 稳定的监听器示例

```javascript
this.$watch('title', (title) => {
    this.$refs.top.innerHTML = title;
}, { stable: true });
```

标记为 `{ stable: true }` 的监听器被认为是稳定的，不会引发额外的脏检查。例如：
- 文本插值（Text Interpolation）
- `r-html`
- 属性插值（Attribute Interpolation）

这些监听器通常只涉及单向数据流，不会引发新的数据变化。

---

## 2. 列表性能优化

列表是最容易产生性能问题的地方，因为列表的更新涉及到大量的 DOM 操作。Regular 通过以下方式优化列表更新：

### 莱文斯坦编辑距离算法

Regular 使用 **莱文斯坦编辑距离算法** 来优化列表更新。该算法不需要额外的标记，就能找到尽可能少的操作步骤，将一个字符串（或列表项）过渡到另一个字符串（或列表项）。其时间复杂度为 **O(n²)**。

#### 列表更新的特点

- **内部 Diff 复杂度**：Regular 的列表更新内部使用了优化后的 Diff 算法，复杂度降低到 **O(n)**。
- **不销毁重建**：在列表更新时，Regular 不会销毁并重建 DOM 节点，而是直接更新节点内部的值。
- **生命周期限制**：在列表更新过程中，`config` 和 `init` 生命周期钩子不会被触发。

## 3. 原型与原型链

### `__proto__` 与 `prototype`

- **`__proto__`** 是对象的属性，指向该对象的原型对象。
- **`prototype`** 是构造函数上的属性，用于定义实例对象共享的属性和方法。

#### 示例

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

const person = new Person("Alice");
console.log(person.__proto__ === Person.prototype); // true
```
