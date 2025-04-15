---
title: "Node.js 依赖注入"
date: 2025-03-25
tags:
  - nodejs
---

1、类型元数据的生成

TypeScript 编译时若启用 emitDecoratorMetadata 选项，会自动为被装饰的类生成三种元数据（但是js没有静态编译，所以没有这个步骤）：

- design:type：属性/方法的类型
- design:paramtypes：方法/构造函数的参数类型数组
- design:returntype：方法返回值类型

正是因为Typescript编译自动加上了元数据。

2、框架通过 Reflect.getMetadata('design:paramtypes', TargetClass) 可获取参数类型列表，然后递归实例化每个依赖项，最终构造目标类：

```js
class Container {
  resolve<T>(target: Constructor<T>): T {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const deps = paramTypes.map((Type) => this.resolve(Type)); // 递归解析依赖
    return new target(...deps);
  }
}

// 假设 UserService 依赖 Database 和 Logger
class UserService {
  constructor(db: Database, logger: Logger) {}
}

// 依赖注入框架内部行为：
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService); // 得到 [Database, Logger]
const dependencies = paramTypes.map(Type => new Type()); // 递归实例化 Database 和 Logger
const userService = new UserService(...dependencies); // 最终构造目标类

```

通过装饰器自动化上面的过程
```js
@provide()
export class UserService {
  @inject()
  userModel;

  async getUser(userId) {
    return await this.userModel.get(userId);
  }
}
```


耦合是什么？ 这就是耦合
```js
// 常见的依赖
import { A } from './A';
import { B } from './B';

class C {
  constructor() {
    this.a = new A();
    this.b = new B(this.a);
  }
}
```

怎么解耦 ？通过容器自动实现实例化

```js
// 使用 IoC
import { Container } from 'injection';
import { A } from './A';
import { B } from './B';
const container = new Container();
container.bind(A);
container.bind(B);

class C {
  constructor() {
    this.a = container.get('a');
    this.b = container.get('b');
  }
}
```

```js
this.ctx.requestContext.getAsync('testService') // 获取注入的服务 midway faas 的 IoC 请求作用域容器，用于获取其他 IoC 容器中的对象实例。
```


更多参考： 
- https://midwayjs.org/docs/1.0.0/injection
- https://jkchao.github.io/typescript-book-chinese/tips/metadata.html#%E4%BE%8B%E5%AD%90