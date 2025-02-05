---
title: "mobx"
date: 2019-11-25
---
## mobx版本

mobx4
mobx5

## 设计哲学

任何应用程序的状态都应该自动地获取：不需要触发事件 、调用分派程序等
mobx提供机制来存储和更新应用状态供React使用：使用响应式虚拟依赖状态图表，只有在需要的时候才更新而且永远保持最新
简单可扩展： 侵入性小

## 核心概念

可观察的状态：@observable
计算值：

```js
class TodoList {
    @observable todos = []
    @computed get unfinishedTodoCount() {
        return this.todo.filter(todo => !todo.isFinished).length
    }
}
```

反应：

```js
@observer
class TodoListView extends Component {
    render() {
        return <div>
            <ul>
                {this.props.todoList.todos.map(todo =>
                    <TodoView todo={todo} key={todo.id} />
                )}
            </ul>
            Tasks left: {this.props.todoList.unfinishedTodoCount} // @1
        </div>
    }
}

const TodoView = observer(({todo}) =>
    <li>
        <input
            type="checkbox"
            checked={todo.finished}
            onClick={() => todo.finished = !todo.finished}
        />{todo.title}
    </li>
)
```

当点击某个单项的时候， TodoView会强制渲染， 如果unfinishedTodoCount改变 会强制TodoListView渲染（ 而如果删除@1 这一行代码 则TodoListView不会重新渲染
自定义反应： autorun
