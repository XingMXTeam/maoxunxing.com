---
title: "成功日记#21期：期权是什么？"
date: 2024-02-24
tags:
  - 成功日记
description: "期权不是期货，我们买房子买车会有保险，期权就是你买股票的保险，期权也是你获得高收益的杠杆工具。"
images:
  - weekl6/cover.jpg
---

{{< img src="cover.jpg" alt="bg" maxWidth="960px" align="center">}}

这篇文章主要是期权理论学习。 仅供参考。 期权不是期货，我们买房子买车会有保险，期权就是你买股票的保险，期权也是你获得高收益的杠杆工具。

## TL;DR 

+ 期权不是期货。是一种风险对冲工具，而不是投机工具。
+ 买方期权: 是一种保险, 能投资者在股票上涨时以优惠价购买股票。 
+ 卖方期权: 下跌趋势，获得以某个价格卖出股票的权利。 long put就是卖保险，表示未来可以以某个价格买入。
+ 购买买方期权也叫做看涨期权(buy call)，反之叫sell call
+ 购买卖方期权也叫看跌期权（buy put），反之叫sell put
+ 看涨就买Call， 看跌就买Put
+ long call或者long put可以得到权利金：假如你买入买方期权也就是（short call), 因为你可以有优惠价购买股票，你需要付出权利金。假如你卖出卖方期权也就是（long put)，因为未来你有购买股票的义务，你会立即收到权利金。
+ 期权可以是一种博高额收益的杠杆（当买卖期权时成本价格很低，但是1张期权等于100股正股，期权可以涨很多倍。杠杆倍数=股票价格/权利金价格 * Delta），也可以是”反向“期权交易获得稳定收益的保险（作为正股的辅助，也就是当股票波动时可以获得补偿）
+ 期权未到期但是已经到行权价，也不一定会被行权。到期后肯定会行权或者作废。 
+ 大部分资金在正股之上，可以通过周维度的short call赚取权利金。 
+ 小部分资金通过long put购买看好公司比如科技股或者你了解行业的公司，周期至少3-6个月甚至一年。 剩下的资金买ETF(比如sqqq)对冲多头。

## buy call（short call）
### 市场走势往上，可以用买方期权来作为保险，赚波动上涨的钱（收益率高，最大风险是失去保证金但是盈利无限，适合老手）

假设现在每股价格是50美元，你购买每股期权1美元的买方期权100股（buy call, 未来可以以每股50美元的价格购买100股股票）。

1个月后，股价上升到每股60美元。这个时候你有两个选择：

1、行权：先前的买方期权技术上允许他以每股50美元的价格买进100股。如果他那样做了就是行权，可以以每股60美元的价格卖掉100股，可以获得900美元收益（1000美元收益-100美元期权成本）

2、出售期权(sell call)：选择出售期权，每股获得10美元，100股获得了1000美元，获得900美元收益（1000-100美元期权成本）

如果股价仍然是50美元或者更低，这个期权就会终止，或者就像成熟投资者所说的那样：“期权价外状态。”

你应该选择哪个方式。理论上会选择2：选择1用5000美元赚了900美元，在一个月内收益率是18%。选择2用100美元赚了900美元，投资回报率为900%

注意点：
1、波动iv在60以下, 避免波动太大被行权。我们的目的不是被行权。 
2、注意时间损耗(假设3月份会到目标价位，至少要选择4月份到期call， 不要选择末日call)

## buy put(short put)
### covered call。市场走势往下，可以用卖方期权，保护股票的价值（收益稳定、风险低、新手最爱）

假设股票价格是每股50美元。如果股市走低，股价跌到40美元。普通投资者每股就会损失10美元。如果**他持有100股(这里也是你手头有股票）**，账面损失就是1000美元。当然这只是账面损失，并不是实际损失。如果以每股40美元抛售，那么他就真正损失了1000美元。如果你以每股期权1美元的价格购买一个卖方期权(buy put)，获得以每股50美元卖出股票的权利。购买100股股票的卖方期权，总共花掉了100美元。

如果股市持续走低，股价跌到了40美元。这个时候

1、可以行权：以每股50美元的价格卖出100股股票，得到5000美元。然后就会去股市以每股40美元的价格买回100股，总共用去4000美元。结果，他仍然拥有100股股票，还有900美元收益（1000美元扣除先前购买期权的费用）。

这个本质上是对冲思想。 选择那些你认为会涨的股票，但是短期有一些小波动。

## sell call(long call)
### Covered Call Wrting: 备兑卖出看涨期权。股票价格半死不活或者想要获利了结 （套期保值,收益率中，风险是失去权利金）

使用已经拥有的股票做担保（**因为要持有股票所以成本高**），可以向其他人卖出一个看涨期权，这种周一long call，周五收权利金（如果被迫行权，可以在周四提前一天买回来止损）。本质也是对冲。 

如果股价下跌非常厉害怎么办？权利金无法cover住。这个时候可以买入一张虚值（OTM）的看跌期权(也这个过程称为：long put， long是买入的意思) ，这样就可以构造出领口期权（collar， 是一种组合期权) 。也就是买入一张行权价更低的put对冲风险。

注意点：
1、波动不要太大，我们不希望行权，只是为了赚权利金。（最好选择在某个区间横盘调整的股票）假设每周操作每张赚0.5-1，每周10张，就是10*100*0.5=500$，一年净赚2万。**注意不要裸卖call，暴涨的会亏比较多，如果不是裸卖就被行权卖出股票也是ok的**

## sell put(long put)
###  Cash-secured naked put wrting 卖出现金担保的看跌期权。有现金担保的裸卖，赚市场趋势下降的钱（收益率中、风险是超卖要有足够的现金、老手期使用）

