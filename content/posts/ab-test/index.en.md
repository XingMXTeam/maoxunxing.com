---
title: "AB Experiment Principles and Practice"
date: 2021-09-09
tags:
  - AB experiment
  - Web Development
description: ""
images:
  - ab-test/ab.png
---

## **Table of Contents**

1. [Principle of AB Test](#1-principle-of-ab-test)
2. [Purpose of AB Test](#2-purpose-of-ab-test)
3. [Orthogonal Experiment](#3-orthogonal-experiment)
4. [Joint Experiment](#4-joint-experiment)
5. [Case Study](#5-case-study)
6. [Diversion Principle](#6-diversion-principle)
7. [Difference Between AB Testing and Regular Investment](#7-difference-between-ab-testing-and-regular-investment)
8. [Create Experiment](#8-create-experiment)
9. [Traffic Splitting Logic](#9-traffic-splitting-logic)
10. [Experiment Solidification](#10-experiment-solidification)
11. [Several Questions](#11-several-questions)

## **1. Principle of AB Testing**

### **Hypothesis Testing**

- **Definition**: To verify hypotheses through proof by contradiction. If a low-probability event occurs, it indicates the presence of a difference.

---
  - Example: A person claims to be an average-level archer, but their first shot only scored 2 rings (a low-probability event, p-value), suggesting they are likely not an average-level archer.

### **Principles Involved**

- **Law of Large Numbers**: As the sample size increases, the sample mean gradually approaches the population mean.
- **Central Limit Theorem**: When the sample size is large enough, the distribution of the sample mean will approach a normal distribution, regardless of the original data distribution.

## **2. The Role of AB Testing**

### **Qualitative Effects**

- Determine if the business strategy is effective (check the p-value).

  - If the p-value is less than the significance level (e.g., 0.05), reject the null hypothesis and consider the strategy effective.
### **Quantitative Effects**

- How much did it grow specifically (see confidence interval).

  - For example, the new strategy improved by 5% compared to the old strategy, but the reliability of the improvement needs to be judged in conjunction with the confidence interval.
### **p-value**

- **Definition**: It represents the relationship between "hypothesis" and "data," does not indicate correlation or effectiveness, and only indicates significance.

---
- Generally, a value below 0.05 is considered significant.
  - Example: A p-value of 0.01 indicates that there is only a 1% probability of observing the current data if the null hypothesis is true.

### **Confidence Interval**

- **Definition**: If the experiment is well-conducted, there is a 95% chance that the true difference between groups lies within this range.
- Both upper and lower limits being greater than 0 indicate significance.
  - Including 0 indicates non-significance.
  - Example: A 95% confidence interval within [0.88, 0.97] means there is a 95% probability that the true value falls within this range.

## **3. Orthogonal Experiment**

### **Objective**

- The objective of orthogonal experiments differs from that of mutually exclusive experiments:

  - If the objectives are consistent, mutually exclusive experiments (non-orthogonal experiments) should be used.
  - Different experiments can be combined into a single experiment, and the different indicators of the experiments can be overlaid.
### **Traffic Shunting Method**

- Through a unified traffic shunting SDK, the ID is randomly scrambled to ensure uniqueness (e.g., MurmurHash: uid + salt).

### **Precautions**

- Orthogonal experiment: 2 * 2 (2 experiments correspond to 4 scenarios), but the fields of each experiment should be different, otherwise it cannot be determined which value to apply.

## **4. Joint Experiment**

- Determine the impact of a group/individual business strategy on the overall effect, without focusing on the global impact of multiple unrelated business strategies.

## **5. Case Study**

### **Conversion Rate Issue**

- **Experiment Bucket**: Uses a new algorithm, with a traffic share of 5% and a conversion rate of 86%.

- **Baseline Bucket**: Uses an old algorithm, with a traffic share of 10% and a conversion rate of 90%.

- **Hypothesis Testing**:

  - p-value is 0.015, indicating that the new algorithm is 4% better than the old algorithm, with a probability of 0.015 being even better.
## **6. Diversion Principle**
### **References**
---

- [《Overlapping Experiment Infrastructure: More, Better, Faster Experimentation》](https://www.shuxuele.com/data/confidence-interval.html)

### **Assumptions**

- **H0**: A and B show no significant difference.

- **H1**: A and B do indeed show a significant difference.

### **p-value**

- The p-value is calculated based on the z-test. If p < 0.05, then H0 is accepted.
### **Confidence Interval**

- It is a range of data that we are quite confident will include the true value.

  - Example: A 95% confidence interval is within the range [0.88, 0.97].

## **7. Difference Between AB Testing and Dollar-Cost Averaging**

- **AB Traffic**: Randomly assigned.
- **Dedicated Investment**: Targeted allocation.

## **8. Creating an Experiment**

### **Process**

1. Configuration module experiment.
2. Publish experiment (experiment bucket not assigned).

3. Publish the newly added experiment module.

---

4. Publish page takes effect.

5. Gradually increase the proportion of experimental buckets (no volume increase upon launch).
### **Release Experiment**
- Release to Diamond or Tair (module-related).
## **9. Traffic Shunting Logic**
---

### **Global Experiment**

- The client receives the experiment SDK for traffic splitting. When the interface is called, the server receives a large Map (K/V object), and then it performs differential floor distribution based on the traffic splitting information.

- **Front-end Implementation**:

  - The server injects experiment bucket information into the Cookie, which is then passed to the server when the interface is requested.

- The server fetches the corresponding rules based on the bucket information and distributes different component names.

  - The frontend renders different components based on the component names.
### **Single-floor experiment**
- Obtain experiments from the experiment platform, and get the business-related experiment ID.
## **10. Experiment Solidification**
### **Page Experiment Solidification**

---

- Go through the scheme route (route to the page), then take the experiment offline.

  - Scheme routing is a configuration.

### **Single Module Experiment Solidification**

- First experiment offline (after going offline, it will hit natural buckets), then delete non-winning modules.

### **Full-Link Experiment Solidification**
- Automatically delete floors and publish page structure.

- If the experiment is not fully rolled out, the natural bucket needs to be retained, and all scheduled items should not be expired directly.

### **Field Experiment Solidification**

- Manually configure the winning scheduled fields.

### **Cold Start Handling**
- When the client-side global experiment cold starts, switching to the shipto or onboarding welcome page will route traffic.

  - Experiment data is stored uniformly in memory to avoid inconsistencies between upstream and downstream switches.

  - Even if the experiment is deprecated, the user's app still retains the previous experiment switches, with traffic entering the natural bucket unless the user kills the app and restarts it.

### **Field Experiment**

- Solving the issue of floor splitting required for floor experiments.
  - **Type 1**: Scheduled experiments: Direct experiment bucket association scheduling
  - **Type 2**: Field experiments: Direct experiment field association.

### **Data experiments**

- Limited support is currently available, but you can experiment with different data by uploading two sets of data.
## **11. Several Questions**
1. **How to route experiments on a single floor?**

---

   - Experiments on a single floor obtain the experiment ID through the experiment platform and route based on business logic.
