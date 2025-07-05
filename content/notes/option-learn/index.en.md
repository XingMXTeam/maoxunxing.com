---
title: "Options Theory Learning Guide"
date: 2024-02-24
tags:
  - Options
description: "Options are not futures. We buy insurance when we buy houses or cars; options are insurance for buying stocks. Options are also a leverage tool for achieving high returns."
images:
  - weekly21/aaa.png
---

This article aims to help beginners and advanced investors understand the basic concepts, strategies, and application scenarios of options. An option is a risk management tool that can be used for hedging risks or as a leverage tool to achieve high returns.

## Table of Contents

1. [Overview of Options](#overview-of-options)

---
2. [Basic Concepts](#basic-concepts)
   - Buyer's Option and Seller's Option
   - Call Option and Put Option
- Royalty fee and strike price
3. [Options Trading Strategies](#OptionsTradingStrategies)
   - Buy Call (Short Call)
   - Buy Put (Short Put)
- Sell Call (Long Call)
   - Sell Put (Long Put)
4. [Combination Option Strategies](#combination-option-strategies)
   - Bear Call Spread（Bull Put Spread）
- Bull Put Spread (Bull Put Spread Option)
5. [Case Analysis: Duan Yongping's Sell Put Operation](#case-analysis-duan-yongping-sell-put-operation)
6. [Term Explanation](#term-explanation)

## Option Overview

+ **Options are not futures**: Options are a risk hedging tool, not a speculative tool.

+ **The dual nature of options**:
  - **Insurance function**: Provides protection for stock investments.
  - **Leverage tool**: Aims for high returns with low cost.
---
+ **Core Principles**:
  - **Buy Call when bullish**, buy Put when bearish.
  - **Even if an option reaches the strike price before expiration, it does not necessarily mean it will be exercised**; it will only be exercised or expire upon expiration.

## Basic Concepts

### Call Option and Put Option

+ **Buy Option**：

  - **Buy Call**：When investors believe the stock price will rise, they purchase it to obtain the right to buy the stock at a preferential price.
  - **Buy Put**：When investors believe the stock price will fall, they purchase it to obtain the right to sell the stock at a certain price.
+ **Sell Option**:
  
  - **Sell Call**：The investor sells when they believe the stock price will not rise significantly, earning the premium.
  - **Sell Put**：The investor sells when they believe the stock price will not fall significantly, earning the premium.
---

### Call Option and Put Option

+ **Call Option**:
  - **Buy Call**: Used when expecting the stock price to rise.
  - **Sell Call**: Used when expecting the stock price to stay flat or experience slight fluctuations.

+ **Put Option**:
- **Buy Put**：Used when expecting the stock price to fall.
  - **Sell Put**：Used when expecting the stock price to remain flat or experience slight fluctuations.

### Premium and Strike Price

+ **Premium**：The fee paid or received by both parties in the option trade.
+ **Strike Price**: The price agreed upon in the option contract for buying or selling the stock.
+ **Intrinsic Value and Time Value**:
  - **Intrinsic Value**: The difference between the option's strike price and the market price.
  - **Time Value**: The premium of the option due to the time remaining until expiration, which gradually decreases as the expiration date approaches.

## Options Trading Strategies

### Buy Call (Short Call)

#### Scenario: Market trend is upward, utilizing buy call options to earn profits from rising volatility.

**Assumption**:

- Current stock price: $50
- Option cost: $1 per share (1 option contract = 100 shares)
**Operations**:

1. **Exercise**: If the stock price rises to $60, buy 100 shares at the $50 exercise price, then sell them at $60, making a profit of $900 (minus $100 option cost).
2. **Selling Options**: Directly sell the options at a price of $10 per share, making a profit of $900.
**Precautions**:

- Volatility (IV) below 60, avoid being exercised due to excessive volatility.
- Time Decay: Choose options with longer expiration dates.
### Buy Put (Short Put)

#### Scenario: Market trend is downward, using a put option to protect stock value.

**Assumptions**:

- Current stock price: $50

- Option cost: $1 per share (1 option contract = 100 shares)
**Operation**:
---

1. If the stock price falls to $40, sell 100 shares at the $50 strike price, then buy back at $40, making a profit of $900 (after deducting $100 option cost).
**Essence**: Hedging concept, suitable for stocks with significant short-term volatility.

### Sell Call (Long Call)

#### Scenario: When the stock price is sideways or when you want to take profits, sell call options to earn premium.

**Operation**:

- Hold the stock as collateral and sell call options.

- If the stock price falls, you can buy out-of-the-money put options (Long Put) to construct a collar.
**Precautions**:
- Avoid naked selling of Call options (without stock coverage) to prevent losses from a sharp rise.

### Sell Put (Long Put)
#### Scenario: Earn premium by selling put options with cash collateral.

**Operation**:

- Sell put options and receive the premium immediately.

- If the stock price does not fall below the strike price, it will not be exercised, and the premium is retained.

**Precautions**:
- Choose large-cap stocks (less susceptible to manipulation).
- Keep the Delta value around 0.3.

## Combination Option Strategies
### Bear Call Spread（Bullish Call Spread）
---

#### Scenario: Bearish market with a bearish outlook.

**Operation**:

1. Sell a Call with a lower strike price (e.g., 210 yuan).

2. Buy Calls with a higher strike price (e.g., 215 yuan).

**Result**:
- If the stock price does not exceed 210 yuan, the option expires worthless, and the net profit is the premium.
- If the stock price rises significantly (e.g., to 230 yuan), use a Spread to reduce losses.

### Bull Put Spread (Bull Put Spread Option)
#### Scenario: Bullish market outlook.
**Operation**:

1. Sell a put with a higher strike price.

2. Buy Put options with lower strike prices.

**Result**:

- If the stock price does not fall below the strike price, the option expires worthless, and the net profit is the premium received.
---
- If the stock price drops significantly, use a Spread to reduce the loss.

## Case Analysis: Duan Yongping's Sell Put Operation
**Background**:
- Duan Yongping plans to sell put options on Alibaba, with a strike price of $70, and the expiration date is January 17, 2025.

**Analysis**:

1. **Option Premium Revenue**: Sold 1199 Put contracts, with a profit of $865 per contract, totaling approximately $1.04 million.

2. **Margin Requirement**: Based on a 100% margin requirement, $8.39 million needs to be prepared to take over the position.
3. **Return Calculation**:

   - Government bond interest + Option premium revenue ≈ 18% annualized return.
**Conclusion**:
- If the stock price is below $70, buy the stock at $70 after exercising the option.
- If the stock price is above $70, the premium is pure profit.
---

## Glossary Explanation
+ **Option**: Option
+ **Call**: Call option

+ **Put**: Put option

+ **Spread**: Spread

+ **Long**：Buy
+ **Short**：Sell
+ **Credit**：Net premium inflow
+ **Debit**：Net premium outflow
+ **Strike Price**: Strike price
+ **Premium**: Premium
+ **ITM**: In The Money (实值)
+ **OTM**: Out Of The Money (虚值)
+ **ATM**: At The Money