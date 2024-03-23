---
title: "Success Diary #21: What are options?"
date: 2024-02-24
tags:
  - Success Diary
description: "Options are not futures, we buy houses and cars will have insurance, options are the insurance you buy stocks, options are also a leveraging tool for you to get high returns."
images:
  - weekl6/cover.jpg
---

This article focuses on option theory learning. For reference only. Options are not futures, we buy a house and a car will have insurance, options are the insurance you buy stocks, options are also a leverage tool for you to get high returns.

## TL;DR 

Options are not futures. It is a risk hedging tool, not a speculative tool.
+ BUYER'S OPTION: An insurance policy that enables an investor to buy a stock at a discounted price when the stock is rising. 
+ Seller's Option: Downtrend, the right to sell a stock at a certain price. A long put is an insurance policy that you can buy at a certain price in the future.
+ Buy call is also called a call, and the opposite is called a sell call.
+ Buying a seller's option is also called a put, and the opposite is called a sell put.
+ Call for calls and Put for puts.
+ long call or long put can be paid for: if you buy a buyer's option (short call), you pay a premium because you can buy the stock at a discounted price. If you sell a seller's option, which is a long put, you receive the premium immediately because you are obligated to buy the stock in the future.
+ Options can be a kind of leverage for high returns (when buying and selling options the cost price is very low, but 1 option is equal to 100 shares of stock, options can go up many times. Leverage = stock price/premium price * Delta), or it can be an insurance policy for a stable return on a "reverse" option trade (as an adjunct to the underlying stock, i.e. to compensate for stock fluctuations).
+ An option that has not yet expired but has reached the strike price will not necessarily be exercised. It will definitely be exercised or voided upon expiration. 
+ Most of the money is above the underlying stock and can earn royalties through short calls in the weekly dimension. 
+ A small portion of the money buys bullish companies like tech stocks or companies you know the industry through LONG PUT with a cycle of at least 3-6 months or even a year. The rest of the money buys ETFs (e.g. sqqq) to hedge long positions.

## buy call (short call)
### The market moves up, you can use buy call options as insurance to make money on the volatility rise (high yield, the biggest risk is losing margin but unlimited profit, suitable for veterans)

Let's say the price per share is $50 now, and you buy 100 shares of a buyer's option at $1 per share (buy call, you can buy 100 shares of stock at $50 per share in the future).

After 1 month, the stock price rises to $60 per share. At this point you have two choices:

1. Exercise: The previous buy call technically allowed him to buy 100 shares at $50 per share. If he does that he is exercising the option and can sell 100 shares at $60 per share for a gain of $900 ($1000 gain - $100 option cost)

2, sell the option (sell call): choose to sell the option, get $ 10 per share, 100 shares gained $ 1,000, get $ 900 gain ($ 1,000 - $ 100 option cost)

If the stock price remains $50 or lower, this option terminates, or as sophisticated investors say, "Option out-of-the-money status."

Which way should you choose. Theoretically there would be 2 choices: choice 1 made $900 with $5,000 for an 18% return in one month. Choice 2 made $900 with $100 for a 900% ROI

Points to note:
1, volatility iv below 60, avoid too much volatility to be exercised. Our purpose is not to be exercised. 
2, pay attention to the time loss (assuming that the target price will be reached in March, at least choose April expiry call, do not choose the end of the day call)

## buy put(short put)
### covered call. market trend down, you can use seller's options, to protect the value of the stock (stable income, low risk, novice favourite)

Suppose the stock price is $50 per share. If the stock market moves lower, the stock price falls to $40. The average investor loses $10 per share. If **he holds 100 shares (and here too you have the stock on hand)**, the book loss is $1,000. Of course this is just a book loss, not an actual loss. If he sells at $40 per share, then he has a real loss of $1000. If you buy a seller's option (buy put) at $1 per option share, you gain the right to sell the stock at $50 per share. Buying a seller's option on 100 shares of stock costs you a total of $100.