卖出想要持有公司股票的看跌期权（long put），然后选择愿意支付的股票价格作为期权的执行价格。**我们可以立马收到这张期权的权利金**，以换取未来以约定价格购买正股的义务。如果购买者不行权，就不用购买该股票，但是可以保留权利金作为收益。

注意：
买大体量股票（股价不易被操纵）。Delta选择0.3左右。

## 组合期权之Spread（价差期权）
### Bear call spread: 熊市看涨价差期权，主要在熊市看空市场使用的策略
在Short call（Short是买入的意思）的同时，Long更高行权价的Call。

Short和Long的Call之间会形成正资金流入（Credit Spread），相反的就是Debit Spread(资金净流出）


比如我们上面的例子周一卖Call（使用Covered Call Wrting）赚点权利金。假设股价大涨，股票终于解套了，我们直接行权卖出股票了。所以我们这个时候就不能裸卖call了。 

假设我们认为这个股票本周不太可能继续涨了，本周会有回撤（相对最高点220）。看空。

1、首先卖210行权价的call（行权日为周五），当场会收到权利金（因为你long call),
2、然后买入同时间更高执行价的call，比如215元。 需要付出权利金（因为你short call）
1和2操作后，可以净赚权利金。

到行权日假设股价按照我认为的那样没有继续涨了，也就是没有超过210。期权都作废，都不用行权。

如果股价继续涨，也就是到达230。那么我的那张short call因为被迫行权（需要卖出股票），一张期权亏（230-210=20）元，假设我买了5张。 亏5 * 20 * 100=10000元。那张long put赚 230-215=15元。5张就是75 * 100=7500元。也就是周一操作当天亏2000元。（**如果没有做spread那么周一亏损就是1万元，这就是裸卖的结果**）

Spread可以降低玩期权的风险，最大收益基本在两个不同行权价期权之间的权利金的差值。使用这个策略，可以在本金不够的时候每周赚权利金，前提是你要能预判正确。

相反的就是bull put spread（牛市看跌价差期权）， 在牛市看多市场的时候使用，short put的同时long更低行权价的put。 


## 段永平sell put操作解析

12月5日，段永平发动态说计划再卖些阿里巴巴的put，同时分享了张确认订单页面截图。行权日（250117），行权价接近市价，成交概率很大，基本可以理解成愿意以70美金的正股价格买入阿里巴巴。（忽略权利金）

大家经常把 sell put 比做卖保险，是非常形象的比喻。大道sell put，就像是保险公司。

而那些buy put的人，就像投保人。投保人买入保险，在保期内，除非遭遇损失，不然是不会去找保险公司的。除非阿里巴巴价格跌过70美金，否则肯定也不会考虑行权的。

**但是即便阿里巴巴跌过了70美金，他们也不一定会行权**。因为一份PUT期权的价格，主要由两个组成部分构成：
1、一个是内在价值：即期权的执行价（70美金）与市场价格之间的差额。
2、一个是时间价值：这个时间价值不好理解，大家可以理解成保险的有效期。

保险内容不变，一个保险的有效期越久，这个保险就越贵。而快到期的保险，价值接近归零。期权也是一样的道理，时间价值会随着到期日的临近而减少。但是需要明确的是，我们购买的保险的时间价值是线性降低的。比如花了100块钱买了价值1000万的一年航空险，可以计算出每天的保费是2毛七。但是期权的时间价值并不是线性降低的。这是非常不同的一点。所以即便是阿里的股价已经跌破70的执行价格，假设已经50美金了，**因为这份期权的到期日比较久，所以人们即便垂涎这20美金的差价，想要收入囊中，他们通常也不会行权**。

因为这样虽然20美金的内在价值赚到手了，但是期权的时间价值等于白白抛弃了。所以更为常见的做法是，想要落袋为安的人，会选择将自己持有的这份 put卖出，在这个卖出价格中，既可以体现出期权的内在价值（20美金），也可以体现出期权的时间价值（比如3美金），这样就可以实现利润最大化。

这样的话，段永平卖出的这份期权，只是在不同的人手中不停流转，A卖给了B，B又卖给了C，只要时间价值还很明显，大概率不会有人提前行权的。

**如果到期日的阿里股价低于70美金（假设是40美金），因为即便阿里市价只有40美金了，但是行权是可以以70美金的价格卖给段永平的，所以大家都会行权。**

如果段永平基于阿里巴巴的未来现金流折现情况，认为阿里巴巴目前的价格低估了，但是对于未来阿里巴巴的现金流能不能提振也没有非常强的信心。通过这样的期权交易策略，是不是可以实现利益最大化？


我们假设段永平卖出了1199手 BABA 20250117 70.0PUT。按照70美金的价格折算，这119900股BABA大约是839万美金。也就是说，在2025年1月17日前，如果阿里巴巴股票急跌，大量买put的用户行权的话，段永平需要随时可以拿出来839万美金来接盘这1199手70美金价格的阿里巴巴
所以他在卖出这些期权后，按照1手期权获利865美金算，可以一次性获得104万美金收益。

按照段永平的操作风格，他大概率会把这839万美金买国债，来准备随时接盘，也就是准备了100%的保证金。但即便按照100%的保证金，这839万美金买国债的利息，以及一次性获利的104万美金，到了2025年1月17日，回头来计算下年化收益，也能有18%左右。


## 术语

+ Option：期权
+ Call: 看涨
+ Put: 看跌
+ Spread: 价差
+ Long: 买入
+ Short: 卖出
+ Credit: 权利金净流入
+ Debit: 权利金净流出
+ Strike Price: 行权价
+ Premium: 溢价
+ ITM：in the money
+ OTM：out of the money
+ ATM: at the money


