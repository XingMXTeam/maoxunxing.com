---
title: "React事件深入研究"
date: 2019-11-25
---

## React中事件的简单使用

1 React的事件名是驼峰命名
2 在jsx文件中，需要传递一个函数而不是字符串作为事件处理函数

```
class Hello extends Component {
  clickHandler(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }

  render() {
    return (
      <div>
        <button onClick={this.clickHandler}>点我</button>
      </div>
    );
  }
}

export default Hello;
```

3 阻止默认行为，必须调用 e.preventDefault 不能通过return false处理
4 事件对象e不是原生的事件对象，而是React的合成事件对象
5 clickHandler方法的this指向undefined
如果要指向Hello，有多种处理办法：
办法1：

```
...
<button onClick={this.clickHandler.bind(this)}>点我</button>
...
```

办法2：

```
...
  clickHandler = (e) => {
    e.preventDefault();
  }
...
```

办法3：

```
...
<button onClick={(e) => this.clickHandler(e)}>
   点我
</button>
...
```

传递参数给事件处理函数，比如我们要传一个ID给clickhandler函数：

```
...
<button onClick={(e) => this.clickhandler(this.id, e)}>Delete Row</button>
<button onClick={this.clickhandler.bind(this, this.id)}>Delete Row</button>
..
```

## React的合成事件对象

合成事件对象有如下属性：

```
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

事件处理函数结束后，无法通过异步方式获取合成对象的相关属性值，因为React出于性能考虑，会把所有的属性值都会置为null：

```
...
  clickHandler(id, e) {
    e.preventDefault();
    console.log("The link was clicked.");
    console.log(id);
    setTimeout(function() {
        console.log(e.bubbles);//输出null
    }, 0);
  }
...
```

如果需要保持属性不被置为null，可以手动调用：e.persist()

```
...
  clickHandler(id, e) {
    e.preventDefault();
    console.log("The link was clicked.");
    console.log(id);
    e.persist();
    setTimeout(function() {
        console.log(e.bubbles);//输出true
    }, 0);
  }
...
```

如何支持捕获阶段触发事件：只需要在onClick后面加上Capture，即onClickCapture
