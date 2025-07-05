---
title: "Responsive Programming"
date: 2019-11-25
tags:
  - Reactive Programming
---

Without Reactive Programming:

class Calculator {
sum(a, b) {
```javascript
        return a + b;
class Receipt {
    constructor(calculator) {
    }
}
this.calc = calculator;
    print(itemA, itemB) {
        const total = this.calc.sum(itemA, itemB);
    }
        console.log(`total receipt £${total}`);
const pizza = 6.00;
const beer = 5.00;
    }
}
const calc = new Calculator();
const receipt = new Receipt(calc);
receipt.print(pizza, beer);
Using responsive design:

class Calculator {

```
    constructor(itemA, itemB) {
const obs = Rx.Observable.of(itemA, itemB);
        const sum$ = obs.reduce((acc, item) => (acc + item));
```javascript
        return {
            observable: sum$
}
class Receipt {
    constructor(observable$) {
        observable$.subscribe(value => console.log(`total receipt: £${value}`))
const pizza = 6.00;
    }
}
const beer = 5.00;
const calc = new Calculator(pizza, beer);
const receipt = new Receipt(calc.observable);
    }
}
## Programming Paradigms

1 Imperative Programming

const JEANS = 80.00;

const SHIRT = 35.00;
```
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
const calc = new Calculator();
const receipt = new Receipt(calc);
```javascript
receipt.print(JEANS, SHIRT, SHOES, COAT, HAT); //"total receipt £456.28"
2 Functional Programming

+ Pure functions: Whatever input, they always output the same; No side effects

+ Immutable data structures: Do not change the original object

The original array has changed:
const originalArray = [1, 4, 8, 12];

for(let i = 0; i < originalArray.length; i++){
originalArray[i] = originalArray[i] + 1;
```
console.log(originalArray) //[2, 5, 9, 13]
The original array remains unchanged:
const originalArray = [1, 4, 8, 12];
const finalArray = originalArray.map(value => value + 1);

console.log(finalArray); //[2, 5, 9, 13]

+ State management: Redux
+ Higher-order functions: Functions as parameters, returning a new function
More focus on behavior rather than implementation
```javascript
class Calculator {

    getTotal(...items) {
        const total = items.map(::this.addVAT)
}

.reduce(this.sumElements);
```
        return total;
    addVAT(itemValue) {
        return itemValue + this.calculateVAT(itemValue);
```javascript
calculateVAT(value) {
        const VAT = 22;
        return value * VAT / 100;
```
    sumElements(accumulator, value) {
return accumulator + value
class Receipt {
    print(total) {
        console.log(`total receipt £${total.toFixed(2)}`);
```javascript
const JEANS = 80.00;
const SHIRT = 35.00;


const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
    }
const calc = new Calculator();
const receipt = new Receipt();
    }
receipt.print(calc.getTotal(JEANS, SHIRT, SHOES, COAT, HAT));
3 Reactive Programming
Reactive programming is a programming paradigm based on asynchronous data streams that change within the lifecycle
    }
Reactive to imperative:
class Calculator {
    }

}
constructor() {

        this.VAT = 22;

    sum(items) {
        const items$ = Rx.Observable.from(items);
const total$ = items$.map(value => value + (value * this.VAT / 100))
    }
}
            .reduce((acc, value) => acc + value);
        return total$;
class Receipt {
constructor(calculator) {
        this.calc = calculator;
    print(...items) {
        const total$ = this.calc.sum(items);
total$.subscribe(total => console.log(`total receipt £${total})
```
toFixed(2)}`));
const JEANS = 80.00;
const SHIRT = 35.00;
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
```javascript
const calc = new Calculator();
const receipt = new Receipt(calc);
receipt.print(JEANS, SHIRT, SHOES, COAT, HAT);
    }
Convert from responsive to functional:
class Calculator {
getTotal(...items) {
        const items$ = Rx.Observable.from(items);
        const total$ = items$.map(item => this.addVAT(item))
    }

}

            .reduce(this.sumElements);
return total$;
    addVAT(itemValue) {
    }
        return itemValue + this.calculateVAT(itemValue);
    calculateVAT(value) {
const VAT = 22;
        return value * VAT / 100;
    }
}
    sumElements(accumulator, value) {
        return accumulator + value
class Receipt {
    print(total$) {
        total$.subscribe(total => console.log(`total receipt £${total.
toFixed(2)}`));
const JEANS = 80.00;
const SHIRT = 35.00;
```
const SHOES = 90.00;
const COAT = 140.00;
const HAT = 29.00;
```javascript
const calc = new Calculator();
const receipt = new Receipt();
receipt.print(calc.getTotal(JEANS, SHIRT, SHOES, COAT, HAT));
## When to Use Reactive Programming
1 Financial reports and other strongly data-driven applications
2 Real-time applications requiring large amounts of data to be processed asynchronously
    }
Microsoft and Google are also driving reactive programming: for example <http://reactivex.io/>
## How to Make Your Application Responsive
    }
# Framework Comparison

Difference Between Framework and Design

Framework: How different elements interact, such as how the M and V layers interact
    }

Design: Choose specific libraries, algorithms, or design patterns

![Framework Timeline](index_files/da76ac5b-e0be-4a5a-98a5-4696eaa753b1.jpg)

    }

}
## MVC
### How MVC works
The relationship between controller and view can be one-to-many

The relationship between controller and model can be one-to-many

    }

}
The controller depends on the model, listens to events thrown by the view, and calls the model to process.

Model and view have no direct association, mainly used to store the state of the program, should be responsible for processing data, and expose APIs for external calls.

When the program state changes or data is updated, the model should trigger an event.
The view depends on the model, listens for events thrown by the model, displays data, and listens for user actions.

## MVP

![MVP](index_files/c5a0df4a-9cb4-4671-b435-d24be4de988c.png)

The view cannot feel the Presenter. The model and view cannot feel each other more.

The Presenter is used to control behavior.

```

The advantage of MVP is that when we need to reuse the views layer or behavior.
It focuses more on modularity and the frontend.

The differences between MVP and MVC are:
1 MVP has an presentation layer (Presenter) that replaces the control layer
2 view and presenter have a 1:1 relationship
3 When we design, we consider the view to be variable, making the view more reusable. For example, we may have different devices but need different UI presentations.

### How does MVP work

The presentation layer retrieves all the data needed by the view layer from the model and passes it to the view. It also needs to handle user interaction behaviors and update the model.

The view layer contacts the presenter through an injected method.

MVP is better than MVC.

## MVVM

MVVM is a pattern created by Microsoft in 2005 to address GUI management in WPF.
![MVVM](index_files/07d5041f-11c1-484a-99a3-3979ebb6de9a.jpg)

### How MVVM Works

The data in the view-model layer is prepared for the view layer, and its logic is tightly coupled with what the view layer needs to display. For example, if we need to display euros, our currency must be converted to the euro format.

The relationship between view-model and view is one-to-many.

In MVVM, the view layer and model layer must also be completely isolated.

The view-model listens to events from the view layer and triggers an event to update the view layer.

## Angular

Angular started around 2010; it is an open-source and maintained by Google.

In 2017, a new version was released, providing a complete ecosystem; its second version adopted TypeScript as the primary language.

Angular has four concepts:
1 Dependency Injection
2 Modularization of NgModules and Components
3 Template and Component Data Binding
4 Defining Component and Module Decorators

Angular modules must explicitly declare the dependencies of components. Components declare the dependencies of services.

There must be at least one root-module.

Decorators wrap a function.

Methods or properties added by decorators should be shared across the project at runtime, which is why decorators are used so frequently. This allows us to implement certain functionalities without inheriting from base classes, thereby establishing a connection with the framework's internal functionality.

Angular components are seen as a bridge between the template system and REST APIs. They provide data to templates through a binding system. Components are a collection of properties.
1 Components update the view through binding
2 The relationship between components and templates is one-to-one
3 Components handle all user interactions

@Component({
selector: 'app-root', // as an id
templateUrl: './app.component.html',
styleUrls: ['./app.component.css'],
providers: [UpdateTotalService, CalculatorModel]//Dependency injection, CalculatorModel is not used by the component, but if the service uses it, it must be written here.
})
export class AppComponent implements OnInit {
  onScreenKeyboard = ON_SCREEN_KEYBOARD;

total:string;
  constructor(private updateTotalService:UpdateTotalService){}
  // Called on initialization
  ngOnInit(): void {

this.total = this.updateTotalService.reset();

Service is used to fetch data from the server or to fetch and pass data to the model.
## React&&Redux
Redux primarily consists of three parts:
1 Actions
2 Reducers
3 Stores

Actions is a JavaScript object.

Reducers are primarily used to update the state.

Stores pass the state toReducers, and afterReducers return the new state, the state tree is updated and notified to all listeners.
Redux is based on the following points:
1 The application state is stored in a singleton object called Store.
2 The state is readable, and changing the state can only be done through actions
3 Modifications are made in a pure function manner. Reducers are pure functions.
### How Redux Works
![redux](index_files/bd5f45ea-dce9-493b-80b0-70089bc8f6d5.png)
# Reactive Programming
An observable is an object that contains some data and can be subscribed to (consumed) by an observer. Once instantiated, it provides a cancellation function.
An observer is an object that can obtain data from an observable. It provides three methods: next, error, complete
Observer pattern (Pub/Sub subscription pattern)

Iterator Pattern:

![Iterator Pattern](index_files/d29969f6-0898-4e24-a21b-cf601475f5c9.jpg)

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators#Iterators>

Specific code examples:

const observable = Observable.range(1, 10);

const observer = observable.subscribe(onData, onError, onComplete);
function onData(value){
    console.log(value);
function onError(err){

    console.error(err);

function onComplete(){
    console.log("stream complete!");
## Rx.JS
Rx.JS is integrated into Angular2. Rx.JS can be used in front-end applications or Node applications.
import Rx from "rxjs"
const data = [1,2,10,1,3,9,6,13,11,10,10,3,19,18,17,15,4,8,4];
const onData = (value) => console.log(`current sum is ${value}`);
const onError = _ => console.log("stream error");
const onComplete = _ => console.log("stream completed");
const obs = Rx.Observable.from(data)
.filter(value => value % 2 === 0)
                        .distinct()
                        .reduce((acc, value) => acc + value);

obs.subscribe(onData, onError, onComplete);

Each time through conversion (such as filter), a new observable is generated. All data flows internally and cannot be modified externally.

import Rx from "rxjs";
const URL = "https://jsonplaceholder.typicode.com/users";
const simplifyUserData = (user) => {
return {
```
        name: user.name,
        email: user.email,
        website: user.website
const intervalObs = Rx.Observable.interval(1000) // Every 1 second
.take(2) // Execute 2 times
.mergeMap(_ => fetch(URL))
```

.mergeMap(data => data.json())

```javascript
.mergeAll()
                                .map(simplifyUserData)
intervalObs.subscribe(user => {
    console.log(`user name is ${user.name}`);
console.log(`user email is ${user.email}`);
    console.log(`user website is ${user.website}`);
    console.log('------------------------------');
},
error => console.error("error", error),
  }
}
```
complete => console.log("completed"))
1 Rx.JS can recognize Promise
2 MergeMap is an operator that typically does two things. The first thing is to merge two streams into one, and the second is to iterate through it. Here it returned a stream.
3 mergeAll is typically used to merge all observables. Here, it returns a single value through iteration rather than the entire array.
## Hot and Cold Observables
Cold observables are single-rooted, only changing values upon subscription. The producer in the observable generates a new producer each time it is subscribed to.
Hot observables are multicast, requiring no triggering; the producer is unique and shared.
cold:
import Rx from "rxjs";
// Generates a value every 2s, starting from 0 and going to infinity, with continuous values. Does not break. No specified number of triggers.
// startWith shows an initial value or triggers an event without waiting for an asynchronous event to come back.
const source = Rx.Observable.interval(2000).startWith(123)

source.subscribe(value => console.log("first observer", value))
setTimeout(_ =>{
    source.subscribe(value => console.log("second observer", value))

}, 5000);

setTimeout(_ =>{
    source.subscribe(value => console.log("third observer", value))

}, 8000)

hot: Immediately trigger value
import Rx from "rxjs";
// Returns a ConnectableObservable object
const source = Rx.Observable.interval(2000)
.startWith(123)
                            .publish()
                            .refCount(); // 不控制开始和结束 其他方法：multicast connect
source.subscribe(value => console.log("first observer", value))
setTimeout(_ =>{
    source.subscribe(value => console.log("second observer", value))
}, 5000);
setTimeout(_ =>{
source.subscribe(value => console.log("third observer", value))

}, 8000)

Rx.js is default cold observable. XStream is hot, it doesn't use observables and observers, but rather the concept of streams and event triggering, including multiple listeners. Listeners contain next, error, complete methods. Streams are like observables, and listeners are like observers.
```javascript
Others: Most.js\IxJS\Kefir\FlyD\Bacon.js
import xs from 'xstream';
const data = [1, 2, 10, 1, 3, 9, 6, 13, 11, 10, 10, 3, 19, 18, 17, 15, 4, 8, 4];
const filterEven = (value) => value % 2 === 0;
}

const removeDuplicates = (inputStream) => {
const buffer = [];
}
    const outputStream = xs.fromArray(buffer);
    inputStream.addListener({
}
```
        next(value) {

if (buffer.length === 0 || buffer.indexOf(value) < 0)

                buffer.push(value);

        }
    })
```javascript
return outputStream;
    const sumValues = (acc, value) => acc + value;
    const listener = {
        next(value) {
console.log(`current sum is ${value}`);
    },
    error() {
        console.error("stream error");
},
    complete() {
```
        console.log("stream completed");
const stream = xs.fromArray(data)
.filter(filterEven)
```javascript
    .compose(removeDuplicates)
    .fold(sumValues, 0);
stream.addListener(listener);
## back pressure
const stockValuesProducer = Rx.Observable.interval(50)
                                         .map(value => { return (Math.random() * 50 + 100).toFixed(2)});
return stockValuesProducer.sampleTime(500);
    }
}
# One of the reactive frameworks: Cycle.js
Message passing architecture, communicates through streams, strong encapsulation, well-isolated.
Three key concepts:
1 Pure functions
2 Streams
3 Drivers

import xs from 'xstream';

import {
run
} from '@cycle/run';

import {
    makeDOMDriver,

p

} from '@cycle/dom'

```
const main = sources => {
    const sinks = {
DOM: xs.periodic(1000).map(v => p(`seconds: ${v}`))

    return sinks;
const drivers = {
    DOM: makeDOMDriver('#app')
};
run(main, drivers);
Implementing Virtual DOM with Snabbdom
More->Keywords:
+ React-less Virtual DOM with Snabbdom
+ Snabbdom JSX
```javascript
Anything can be a stream in reactive programming
## MVI (Model View Intent Architecture)
A better architecture than Redux and Angular
It adopts a unidirectional data flow (a must-have feature for many front-end frameworks)
![flux](index_files/07a7e882-0728-4c1b-9403-58bca39190af.png)
Stream input Another stream output
1 model: Handles user interaction and saves state
2 view: Displays UI
3 intent: Subscribes to user interaction, then gives to model
![mvi](index_files/d3e81965-bcc4-4c29-bba9-ead1b232bbc4.png)

1 Each part can be reused and tested independently
```

2 With streams, it becomes more flexible and focuses on separation of concerns
3 Each component can use the MVI architecture

## State management in circle.js

```javascript

Onionify

The state of the application is managed internally by Onionify, where each component can manage its own state and the state of its parent components through reducers
Library: isolate for component isolation

Onionify is not a driver but a wrapper

Can combine multiple streams of components to form more complex program states.
# Responsive Framework Two Mobx
In non-responsive programming, we want to update the state. We manually change certain parts of the model and update the views. This leads to coupling.
Keywords:

1 Observables
2 Computed Values
3 Reactions

4 Actions: The only way to update state

5 Observers

More content: Keywords:

```

+ In-depth explanation of MobX

+ Fundamental principles behind MobX

## The First Mobx and React Program

Focus on:

+ How data flow is managed in the program
```javascript
+ How to handle user interaction
+ How to handle requests
+ How to manage program state
@observer: When the state changes, automatically call the render method

Provider: Provides context, allowing any component to access the store

store and view have a one-to-one relationship
![data-flow](index_files/2da29785-0b6c-4bbb-83be-fbbe14797f4c.png)

Library: mobx-state-tree

# SAM (State-Action-Model)

}
    }
}
```

```javascript
```

```javascript

    }

}

```