If the stock market continues to go down, the stock price falls to $40. At this time

1, you can exercise the option: sell 100 shares of stock at $50 per share and get $5,000. Then one would go to the stock market and buy back 100 shares at $40 per share, using a total of $4,000. As a result, he still owns the 100 shares of stock and has a gain of $900 ($1,000 less the cost of the previously purchased options).

This is essentially a hedging idea. Choose stocks that you think will go up, but have some small short-term volatility.

## sell call(long call)
### Covered Call Wrting: A covered call option. When the stock is half dead or you want to take a profit (hedging, medium yield, risk of losing premium).

Using the stock you already own as collateral (**high cost because you have to hold the stock**), you can sell a call option to someone else, which is a long call on Monday and collects the premium on Friday (if you are forced to exercise the option, you can buy it back a day earlier on Thursday to stop the loss). The essence is also hedging. 

What if the stock price falls very much? The premiums can't be covered. At this point, you can buy an OTM put option (also known as a long put, long meaning buy), which allows you to construct a collar (a combination of options). This means buying a put with a lower strike price to hedge the risk.

Points to note:
1, the volatility should not be too large, we do not want to exercise the right, just to earn premium. (It is best to choose the stock in a range of horizontal adjustment) assuming that each weekly operation to earn 0.5-1, 10 per week, is 10 * 100 * 0.5 = 500 $, a year net income of 20,000 yuan. **Note do not bare sell call, surge will lose more, if not bare sell on the exercise of the right to sell the stock is also ok**.

## sell put(long put)
### Cash-secured naked put wrting Selling cash-secured put options. Cash-secured naked puts to make money on declining market trends (medium yield, risk is oversold to have enough cash, used in veteran periods)

Sell a put option (long put) on a company's stock that you want to hold, and then choose the price you are willing to pay for the stock as the strike price of the option. **We can immediately receive the premium for this option** in exchange for the obligation to buy the underlying stock in the future at the agreed price. If the purchaser does not exercise the option, he/she does not have to buy the stock, but can keep the royalty as a gain.

Caution:
Buy large volume stocks (stock prices are less likely to be manipulated). delta is chosen to be around 0.3.

## Spread (Spread Option) Combination Option
### Bear call spread: Bear call spread, a strategy used mainly in bearish markets.
A Short call (Short means buy) is accompanied by a Long call with a higher strike price.

Between the Short and Long calls there is a positive Credit Spread and the opposite is a Debit Spread.


Let's say our example above sells Calls (using Covered Call Wrting) on Monday to make some royalty. Let's say the stock price has risen so much that the stock finally unwinds and we sell the stock by directly exercising the rights. So we can't sell the Call naked at this point. 

Let's say we think this stock is unlikely to continue to rise this week and will retrace this week (relative to the high of 220). Bearish.

1, first sell a call at 210 strike price (the strike date is Friday), you will receive the premium on the spot (because you long call), and then buy a call at the same time at a higher strike price.
2, then buy a call at the same time at a higher strike price, for example, 215. Need to pay premium (because you short call)
1 and 2 operations, you can net premium.

To the exercise date assuming that the stock price according to my opinion did not continue to rise, that is, not more than 210. options are null and void, do not have to exercise.

If the stock price continues to rise, that is, to reach 230. then my short call because I was forced to exercise (need to sell the stock), an option loss (230-210 = 20) yuan, assuming that I bought five. Loss of 5 * 20 * 100 = $10,000. That long put earns 230-215=15 yuan. 5 options is 75 * 100=7500 yuan. That's a loss of $2000 on the day of the operation on Monday. (**If you don't do spread then Monday's loss is $10,000, which is the result of naked selling**)

Spread can reduce the risk of playing options, the maximum return is basically in the difference in premium between two different strike price options. Using this strategy, it is possible to make weekly premiums when you don't have enough principal, provided you can predict it correctly.

