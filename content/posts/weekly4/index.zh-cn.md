---
title: "投资日记 #4期：六大核心资产"
date: 2023-08-11
tags:
  - 投资日记 
description: "六大核心资产"
images:
  - weekly4/img1.jpeg
---



你好，我是毛毛星，新的一期周刊来了。

周刊章节顺序做细微调整。因为我的定位是前端编程技术分享。所以第一部分调整为编程技术相关，方便关注我的朋友首先了解这一部分内容。其次我的周刊不止于前端技术，也有我的认知和实践部分，主要是阅读和投资。如果只关注这部分内容的，可以直接跳到指定章节。最后是个人生活杂谈部分，不感兴趣的直接跳过即可。

### 一、本周编程

> “实际工作中，你会发现用react hooks有时候并不能解决复杂的中后台页面交互问题，今天介绍一个方案并引用到工作中，看下是否能解决你的问题？”

今天介绍dai shi大神写的两个前端状态管理库，zustand和valtio。我工作中早期前端领域用redux、dva、react context等管理状态比较多，现在基本都用da shi大神的这两个前端状态库了。

为什么会出现这两个新的状态库？因为旧的状态管理方案多多少少都存在一些问题。针对新人前端开发者，目前就无脑选择这两个就对了。

看zustand github介绍，它提到解决三个问题：Stale Props and "Zombie Children"、多渲染器的Context loss问题、react concurrency导致的问题。它们分别是什么意思呢？

Stale Props是说异步操作完成之前重新渲染，使用了过时的Props Zombie Children是说当异步操作期间重新渲染，导致之前创建的子组件仍然存在于DOM中，即使他们的父组件已经卸载或者更新了。

```js
const ExampleComponent = ({ id }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetchData(id)
  }, [id])    
  const fetchData = id => {
    const response = await fetch(`https://api.example.com/${id}`)
    setData(response.json())
  }
  return <>{data ? <div>{data.description}</div> : <div>Loading</div>}</>
}
```

在异步拉取数据完成之前，如果id再次变化，就会出现`Stale Props` 的问题，使用了过期的id获取了不正确的数据。如果组件被卸载，就可能导致子组件还在DOM中，就会出现`Zombie Children` 问题。问题1/2可以通过`AbortControler` 取消请求解决，问题2也可以通过新的key确保重新渲染时卸载和重新创建子组件。

zustand是如何解决这个问题的？使用了Immer库的不可变性保证使用最新的状态副本来更新状态。也就是说理论上不会使用过时的id发送请求。

```js
const useExampleStore = create((set) => {
 data: null,
 loading: false,
 error: null,
 fetchData: async (id) => {
   set({loading: true})
   try{
     const response = fetch('https://api.example.com/${id}')
     set({data: response.json(), loading: false})
   }catch(error) { set({error, loading: false}) }
 }
})

const ExampleComponent = ({ id }) => {
  const {data, loading, error, fetchData} = useExampleStore(null)
  useEffect(() => {
    fetchData(id)
  }, [id])    
  return <>{data ? <div>{data.description}</div> : <div>Loading</div></>
}
```

什么是多渲染器的Context loss问题？什么是context loss。简单说就是组件被第三方渲染器渲染，但是使用了react的上下文对象。因为组件的三方渲染器无法访问react，所以上下文访问不到。

```js
// App.js (React renderer)
import React from 'react';
import ThirdPartyComponent from './ThirdPartyComponent';

export const MyContext = React.createContext();

const App = () => {
  const value = 'Hello from React';

  return (
    <MyContext.Provider value={value}>
      <ThirdPartyComponent />
    </MyContext.Provider>
  );
};

// ThirdPartyComponent.js (Third-party renderer)
import React from 'react';
import { MyContext } from './App';

const ThirdPartyComponent = () => {
const value = React.useContext(MyContext); // Trying to access React context in a third-party component

return <div>{value}</div>;
};

export default ThirdPartyComponent;
```

什么是react concurrency问题？这个问题是说React在并发模式下可能导致渲染过程中发生突变导致的撕裂，更新被中断或者中途改变，使组件UI显示不一致或者报错。并发模式下，React可能将渲染工作分成多个时间片，并在每个时间片中执行一部分渲染工作。

```js
import React, { useState } from 'react';
const Counter = () => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    // 在渲染函数中直接修改状态
    setCount(count + 1);
    console.log(count); // 这里的 count 可能不是最新的值
  };
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};
export default Counter;
```

zustand还有其他的一些特性，比如可以在react组件外使用store，这个是什么意思呢？就是在react组件外部我们也能获取到store的变化值。

**总结一下：zustand解决了一些之前固有的状态管理方案的问题，包括hooks, react context等等。而且在实现过程中，你会发现它的代码更加简洁易懂，不像hooks这么绕。除非是简单的状态用hooks，复杂的交互联动特别是有异步请求的，建议都用zustand管理。**

valto库是什么？它是基于Proxy对象实现的状态管理方案，和zustand可以理解为是同一个东西，只是使用API不同，看不同人的使用习惯。它和zustand解决问题都是一样的。因为用的不多，所以不多说了。 

zustand使用核心是两点：

1. set方法会自动合并，如果是嵌套对象，需要手动合并下

```js
// 正确
set((state) => ({ count: state.count + 1 }))
// 通过第二个参数，禁止state合并
set((state) => ({ count: state.count + 1 }, true))
// 通过第三个参数，提供状态变更的原因，devtools使用到
set((state) => ({ count: state.count + 1 }, false, '增加count'))
// ...state可以省略，
set((state) => ({ ...state, count: state.count + 1 }))
```

2. selector新概念：zustand有提到selector这个概念，其实它类似Redux的selector或者MobX的computed属性，比如我们有一个store

```js
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;

import useStore from './useStore';

