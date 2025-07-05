---
title: "D2 Sharing Summary"
date: 2019-11-25
tags:
  - Web Development
---
## Table of Contents
- [Network Performance Optimization](#network-performance-optimization)
  - [Core Idea](#core-idea)
  - [Beidou Plugin System](#beidou-plugin-system)
  - [PM2 Cluster Mode](#pm2-cluster-mode)
- [Performance Optimization Tools and Methods](#performance-optimization-tools-and-methods)
  - [QPS Calculation Formula](#qps-calculation-formula)
  - [Peak QPS Calculation](#peak-qps-calculation)
    - [Example](#example)
- [Performance Optimization for React and Next.js](#performance-optimization-for-react-and-nextjs)
  - [Next.js](#nextjs)
  - [React Performance Optimization](#react-performance-optimization)
- [Beidou Framework](#beidou-framework)
  - [Features](#features)
  - [Testing Tools](#testing-tools)
- [QPS Calculation and Server Requirements](#qps-calculation-and-server-requirements)
  - [Terminology](#terminology)
  - [Example Scenario](#example-scenario)
- [Performance Optimization for Node.js and React](#performance-optimization-for-nodejs-and-react)
  - [Node.js Optimization](#nodejs-optimization)
  - [React Optimization](#react-optimization)
- [Animation and User Experience Optimization](#animation-and-user-experience-optimization)
  - [Animation Optimization](#animation-optimization)
  - [Loading Optimization](#loading-optimization)
- [Cross-Platform Development and Hybrid Applications](#cross-platform-development-and-hybrid-applications)
  - [Hybrid Applications](#hybrid-applications)
  - [IoT Development](#iot-development)
- [Technical Growth and Team Value](#technical-growth-and-team-value)
  - [The Value of Technical Personnel](#the-value-of-technical-personnel)
  - [Maslow's Pyramid](#maslows-pyramid)
- [Core Competencies of Front-End Development](#core-competencies-of-front-end-development)
  - [Phase 1: Quality and Efficiency](#phase-1-quality-and-efficiency)
  - [Phase 2: Team Value](#phase-2-team-value)
  - [Phase 3: Integration and Reshaping](#phase-3-integration-and-reshaping)
- [References](#references)
---
## Network Performance Optimization
### Core Idea
>
> **The worse the network, the more obvious the advantage**  
Improve performance in weak network environments by reducing the number of requests, optimizing resource loading, etc.
### Beidou Plugin System
- **`beidou-plugin-react`**: View plugin.
- **`beidou-plugin-webpack`**: Webpack plugin for code building.
- **`beidou-plugin-router`**: Automatic routing plugin.
- **`beidou-plugin-isomorphic`**: Isomorphic plugin that supports BOM/DOM variables and non-JS resources (like Less).
### PM2 Cluster Mode
- [PM2 Official Documentation](http://pm2.keymetrics.io/docs/usage/cluster-mode/)
- Use cluster mode to improve the performance and stability of Node.js applications.
---
## Performance Optimization Tools and Methods
### QPS Calculation Formula
- **QPS = Total Requests / (Total Processes * Request Time)**
- Daily PV per server:
  - Formula 1: `Total Daily PV = QPS * 3600 * 6`
  - Formula 2: `Total Daily PV = QPS * 3600 * 8`
### Peak QPS Calculation
- Principle: 80% of daily visits are concentrated in 20% of the time.
- Formula: `(Total PV * 80%) / (Seconds per day * 20%) = Requests per second during peak time (QPS)`
- Number of machines required: `Peak time QPS / QPS per machine = Required machines`
#### Example
- **Question**: How much QPS is needed for a single machine with 3 million PV per day?
  - **Answer**: `(3000000 * 0.8) / (86400 * 0.2) = 139 (QPS)`
- **Question**: If one machine has a QPS of 58, how many machines are needed to support it?
  - **Answer**: `139 / 58 ≈ 3`
---
## Performance Optimization for React and Next.js
### Next.js
- **Server-Side Rendering (SSR)**: Improves SEO and first-screen loading speed.
- **React Server Components**: Reduces the client-side rendering burden.
### React Performance Optimization
1. **Use Babel plugins**:
   - `transform-react-constant-elements`
   - `transform-react-inline-elements`
   - `transform-node-env-inline`
2. **Upgrade to React 16 or higher**:
   - Introducing `async function` can improve performance by about 30%.
3. **Reduce component nesting depth**:
   - Reduce unnecessary levels to improve rendering efficiency.
4. **Hot Cache**:
   - Cache frequently used modules or components.
---
## Beidou Framework
### Features
- **Modular design**: Supports flexible expansion.
- **Performance Optimization**:
  - Use `babel` plugins for code optimization.
  - Supports server-side execution of some modules (suitable for SEO scenarios).
### Testing Tools
- Use `loadtest` for performance testing:
  ```bash
  loadtest http://127.0.0.1:6001 -n 16
  ```
---
## QPS Calculation and Server Requirements
### Terminology
- **QPS**: Queries Per Second.
- **PV**: Page Views.
### Example Scenario
- **Question**: How much QPS is needed for a single machine with 3 million PV per day?
  - **Answer**: `(3000000 * 0.8) / (86400 * 0.2) = 139 (QPS)`
- **Question**: If one machine has a QPS of 58, how many machines are needed to support it?
  - **Answer**: `139 / 58 ≈ 3`
---
## Performance Optimization for Node.js and React
### Node.js Optimization
1. **Use Node.js 8+**:
   ```bash
   nvm use node8
   ```
2. **Run in production mode**:
   - Ensure the application runs in a production environment for optimal performance.
3. **Serial communication and hardware interaction**:
   - Use Node.js to implement communication with hardware devices such as RFID card readers.
### React Optimization
1. **Warm-up mechanism**:
   - Utilize the JIT compiler to optimize performance.
2. **Performance measurement**:
   - Use `performance.now()` or `process.hrtime()` to measure high-precision time.
3. **Micro-benchmarking**:
   - Test the performance of small code snippets to ensure results converge.
---
## Animation and User Experience Optimization
### Animation Optimization
1. **Use only Transform and Opacity**:
   - Avoid complex CSS property animations.
2. **Use `will-change`**:
   - Inform the browser in advance which properties will change.
3. **Scrolling optimization**:
   - Use `Passive Event Listeners` to improve scrolling performance.
### Loading Optimization
1. **Delay showing Loading**:
   ```javascript
   let timer = setTimeout(function() {
       timer = null;
       Loading.getInstance().show();
   }, 100);
   Promise.all([this.getModule(), this.getData()]).then(function(res) {
       let Module = res[0];
       let data = res[1];
       new Module(data);
       if (timer) {
           clearTimeout(timer);
       } else {
           Loading.getInstance().hide();
       }
   });
   ```
2. **Preloading strategy**:
   - Use Service Worker to implement offline access and cross-platform preloading.
---
## Cross-Platform Development and Hybrid Applications
### Hybrid Applications
- **Debugging tools**:
  - Use Safari to debug the iOS simulator.
  - Debug Hybrid applications wirelessly.
- **Cross-page interaction**:
  - Drawer-style global navigation.
  - Flicker-free Tabbar.
### IoT Development
- **Raspberry Pi PWM**:
  - Use Raspberry Pi for hardware control.
- **WebGL and sensors**:
  - Combine WebGL and sensors to create rich interactive experiences.
---
## Technical Growth and Team Value
### The Value of Technical Personnel
1. **Core Competencies**:
   - Deconstruct problems and output solutions.
   - Form a closed loop, with continuous input and output.
2. **Build trust with the team**:
   - Provide solutions that can help the team grow.
### Maslow's Pyramid
- **Self-actualization**: Growth stage.
- **Esteem**: Growth stage.
- **Love & Belonging**: Sense of belonging.
- **Safety**: Survival needs.
- **Victory**: Survival needs.
---
## Core Competencies of Front-End Development
### Phase 1: Quality and Efficiency
- **Technology stack**: React, Vue, Webpack.
- **Engineering system**: Data system, monitoring system.
- **Environmental factors**: Component system, validation and checkpoints.
### Phase 2: Team Value
- **Empowerment**: Enhance team capabilities.
- **Giving back**: Deducing business models and product strategies.
- **Competitor analysis**: Understand the data flow link.
### Phase 3: Integration and Reshaping
- **Data-oriented programming**: Data flow, data processing, data models.
- **Business model**: Build complete solutions.
---
## References
- [PM2 Official Documentation](http://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [Beidou GitHub Repository](https://github.com/alibaba/beidou)
- [Fastify Official Website](https://www.fastify.io/)
- [WebPageTest](https://www.webpagetest.org/)