The opposite of this is the bull put spread, which is used in bullish markets to short put while putting at a lower strike price. 


## Duan Yongping sell put operation analysis

On 5 December, Yongping Duan posted that he plans to sell some more Alibaba puts and shared a screenshot of the order confirmation page. On the exercise date (250117), the exercise price is close to the market price, the probability of transaction is high, basically can be interpreted as a willingness to buy Alibaba at a positive stock price of $70. (Ignore the premium)

People often compare sell put to sell insurance, a very graphic analogy. The main road sell put, is like an insurance company.

And those who buy put are like the insured. The policyholder buys into the insurance, and during the policy period, unless he suffers a loss, he will not go to the insurance company. Unless the price of Alibaba falls past $70, they certainly won't consider exercising their options.

**But even if Alibaba falls past $70, they won't necessarily exercise their options**. Because the price of a PUT option is made up of two main components:
1, one is the intrinsic value: that is, the difference between the strike price of the option ($70) and the market price.
2, one is the time value: this time value is not easy to understand, you can understand as the validity period of the insurance.

The content of the insurance remains the same, the longer the validity period of an insurance policy, the more expensive it is. And the fast expiry of the insurance, the value is close to zero. The same thing happens with options, the time value decreases as the expiry date approaches. But to be clear, the time value of the insurance we buy decreases linearly. For example, if you spend $100 on a year's worth of aviation insurance worth $10 million, you can calculate that the premium is 27 cents per day. But the time value of options does not decrease linearly. That's a very different point. So even if Ali's stock price has fallen below the 70 strike price, assuming it's already $50,** because this option has a longer expiry date, even if people are salivating at the $20 difference and want to pocket it, they usually don't exercise it**.

They usually don't exercise the option**, because while the $20 intrinsic value is earned, the time value of the option is thrown away for nothing. So the more common practice is that people who want to pocket the difference will choose to sell their own holdings of this put, in which the selling price can reflect both the intrinsic value of the option ($20) and the time value of the option (for example, $3), so that you can maximise profits.

In this case, Duan Yongping sold this option, just in the hands of different people keep flowing, A sold to B, B sold to C, as long as the time value is still obvious, the probability is that no one will not be able to exercise the option early.

**If the expiry date of Ali's share price is lower than $70 (assuming it is $40), because even if Ali's market price is only $40, but the exercise of the option can be sold to Yongping Duan at a price of $70, so everyone will exercise the option. **

If Yongping Duan believes that Alibaba is currently undervalued based on its discounted future cash flows, but also does not have very strong confidence that Alibaba's cash flows can be boosted in the future. Wouldn't it be possible to maximise the benefits through such an option trading strategy?


Let's assume that Duan Yongping sold 1199 lots of BABA 20250117 70.0 PUT. Discounted at a price of $70, these 119,900 shares of BABA would be about $8.39 million. That is to say, before 17 January 2025, if Alibaba stock falls sharply and a large number of users who bought PUT exercise their options, Duan Yongping needs to be able to take out $8.39 million at any time to take over these 1199 lots of $70 price Alibaba
So after he sells these options, according to the 1 lot option profit of 865 US dollars, he can get a one-time gain of 1.04 million US dollars.

According to Duan Yongping's style of operation, he will probably put this $8.39 million to buy treasury bonds, to prepare for any time to take over, that is, prepared for 100% margin. But even at 100% margin, the interest on the $8.39 million in Treasuries, and the one-time profit of $1.04 million, by 17 January 2025, looking back and calculating the annualised return, could be about 18%.


## Terminology

+ Option: Option
+ Call: Call
+ Put: Put
+ Spread: Spread
+ Long: Buy
+ Short: Sell
+ Credit: Net inflow of equity
+ Debit: Net outflow of premium
+ Strike Price: Strike Price
+ Premium: Premium
+ ITM: in the money
+ OTM: out of the money
+ ATM: at the money