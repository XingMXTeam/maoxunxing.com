---
title: "Frontend Interview Summary"
date: 2023-04-03
draft: true
tags:
  - Interview
---

**Business Understanding**:

AE serves globally, with multiple countries and channels (cross-border/local/fully-managed/semi-managed).

Business Characteristics:
1. Significant localization differences: Different languages, currencies, time expressions, as well as Saudi Arabia's RT, requiring targeted provision of different localization services; logistics expression.
2. Diverse business models: New businesses require rapid validation, semi-managed/fully-managed; many personalized demands (for different major promotional events, changes in cross-border policies, including compliance requirements), which are usually urgent.
3. Complex scenarios: Different network conditions and devices in various countries, different population and national characteristics, leading to higher technical requirements.

Business Pain Points:
1. Poor delivery experience (including stability, page performance, interaction consistency), C-side issues like duplicate sections, field errors, link redirection problems (complex operational procedures).
2. Low efficiency (long requirement delivery cycle, repeated joint debugging during BAT/UAT stages).
3. Insufficient data analysis capabilities: Middle-back office pseudo-requirements waste R&D resources, C-side operational strategies are not well-justified.

**Technical Solution**:

Current Technical Status:
1. Complex and outdated technical architecture: Middle-back office: dada/dida, dada's grayscale capability only supports user percentage (lacks per-channel/country grayscale), high learning curve for Schema construction, insufficient source code infrastructure. Many solutions based on the middle-back office ice2.0 framework are outdated; C-side: FaaS architecture/building system, underlying tools are not maintained by dedicated personnel.
2. Data/Material standards: Chaotic data standards, interaction differences across different businesses/channels diverge.
3. Insufficient data analysis capabilities: Network conditions completely change performance analysis, different devices (e.g., some countries have poor devices), DNS, etc.

Technology Selection:

1. Technical Architecture
Middle-back office: Initially, DADA low-code platform (templating + DSL) was used to improve delivery efficiency. Now, ICE 3.0 is suitable for standardized middle-back office, but internationalization scenarios require a custom framework.
  - spec standard
  - Build tools: Hybrid compilation. Vite is fast but its ecosystem is not as aligned with Alibaba's tech stack as Rspack. Compared to Webpack, speed is increased by 30%, with proxy hot-reloading.
  - store solution: immer+zustand
  - Micro-frontend: qiankun+icestark for independent deployment and grayscale release.
  - Request library: alova has built-in request caching and merging. Most importantly, its API type inference, based on OpenAPI to generate TS types, reduces glue code (50% efficiency improvement compared to manual maintenance).
  - React18
C-side uses a streaming FaaS framework + SSR, the module system is pure source code/material center, Aochuang protocol/module system.

2. Data/Material Standards:
  - Generate TS types based on OpenAPI to reduce glue code.
  - antdesign to customize its own atomic and business components, scene templates, page templates, supporting interaction and data customization.
3. Front-end and back-end monitoring and analysis system; Enhanced A/B testing capabilities.

**Result Measurement**: Middle-back office requirement delivery cycle shortened by 60%, C-side configuration error rate decreased by 70%.


Middle Platform:
  - Experience: Subjective, PSAT > 130, NPS increase, feedback from user surveys. Objective, performance measured by MCP, in-depth business analysis: increased form completion rate, user retention on dashboards, operational efficiency of tables.
  - Efficiency: 40% of merchant/70% of assistant requirements completed within 2 hours without front-end involvement; 1 person-day delivery after back-end joint debugging.
C-side:
  - Experience: Performance LCP ≤1.5s, TTI ≤1.5s
  - Efficiency:


**Long-term Planning**

Maintain advancement: Intelligent building, Agent
