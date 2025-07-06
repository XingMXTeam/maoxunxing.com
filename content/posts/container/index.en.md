---
title: "Frontend Architecture"
date: 2025-02-06
tags:
  - Web Development
  - Architecture
custom_toc:
  - title: "Architecture Concepts"
  - title: "How to Design Navigation"
images:
  - container/cover.png
---
## Architecture Concepts
## Business Architecture
### Core Definition
Business architecture focuses on an organization's business strategy, governance, organizational structure, and key business processes. It defines the company's business strategy and processes to ensure alignment between business goals and operations.
### Key Features
- **Business Goal-Driven**: Designs business models that align with corporate strategy, starting from business requirements.
- **Process Optimization**: Sorts and optimizes core business processes to improve efficiency and flexibility.
- **Customer-Oriented**: Helps the company better understand customer needs and provide higher quality services.
### Application Scenarios
- Formulating a company's long-term development strategy.
- Designing cross-departmental collaborative business processes.
- Ensuring business operations are consistent with the corporate vision.
---
## Product Architecture
### Core Definition
Product architecture involves the design and functional layout of a product, focusing on how the product meets market and user needs. It includes the product's features, user interface, user experience, and market positioning.
### Key Features
- **Matching User Needs**: Ensures that product features match market demands and user expectations.
- **Sustainable Development**: Focuses on product iteration and upgrades to adapt to the changing market environment.
- **Experience First**: Emphasizes the design of the user interface and user experience to enhance user satisfaction.
### Application Scenarios
- Planning and designing features for new products.
- Optimizing and iterating on the features of existing products.
- Analyzing competitors and formulating a differentiated product strategy.
## Technical Architecture
### Core Definition
Technical architecture focuses on the technological solutions and frameworks that support business needs. It includes software, hardware, network infrastructure, and data management strategies.
### Key Features
- **Technical Support**: Provides stable and efficient technical support for business applications.
- **Flexibility and Scalability**: Able to adapt to future technological changes and business expansion.
- **Resource Optimization**: Ensures the effective use of technical resources to reduce operational costs.
### Application Scenarios
- Building distributed systems that support high concurrency.
- Designing data storage and management solutions.
- Creating technical barriers to enhance the company's competitiveness.
## Concept of Containers
### Technical Containers
#### Core Definition
Technical containers primarily focus on providing technical service support, such as database services, message queues, and caching services. They are typically stateless and provide underlying technical support and services to ensure that other services or business containers can operate normally.
#### Features
- **Stateless**: Does not directly participate in business logic processing; focuses on technical support.
- **Generality**: Can be reused in various business scenarios.
- **Tool-based**: For example, Docker, Kubernetes, etc., provide environment and network configuration.
#### Examples
- Micro-application container: Acts as a runtime environment, hosting multiple microservices.
- Caching service: Such as Redis, providing high-performance data access support.
### Business Containers
#### Core Definition
Business containers focus on implementing specific business logic, such as user management, order processing, and payment systems. They are typically stateful, containing business logic processing and data storage.
#### Features
- **Stateful**: Directly participates in business logic processing and stores business-related data.
- **Specialized**: Designed for specific business needs.
- **Dependent on Technical Containers**: Relies on the infrastructure and services provided by technical containers.
#### Examples
- User management system: Handles user registration, login, permission control, etc.
- Order processing system: Manages the process of order creation, payment, shipping, etc.
---
## Resource Deployment
Frontend resources are generally deployed to a static server (like Nginx) or OSS (Object Storage Service), and then accelerated via a CDN.
Alternatively, they can be integrated into a Node.js/Java application that serves static resources.
Or, through static hosting services like Surge or Netlify.
---
## How to Design Navigation
1. **Seamless Updates for Business**  
   - Users should not perceive that an update is happening during their use.
   
2. **No Business Intrusion**  
   - The update process must not affect the styles or functionality of existing business operations.
3. **No Tech Stack Requirement**  
   - The solution needs to be universal and not dependent on a specific tech stack.
## **Solution 1: Versionless CDN Path**
### **Implementation**
- Maintain a middleware layer with a versionless CDN path.  
  - The actual script files have version numbers (e.g., `script-v1.0.0.js`).
  - The versionless middleware path (e.g., `script-latest.js`) points to the latest script version.
- When a new version needs to be released, simply updating the middleware CDN's pointer achieves one-party publishing and multi-party automatic updates.
### **Example**
```text
Actual script path:
https://cdn.example.com/script-v1.0.0.js
https://cdn.example.com/script-v1.1.0.js
Middleware versionless path:
https://cdn.example.com/script-latest.js -> Points to the latest version (e.g., v1.1.0)
```
### **Impact Analysis**
1. **No Canary Release Capability**  
   - Since all users load resources through the same versionless path, it's impossible to implement canary releases (i.e., gradually rolling out updates to a subset of users).
   - If the new version has issues, it could affect all users.
2. **Impacts LCP (Largest Contentful Paint)**  
   - Each time the script is updated, the browser needs to re-download and parse the new resource file, which can lead to a decrease in page load performance and thus affect the LCP metric.
## **Summary**
By maintaining a versionless CDN path, seamless updates can be achieved without any specific requirements for the tech stack. However, this solution has its limitations:
- Lack of canary release capability makes it difficult to control the risks of updates.
- It may negatively impact page performance metrics like LCP.
In practical applications, it is necessary to weigh the pros and cons based on business requirements to choose the appropriate update strategy.
