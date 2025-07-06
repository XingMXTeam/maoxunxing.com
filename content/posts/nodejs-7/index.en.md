---
title: "Node.js Dependency Injection"
date: 2025-03-25
tags:
  - nodejs
---
1. Generation of Type Metadata
When the `emitDecoratorMetadata` option is enabled during TypeScript compilation, three types of metadata are automatically generated for decorated classes (however, JavaScript does not have this step as it lacks static compilation):
- `design:type`: The type of the property/method
- `design:paramtypes`: An array of parameter types for the method/constructor
- `design:returntype`: The return type of the method
This is possible because TypeScript compilation automatically adds the metadata.
2. The framework can retrieve the list of parameter types via `Reflect.getMetadata('design:paramtypes', TargetClass)`, then recursively instantiate each dependency, and finally construct the target class:
```js
class Container {
  resolve<T>(target: Constructor<T>): T {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const deps = paramTypes.map((Type) => this.resolve(Type)); // Recursively resolve dependencies
    return new target(...deps);
  }
}
// Assume UserService depends on Database and Logger
class UserService {
  constructor(db: Database, logger: Logger) {}
}
// Internal behavior of the dependency injection framework:
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService); // Gets [Database, Logger]
const dependencies = paramTypes.map(Type => new Type()); // Recursively instantiate Database and Logger
const userService = new UserService(...dependencies); // Finally construct the target class
```
Automate the above process using decorators
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
What is coupling? This is coupling
```js
// Common dependencies
import { A } from './A';
import { B } from './B';
class C {
  constructor() {
    this.a = new A();
    this.b = new B(this.a);
  }
}
```
How to decouple? Achieve automatic instantiation through a container
```js
// Using IoC
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
this.ctx.requestContext.getAsync('testService') // Get the injected service. This is the IoC request scope container for Midway FaaS, used to get object instances from other IoC containers.
```
More references: 
- https://midwayjs.org/docs/1.0.0/injection
- https://jkchao.github.io/typescript-book-chinese/tips/metadata.html#%E4%BE%8B%E5%AD%90
