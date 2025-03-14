---
title: "Vuex 原理 & Vue 响应式设计实现"
date: 2019-11-25
tags:
  - Vue
---

## 1. 创建 Vuex Store 实例

- **`new Vuex.Store`**：
  - 使用 `new Vuex.Store` 创建一个 Vuex 的 Store 实例。
  - 这个实例承载了以下核心内容：
    - **State**：存储全局状态。
    - **Commit**：用于提交 mutations，同步更新 state。
    - **Dispatch**：用于触发 actions，处理异步逻辑。

## 2. Store 的继承与功能实现

- **`Store{}`**：
  - Store 内部继承了以下核心模块：
    - **Mutations**：定义如何修改 state 的方法。
    - **Actions**：定义处理异步逻辑的方法，并通过 `commit` 调用 mutations。
    - **Getters**：类似于计算属性，用于从 state 中派生数据。
  - 调用底层的 `commit` 方法来同步更新 state。

## 3. Store 的注入与全局访问

- **传递给入口 Vue 实例**：
  - 将创建的 store 实例传递给 Vue 的根实例（通常在入口文件中完成）。
  - 通过这种方式，所有组件都可以通过 `this.$store` 访问 Vuex 提供的功能：
    - **访问状态**：`this.$store.state.xxx`
    - **提交 mutations**：`this.$store.commit('mutationName', payload)`
    - **触发 actions**：`this.$store.dispatch('actionName', payload)`
    - **获取派生数据**：`this.$store.getters.xxx`

---

## Vue 和 Regular融合

https://sq.sf.163.com/blog/article/193853627654062080

## Vue 源码

https://juejin.cn/post/6844903422882398215

---

## Vue 响应式实现

以下是一个简单的响应式系统实现，基于 Vue 的基本原理：

```js
class Vue {
	constructor(options) {
		this.data = options.data;
		this.el = options.el;
		this.observe(this.data); // 数据劫持
		this.render(); // 初始化渲染
	}

	// 数据劫持
	observe(obj) {
		const self = this;
		Object.keys(obj).forEach((key) => {
			let value = obj[key];
			Object.defineProperty(obj, key, {
				get() {
					return value;
				},
				set(newValue) {
					value = newValue;
					self.notify(key); // 数据变化时通知更新
				},
			});
		});
	}

	// 通知更新
	notify() {
		this.render();
	}

	// 渲染函数
	render() {
		const el = document.querySelector(this.el);
		const newVNode = this.createVNode(this.data.count); // 创建虚拟 DOM
		const oldVNode = el.__vnode; // 获取旧的虚拟 DOM
		this.diff(el, oldVNode, newVNode); // 比较新旧虚拟 DOM 并更新真实 DOM
		el.__vnode = newVNode; // 更新当前虚拟 DOM
	}

	// 创建虚拟 DOM 节点
	createVNode(value) {
		return {
			type: 'div',
			props: {},
			children: [String(value)],
		};
	}

	// 递归创建真实 DOM
	createDOM(vNode) {
		const dom = document.createElement(vNode.type);
		vNode.dom = dom;
		vNode.children.forEach((child) => {
			dom.appendChild(this.createDOM(child));
		});
		return dom;
	}

	// 比较新旧虚拟 DOM 差异并更新
	diff(parent, oldVNode, newVNode) {
		if (!oldVNode) {
			parent.appendChild(this.createDOM(newVNode)); // 新增节点
		} else if (!newVNode) {
			parent.removeChild(oldVNode.dom); // 删除节点
		} else if (this.isDifferent(oldVNode, newVNode)) {
			parent.replaceChild(this.createDOM(newVNode), oldVNode.dom); // 替换节点
		} else {
			newVNode.dom = oldVNode.dom; // 递归子节点
			for (
				let i = 0;
				i < newVNode.children.length || i < oldVNode.children.length;
				i++
			) {
				this.diff(
					newVNode.dom,
					oldVNode.children[i],
					newVNode.children[i]
				);
			}
		}
	}

	// 判断节点是否不同
	isDifferent(oldVNode, newVNode) {
		return (
			oldVNode.type !== newVNode.type ||
			oldVNode.children !== newVNode.children
		);
	}
}

// 示例使用
const vm = new Vue({
	el: '#app', // 指定 DOM 节点
	data: {
		count: 0, // 定义数据模型
	},
});

document.querySelector('#increment').addEventListener('click', function () {
	vm.data.count++; // 修改数据，触发更新
});
```

## 响应式系统思路

1. **数据劫持**：
   - 使用 `Object.defineProperty` 劫持数据，监听数据的变化。
   - 数据变化时，触发视图更新。

2. **模板解析**：
   - 解析模板生成渲染函数（`render` 方法）。
   - 渲染函数负责将数据映射到 DOM。

3. **依赖收集与更新**：
   - 初始化时，通过 `Watcher` 收集依赖。
   - 数据变化时，通知 `Watcher` 触发更新。

### 三大核心部件

#### Virtual DOM
- **定义**：虚拟 DOM 是一个 JavaScript 对象，描述了真实 DOM 的结构和属性。
- **作用**：
  - 提高性能：通过比较新旧虚拟 DOM，只更新发生变化的部分。
  - 提供跨平台能力：虚拟 DOM 可以映射到不同的渲染目标（如浏览器、移动端等）。
- **核心算法**：
  - `diff` 算法：递归比较新旧虚拟 DOM 树，找到差异并更新真实 DOM。

#### Parser（解析器）
- **功能**：
  - 解析模板中的指令、事件绑定等内容。
  - 将模板转换为 AST（抽象语法树），再生成渲染函数。
- **实现方式**：
  - 使用 `with` 函数执行字符串代码，动态注入上下文。
  - 示例：
    ```js
    const render = new Function(`with(this) { return _c('div', {}, [_s(count)]) }`);
    ```

#### Observer（数据劫持）
- **功能**：
  - 劫持数据对象的属性，监听数据变化。
  - 每个 `Observer` 实例化一个 `Dep` 对象，用于管理依赖。
- **核心方法**：
  - `depend`：添加订阅者（`Watcher`）。
  - `notify`：通知所有订阅者更新。

### 依赖收集与更新流程

1. **初始化阶段**：
   - Vue 遍历组件模板，收集所有观察到的数据表达式（如计算属性、模板中访问的数据属性）。
   - 为每个表达式创建一个 `Watcher` 实例，并将其与组件关联。

2. **渲染阶段**：
   - 在组件渲染过程中，每次访问被观察的数据时，会通知相关的 `Dep` 实例。
   - `Dep` 实例将当前的 `Watcher` 添加到其依赖列表中。

3. **更新阶段**：
   - 当数据发生变化时，`Dep` 实例通知所有依赖的 `Watcher`。
   - `Watcher` 触发组件的更新逻辑（如重新渲染模板中受影响的部分）。

### 具体例子

- [简单响应式系统示例](https://github.com/XingMXTeam/simple-reactivity/blob/master/test.html)