const Counter = () => {
  const count = useStore((state) => state.count);
  const doubleCount = useStore((state) => state.count * 2);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
    </div>
  );
};

export default Counter;
```

第二段代码，我们通过useStore访问store，并且传递进去两个函数，它们就是selector， 通过获取部分状态派生出新的值，而不用访问整个状态树。

如果我们要复用state.count * 2 的逻辑，可以写函数实现，这个实现函数是纯函数（什么是纯函数请自行百度），可以单独测试。

{{<notice type="info">}}
更多的内容，可以自行看文章学习。也欢迎评论区交流。
{{< /notice>}}

### 二、本周阅读

> “继续学习投资相关书籍”

本周读的书籍是《非凡的成功-个人投资的制胜之道》，它出自大卫.F.史文森。其实这个作者我也是第一次认识，高领资本张磊作序推荐。张磊我是听说过的，投资很厉害的一个人物。史文森是耶鲁大学的捐赠基金负责人，20多年时间接近年化17%的年均回报率。可以说相当牛逼了。

{{< img src="img1.jpeg" alt="非凡的成功-个人投资的制胜之道" maxWidth="960px" align="center" caption="非凡的成功-个人投资的制胜之道" >}}

读之前我预期这本书能告诉我一些投资秘诀，解决个人的投资问题。当然这是不可能的，这本书是从美国人角度讲的，我核心学到的就两点：

1. 什么才是核心资产？  
2. 什么才是个人投资的成功之道  

市场提供了赚取收益的三类工具：资产配置、择时交易、证券选择。其中资产配置最为重要，需要保证合理的配比和多元化，然后保持这个配置不变。不要主动择时交易或者证券选择，不要因为股票变化或者个人偏好主动调整比例，因为如果择时交易，基本上都是高买低卖，原则就是要减少操作，低买高卖保证各类资产比例不变。

本书建议的配比的核心资产是： 国内股票30%，国外发达市场股票15%，新兴市场股票5%，房地产20%，美国国债15%，通货膨胀保值债券15%

+ 国内股票：应该做证券选择吗？也就是选择部分股票吗？理论上不应该做证券选择，因为证券选择理论上是一个负和博弈，你购买必然有人卖，加上各种手续费最终的收益是低于市场收益的，除非你能力出众。可以看完之前的周报。有推荐一些识别企业的方法。  
+ 债券： 利率上升时债券价格下跌，利率下降债券价格上涨。票面利率是固定的，但是实际的价格是变化的，可能中间会回购。中国的话，可以购买国债，大银行APP里一般都有。  
+ 国外发达市场：国内可以买美股市场的纳斯达克指数QQQ（费率0.2%）或者标普VOO（费率比率0.03%）。为了多元化，也可购买法国/德国/日本指数基金，比如国内的：法国CAC40ETF（0.5%管理费率和0.15%的托管费），日经225ETF、日经ETF（0.2%管理费率,0.05%托管费）。如果可以，是否能从美股市场购买其他发达国家市场的宽基指数。 购买指数关键是要购买被动管理型基金，而且费率低的。主动型的基金普通人不要考虑。在这个基础上，如果有能力，可以购买大企业股票，比如微软/特斯拉之类的长期看牛逼的好生意模式企业。  
+ 新兴市场：从美国角度，中国属于新兴市场，可购买指数沪深300ETF（管理费0.5%，托管费率0.1%），或者可走和大企业共同成长路线，购买茅台或者腾讯，看个人识别企业能力。  
+ 房地产：当然也是必须配比的。好地段的商业出租，能带来持续稳定的现金流，这个看个人能力情况。  
+ 通货膨胀保值债券：这个国内没有，我找到一个美国国债0-5年ETF，是跟踪美国国债通货膨胀保值证券（TIPS）的指数，期限是不到5年的，费率是0.04%。还有一个方案是：黄金实物或者黄金矿业公司的股票（山东黄金）/ETF（黄金ETF，管理费是0.5%，托管费是0.1%）。  

什么才是个人的成功之道？执行多元化、被动管理型、偏重股票的投资组合。抛弃主动性基金，因为主动基金和个人投资者不符合管理人和个人的共同利益，选择指数。指数当中要选择税收低、管理费低的被动管理型，警惕ETF，有些ETF也不是那么的好。股票的投资收益都高于债券和现金的收益率，所以偏重股票。但是股票可能会股灾，所以多元化很重要，多元化下不做择时交易和证券选择。

还有一些资产类比，比如bitcion和Ethereum等加密货币，甚至于cionbase加密货币交易所股票，LMT军火交易商的股票，XLK美国科技行业ETF等等，我都不认为是核心资产，存在较大甚至非常大的风险。当然还有保险，这个水很深，不太理解。包括期权交易（注意区别期货）套利等等。

另外，本书介绍了很多美国的其他非核心资产类别，对美国的各类资产类别做了想起的对比和分析，看着有点枯燥，但是确实挺有用。本着实用主义，这里不过多介绍，感兴趣可以看下书。

最后看一个问题：
作为中国人有哪些其他核心资产类别可供选择？资产配置比例怎么做是符合预期？  
评论区可以附上你的解答，下期我会给出我的答案。  

### 三、本周投资

> “本周无交易，中签岱美转债10。”

本周末出去玩耍，南麂岛沙滩和三盘尾还是很美的。俯卧撑2组，其他运动无。目前体重67.7kg(170cm)。

{{< img src="img2.jpeg" alt="南麂岛沙" maxWidth="960px" align="center" caption="南麂岛沙" >}}

感谢阅读，希望你今天有收获！

{{<notice type="info">}}
主理：毛毛星的前端思考。
全网同名，目前有公众号，B站，YouTube也有尝试开始分享一些视频，欢迎关注。
{{< /notice>}}