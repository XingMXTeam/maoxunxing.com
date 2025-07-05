---
title: “Interview Questions Compilation and Classification”
date: 2019-11-25
tags:
  - Interview
---

## 1. Coding and Algorithms

### Coding-related

- **Advantages, Disadvantages, and Applicability of BOM Headers**:
  - Advantages: Clearly defines file encoding to prevent character encoding issues.
  - Disadvantages: May cause compatibility issues in certain scenarios.
  - Applicability: Suitable for scenarios requiring explicit encoding specifications.

### Algorithm Questions

- A specific algorithm question (not specified).

---

## 2. HTTP and HTTPS

### HTTP and HTTPS Handshake Process

- **HTTP**: Uses plaintext transmission, with a simple but insecure handshake process.
- **HTTPS**: Uses SSL/TLS encryption, with a handshake process that includes certificate verification, key exchange, and other steps.

### Features of HTTP/2

- **Multiplexing**:
  - Allows multiple requests and responses to be transmitted simultaneously over a single connection.
  - Reduces latency and improves performance.
- **Header compression**: Reduces the transmission of redundant header information.
- **Server push**: Actively pushes resources to the client.

---

## 3. Front-end Security and Performance

### Security Understanding

- **Common Frontend Security Issues**:
  - XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), etc.
- **Preventive Measures**:
  - Input validation, CSP (Content Security Policy), HttpOnly Cookies, etc.

### Performance Optimization

- **Why Optimize**: Improve user experience and reduce resource consumption.
- **How to optimize**:
  - Resource compression, lazy loading, CDN acceleration, code splitting, etc.
- **How to evaluate**:
  - Use tools (such as Lighthouse, WebPageTest) to analyze metrics such as first screen load time and interaction time.
- **Further optimization options**:
  - Image optimization (such as WebP format), reducing repaints and reflows, etc.

---

## 4. Front-end error collection

### Error logging

- **How to log**:
  - Use `window.onerror` or `try-catch` to capture global errors.
- **Distinguishing third-party plugin issues**:
  - Use stack information to locate the source of the error.
- **Reporting method**:
  - Asynchronously send error logs to the server.
- **Analysis methods**:
  - Cluster error types to identify high-frequency issues.

---

## 5. Mobile and PC Development

### PC and Mobile Conversion

- **Adaptation solutions**:
  - Responsive layout, media queries, REM/VW units, etc.
- **Common ES6 features**:
  - Destructuring assignment, arrow functions, template strings, Promises, etc.
- **Array Methods Overview**:  
  - `map`, `filter`, `reduce`, `forEach`, `some`, `every`, etc.  

---  

## 6. Team Collaboration and Technical Knowledge Accumulation  

### Current Team Status

- **Frontend Knowledge Accumulation**:
  - Development of technical documentation, component libraries, and toolchains.
- **Technical Research**:
  - Exploration and implementation of new technologies (such as mini-programs and micro-frontends).
- **Purpose**:
  - Improve team efficiency and reduce the learning curve for new members.

### Frontend Code Review Rules

- **Example Rules**:
  - Prohibit the use of `var` and enforce the use of `const`/`let`.
  - Component names must comply with specifications.
- **Reason for Establishment**:
  - Improve code readability and maintainability.

### Interface Specifications

- **Return Code Specifications**:
  - Success (200), failure (400/500), etc.
- **Negotiation method**:
  - Develop interface documentation in collaboration with the backend team.
- **New employee training**:
  - Provide detailed documentation and sample code.

---

## 7. Mini Programs and MVVM

### Mini Program Research

- **Why do it**:
  - The mini program ecosystem is becoming increasingly important, so it is necessary to plan ahead.
- **Is it simple?**:
  - It appears simple on the surface, but issues such as performance optimization and compatibility still require in-depth research.

### MVVM Pattern

- **Definition**:
  - Model-View-ViewModel, data-driven view updates.
- **Advantages and Disadvantages**:
  - Advantages: Decouples the view from the logic, making maintenance easier.
  - Disadvantages: May cause performance issues in complex scenarios.

---

## 8. Login Functionality Implementation

### Remember Login Functionality

- **Implementation Method**:
  - Use `localStorage` or `cookie` to store user identifiers.
- **Security**:
  - Encrypt sensitive information before storage.

### Unified Login and Authorized Login

- **Considerations**:
  - User experience, security, integration with third-party platforms.

---

## 9. Project Experience

### Campus and Work Projects

- **Campus Projects**:
  - Describe the most representative projects and their highlights.
- **Work Projects**:
  - Describe the most challenging projects and their solutions.

### Team Learning and Roles

- **Problem-Solving Approach**:
  - Analyze the root cause of the problem and draw on team experience.
- **Lessons Learned**:
  - Technical or managerial insights gained from team members.
- **Team Roles**:
  - Developer, Technical Lead, etc.

---

## 10. Data Analysis System

### Functional Breakdown

- **Requirement Understanding**:
  - Clarify the objectives and user requirements of data analysis.
- **Technical Implementation**:
  - Data visualization, chart libraries (e.g., ECharts), frontend-backend separation architecture.

---

## 11. Business Direction and Job Grade System

### Business Direction

- **Past Business Capabilities**:
  - Describe the businesses you have participated in and their results.
- **Desired Direction**:
  - Describe the business areas you wish to pursue (e.g., big data, AI, etc.).

### Job Grade System

- **Department Characteristics**:  
  - Describe the department's core business and technology stack.  

---  

## 12. Team Collaboration and Project Management  

### Team Member Distribution  

- **Role Responsibilities**:  
  - Frontend, backend, testing, product manager, etc.
- **Version Iteration**:
  - Agile development process with regular version releases.

### Project Delay Handling

- **Response Measures**:
  - Priority adjustments, overtime work, and communication coordination.

---

## 13. Other Department Business

### Cross-Department Collaboration

- **Other Department Operations**:
  - Describe the operational characteristics of other teams within the company.

---

## 14. Front-End Optimization and Debugging

### requestAnimationFrame vs setTimeout

- **Why use `requestAnimationFrame`**:
  - More efficient, synchronized with screen refresh rate, suitable for animation scenarios.

### First-Screen Optimization

- **Alternatives to SSR**:
  - Skeleton screens, lazy loading, on-demand loading, etc.

### Frontend Standard Implementation

- **Issues and Solutions**:
  - Difficulty in promoting standards and insufficient enforcement; use tools (such as ESLint) for automated checks.

---

## 15. Source Code and Webpack Optimization

### Source Code Reading

- **React Virtual DOM Optimization**:
  - Tree comparison algorithms, Diff optimization.
- **Performance Changes in New React Versions**:
  - Concurrent Mode, Suspense, etc.

### Webpack Optimization

- **Challenges**:
  - Large bundle size, slow build speed.
- **Optimization Methods**:
  - Tree Shaking, code splitting, caching mechanisms.

---

## 16. Debugging and Sourcemap

### Sourcemap

- **Definition**:
  - Maps compiled code back to source code for easier debugging.
- **Use Cases**:
  - Error tracking in production environments.