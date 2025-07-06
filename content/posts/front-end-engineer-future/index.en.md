---
title: "Frontend Engineer Skill Tree"
date: 2021-08-24
tags:
  - Web Development
description: "Refine the growth model indicators for frontend engineers, gradually improving personal professional skills"
---

## Table of Contents

0. [Growth Model](#growth-model)
1. [HTTP Proxy and Tunnel Proxy](#http-proxy-and-tunnel-proxy)
2. [Security: CSRF Protection](#security-csrf-protection)
3. [Software Engineering](#软件工程)
   - [Design Methods](#设计方法)
   - [Design Patterns](#设计模式)
4. [Programming Skills](#编程能力)
- [Micro Frontends](#micro-frontends)
   - [Model-Driven](#model-driven)
5. [Frontend Skills Model](#frontend-skills-model)
   - [Digestion: Basic Knowledge](#digestion-basic-knowledge)
- [Refining: Advanced Skills](#refining-advanced-skills)
   - [Sharing: Senior/Expert-Level Skills](#sharing-senior-expert-level-skills)
6. [Comprehensive Skills](#comprehensive-skills)
   - [Execution](#execution)
- [Communication](#communication)
   - [Organization](#organization)
7. [Front-end Technology Classification](#front-end-technology-classification)
   - [Full-stack Direction](#full-stack-direction)
- [Frontend Development Direction](#frontend-development-direction)
8. [Analysis of Technical Highlights](#analysis-of-technical-highlights)
9. [Career Development and Core Competency Model](#career-development-and-core-competency-model)

Everyone learns different content and achieves different levels of proficiency depending on their positions. Below is a general **growth model** that covers both soft skills and hard skills.


## **Growth Model**

### **1. Soft Skills (Comprehensive Abilities)**

---
Soft skills are the core competitiveness that individuals cannot do without in the workplace, mainly including:
- **Communication Skills**: Clearly express your views, effectively convey information.
- **Persuasion Skills**: Influencing others' decisions through logic and data.
- **Team Building**: Leading teams to collaborate efficiently and enhance overall combat effectiveness.
- **Influence**: Establishing trust and authority within teams or organizations to drive change.

> **Tip**: Soft skills require long-term accumulation to grow. It is recommended to continuously improve them through reading relevant books, attending training, and practical application.

### **2. Hard Skills**

Hard skills vary by position, and below are the classifications of hard skills for programmers in the internet field:
#### **Level 1 Domain: Internet Technology**

Hard skills in the internet field are primarily concentrated in the secondary domains related to development.
#### **Sub-field: Development**

The core content of the development field can be divided into the following aspects:
##### **(1) Foundational Knowledge**

- **Underlying Principles**: Computer architecture, memory management, processes and threads, etc.
- **Operating System**: Common commands for Linux/Unix, file systems, permission management, etc.
---
- **Programming Languages**: Proficiency in at least one mainstream programming language (e.g., JavaScript, Python, Java, etc.).
- **Algorithms and Data Structures**: Sorting, searching, dynamic programming, trees, graphs, etc.
- **Networking**: HTTP/HTTPS protocols, TCP/IP model, DNS, load balancing, etc.
- **Security**: Common vulnerabilities (such as XSS, CSRF), encryption algorithms, authentication, etc.

##### **(2) Software Engineering**
- **Design Patterns**: Classic design patterns such as the Singleton pattern, Factory pattern, Observer pattern, etc.
- **Standards**: Code style, naming conventions, Git workflow, etc.
- **Logging and Monitoring**: Logging records, error tracking, performance monitoring.
- **Unit Testing**: Writing high-quality test cases to ensure code stability.
- **Fault Recovery**: Rapidly identifying issues, rollback mechanisms, disaster recovery plans.
- **Technology Selection**: Choosing the appropriate technology stack based on business needs.
- **Agile Development**: Agile methodologies such as Scrum, Kanban, etc.

##### **(3) Programming Skills**
- **Performance Optimization**: Code efficiency, database query optimization, caching strategies.
- **Scalability**: Modular design, microservices architecture.
- **Maintenance Costs**: Code readability, documentation integrity.
- **Robustness**: Exception handling, boundary condition checks.

#### **Level 3 Domain: Specific Development Roles**

Learning focuses differ across various development roles. Below are key content areas for several typical positions:
- **Frontend Development**  

  - **User Experience**: User experience design, responsive layout, animation effects.  
  - **Performance Optimization**: First-screen loading time, lazy loading of resources, CDN acceleration.  
  - **Frameworks and Tools**: Popular frameworks and build tools like React, Vue, Webpack.
- **Server-side Development**  

  - **Data Processing**: Database design, big data processing, distributed storage.
  - **Architecture Design**: Microservices architecture, high-availability architecture, load balancing.
  - **Security**: API authentication, data encryption, anti-spam mechanisms.
### **Learning Focus at Different Levels**

- **Low Level (Junior Engineer)**: Focus on depth, pay attention to business details, and build a solid foundation.

- **High Level (Senior Engineer/Architect)**: Focus on breadth, pay attention to overall business architecture and technology trends.
## **Four Dimensions of Understanding Business**
No matter what position you hold, understanding the business is key to career development. Here are four core dimensions of understanding the business:

1. **User Analysis**  

---

   - **Total Industry User Scale**: Understand the overall user base of the industry.

   - **Company's User Scale**: Clarify the company's user group and its characteristic distribution.
- **User Profile**: Age, gender, region, consumption habits, etc.
2. **Competitor Analysis  
   - **Industry Ranking**: Understand the market share of major competitors.

   - **Competitor Data Comparison**: Functional differences, user experience, technical implementation, etc.
- **Differentiated Advantages**: Identify the core competitiveness of your product.
3. **Customer Acquisition Methods**  
   - **Common Methods**: SEO, SEM, social media marketing, content marketing, etc.

   - **Effectiveness Metrics**: Conversion rate, retention rate, ROI (Return on Investment).
4. **Sources of Profit**  
   - **Profit Model**: Advertising revenue, subscription services, transaction commissions, etc.  

   - **Cost Control**: Reduce operating costs, improve profit margins.  
## **Recommended Reading**
---

Here are some recommended books to help you better understand business and enhance your comprehensive abilities:

- "Positioning": How to build the core competitiveness of a brand.

- "Contagious": The psychological principles of product communication.
- "Growth Hacker Book": Methodology for achieving rapid user growth at low cost.
- "The Fundamental Power of Forging Great Business Legends": Digging into the essence of user needs.
---
- "The Innovator's Dilemma": The relationship between technological innovation and market changes.
### **About Depth and Breadth**

Growing on a platform does not require being all-encompassing. Some knowledge only needs to be known for the problems it solves, which is **breadth**; while **depth** is what you need to understand all the details, especially within your core areas, where it is your core competitive advantage.

> **Breadth and depth are not disjoint**, and breadth can sometimes enhance your depth. For example, understanding the basics of both front-end and back-end can help full-stack engineers design systems more effectively.
### **About Hard Work**
Don't deceive yourself; the premise of hard work is passion. Find the field you are truly interested in and commit yourself to it wholeheartedly. Only by doing what you love can you maintain passion and achieve breakthroughs.

## HTTP Proxy and Tunnel Proxy
### HTTP Proxy

- **Definition**  

  An HTTP proxy is an intermediate layer service that forwards HTTP requests between clients and servers.

- **Features**

- Need to install trusted certificates to ensure the security of communication.
  - Often used for debugging, caching, or filtering requests.

### Tunnel Proxy
- **Definition**
The tunnel proxy transmits data by establishing TCP connections, suitable for more low-level network communication.

- **Application Scenarios**  

  - Used to penetrate firewalls or encrypted communication.
  - Supports data transmission of non-HTTP protocols.

## Security: CSRF Protection
### Definition
CSRF (Cross-Site Request Forgery) is an attack method where an attacker constructs an intra-site URL or places an automatically submitted form on a third-party site, tricking users into clicking while they are logged in, thereby executing the attacker's requests.

### Risks

---

- User asset loss (such as transfer, payment, etc. operations).

- Data tampering or deletion (such as deleting user data, negative reviews, etc.).

### Example

Suppose a website provides an interface to delete negative reviews. If an attacker sends a forged link via IM (instant messaging tool), and a user clicks on it, it may trigger a deletion operation, leading to data loss.
### Protective Measures

- **Use CSRF Token**: Generate a unique Token for each request to verify the legitimacy of the request.

- **Validate Referer header**: Check if the request source is legitimate.

- **Same-origin policy**: Restrict cross-domain requests.

## Software Engineering
### Design Methods
---

Software design methodology is the core concept guiding software development, including but not limited to the following:

- **Object-Oriented Design**

Organize code through classes and objects to improve code reusability and maintainability.

- **Modular design**  

  Divide the system into multiple independent modules to reduce coupling and improve scalability.
- **Layered architecture**

The system is divided into a presentation layer, a business logic layer, and a data access layer, with clear division of responsibilities.
### Design Patterns

---
Design patterns are classic solutions to specific problems. Common design patterns include:

- **Singleton Pattern**

Ensure a class has only one instance and provide a global access point.

- **Factory Pattern**  
  Create objects through a factory class, hiding the details of object creation.

- **Observer Pattern**
Defines a one-to-many dependency relationship between objects, where when the state of one object changes, all objects that depend on it will receive a notification.

## Programming Capabilities
### Micro-frontends

Micro-frontends is a technical solution that breaks down large front-end applications into multiple small, independently deployable sub-applications. Its core objective is:

- Enhance team collaboration efficiency.

- Support diversity in technology stacks.

- Achieve independent development, testing, and deployment.

### Model-driven
Model-driven is a design philosophy centered around data models, emphasizing the generation of business logic, processes, and views through standardized models.
#### Core Objectives

1. **Deliver high-quality, highly faithful products**  

   Through model-driven approaches, reduce human errors and ensure high consistency between product design and implementation.

2. **High Standardization**  

   By using a unified model protocol, development costs are reduced, and system maintainability and scalability are improved.
#### Model-Driven Workflow

---
1. **Business Data Model**

Define the core data structures of the business, describing business entities and their relationships.

2. **Component Protocol**  
   Map the business data model to the component protocol, defining the behavior and interaction methods of the components.

3. **Slot Mapping Protocol**
Describe the nested relationships and layout rules between components.

4. **View Protocol**  
   Further transform the component protocol and slot mapping protocol into specific page views.

5. **Page Generation**
The final complete page is generated, completing the full 闭环 from model to view.

#### Example Process
Business data model -> Component protocol -> Slot mapping protocol -> View protocol -> Page

## Front-end skill model

### Digestion: Basic Knowledge
- **Tools**
  - Git operations: Basic version control skills.

- **HTML**

- Master basic tags, understand semantic HTML.

- **CSS**

  - Layout: Common layout methods like Flexbox, Grid, etc.
  - CSS specificity: Understand selector weights.

- Animation: CSS animations and transitions.
---

- **JavaScript**
  - Prototypes, objects, closures, ES6, and other core concepts.
- **DOM**
- Manipulate DOM objects, handle event binding.

- **Node.js**
  - Master basic APIs, understand server-side runtime environment.

### Summary: Advanced Skills
- **Tools**

  - Package management: pnpm, yarn.
  - Build tools: webpack, vite.

  - Code linting: eslint.

- Static analysis: TypeScript.
- **HTML**
  - Accessibility design: Enhancing user experience and accessibility.
- **CSS**
- Sass/Less: Use of preprocessors.

  - Responsive layout: Adapting to different devices.
  - Advanced animations: Implementation of complex animation effects.

  - CSS architecture: Tailwind, CSS Module.
- **JavaScript**
  - State Management: Best practices with Redux, Zustand, MobX, and Vuex.
  - Frameworks: Vue, React.
  - Testing: Jest, Vitest.

- Modularization: UMD, CMD.
  - Componentization: Usage of UI libraries like Ant Design.
- **DOM**
  - Browser debugging: Mastering DevTools usage techniques.
- HTTP: Understand the HTTP protocol and browser network requests.
- **Node.js**

---
- Event mechanism, streams, networking, advanced APIs.
### Sharing: Senior/Expert-level skills

- Performance optimization: Enhance page loading speed and operational efficiency.
- Responsive framework design and development: Build a flexible responsive system.

- Fully responsive layout design: Adapt to multiple screen sizes.

- State management design: Design an efficient state management solution.
- Plugin system design: Develop an extensible plugin architecture.
- Serverless system architecture: Application development based on serverless architecture.
- Micro-frontends architecture: Implement modular front-end development.
- Safe production: Prevent security threats such as XSS, CSRF, etc.
- Project management skills: Planning and managing complex projects.
- Task decomposition skills: Breaking down large tasks into smaller ones.
- Low-code design: Designing low-code development platforms.
- Internationalization design capabilities: Supporting multi-language and regionalization needs.
## Comprehensive Skills
### Execution
- **60 points**: Complete tasks, meet basic requirements.

- **80 points**: Prioritize key tasks, to-do lists and risk management.

- **95 points**: Horizontal leadership, driving team collaboration.

### Communication

- **60 points**: Email communication, clear expression.
- **80 points**: Public sharing, presentations, communication responses.
- **95 points**: Emotional account, empathetic listening and expression,交锋 achieving goals.

### Organization

- **60 points**: Meeting minutes, task follow-up.
- **80 points**: Meeting organization, project review and improvement.
- **95 points**: Thematic discussions, upward management, driving change.

## Front-end technology division

### Full-stack direction
- **Main application scenarios**:
- Operations Management Platform

  - BFF (Backend For Frontend) Solution

- **Main Technology Stack**:

  - Node.js

### Frontend Direction
- **Main Application Scenarios**:
  - In-vehicle applications

  - Mobile applications
- Mini Program

  - H5

- **Main technology stack**:
  - Flutter
```
- PWA (Progressive Web Apps)
```

## Analysis of Technical Highlights
---
In front-end development, the following technical areas are particularly important, among which **performance, frameworks, tracking, canary releases, security, deployment, scaffolding, caching, specifications, and cross-platform** are core focus points. Below are three or five highlights:

### Highlight 1: Performance Optimization

- Performance is the core of user experience.

- Focus on first-screen loading speed, resource loading strategies, rendering efficiency, etc.

- Use tools like Lighthouse for performance evaluation.

### Highlight 2: Cross-platform development
- **Flutter** and **PWA** are mainstream technologies for cross-platform development.
- Flutter provides a consistent UI and high performance, suitable for multi-platform (mobile, web, desktop) development.

- PWA offers a progressive enhancement web app experience, supporting offline access and fast loading.

### Highlight 3: Data Pointing and Monitoring
- Data points are the foundation of data analysis, used to track user behavior.
- Combined with visualization tools (such as Google Analytics, Sensors Data, etc.), monitor user behavior and product performance in real-time.

### Highlight 4: Gray Release

- Gray release is a low-risk release strategy.
- Conduct small-scale user testing of new features, gradually expanding the scope to reduce the risks of a full-scale release.

### Highlight 5: Security

- Security is an indispensable aspect of front-end development.
- Prevent common attacks such as XSS, CSRF, etc.

- Use technologies like HTTPS, CSP (Content Security Policy) to ensure application security.

## **Career Development and Core Competency Model**
### **Visibility（Visibility）**
- **Importance**:

- Regarding expressiveness, it is one of the most important abilities.

  - When doing things, one should be red, brave, and dare to speak.

- **How to improve Visibility**:

  - **Knowledge, Cognition, Judgment**: Advanced summarization, adopting a pyramid structure for expression.
- **Presentation Style**:
    - Start with conclusions and recommendations, then provide context and issues/challenges, and finally elaborate on the argumentation process and data support.
  - **Focus on Organizational Level**:
    - Shift your focus from what you're currently handling to what the organization is concerned about.
- Define work content based on business focus and determine plans and priorities.
      - Examples: Homepage operation issues, consistency issues.
      - Organization level: GCP & GOP integration.
  - **Formal deliverables**:
- Ensure there are clear deliverables.
### **Relationship**
- **Precautions**:
  - Do not report to superiors without going through your direct supervisor, to avoid causing offense.
- One must be meticulous.

- **Matching Ability**:

  - Example: Team A has ideas and needs but lacks resources; Team B has the ability and resources but lacks ideas. Matching can achieve a win-win situation.
### **Ability**
- **Foundation**:
  - Strong professional skills are the foundation of career development.
## **2. Core Qualities**

- **Self-motivation**:

- Actively propose and solve problems.
- **Craftsmanship**:

  - Creates things that are very useful, focusing on user experience.

- **Taking Responsibility**:

- Can drive solutions even if it's not their own problem.
## **3. Efficiency and Positioning**
- **Efficiency**:
  - What capabilities bring what transformation, covering what scenarios.
- **Positioning**:
  - Your positioning: Business architecture front-end for international scenarios.

- **OKR Summary**:

  - When summarizing, write some business data to illustrate your value.

## **4. Project Results**
- **Definition of Results**:
  - The work is done and there is a result.
  - Results = TD's assessment of goal achievement.
- **Target Requirements**:
    - The target must be quantifiable and measurable.

    - Without a goal, there is no result.

## **5. Growth and Development**

- **Key Points**:
  - **Importance**: Dare to seize opportunities.
  - **Early Positioning**: Grab the initiative.
  - **Strong Goals/Strong Determination/Priority**: Clarify goals and execute firmly.
- **Industry Selection**:
---

  - Finance can be a lifelong career.

- **Business Transformation through Technology**:

  - Find new tracks/fields, combine with new technologies, and transform business with technology.
- **High-risk opportunities**:
  - High-risk opportunities without cost:
    - Talk with experts, prepare thoroughly.
<!--
## Future Trends
From the perspective of front-end technology, the most popular trends in 2021 are currently
* serverless
* ide
* Setup
* Intelligent:

Intelligent:

Edge Intelligence: Offline computing does not meet real-time requirements, collect user behavior data (model + standard) on the edge, through script feature analysis (standard data source), edge AI decision-making (machine learning + deep neural network deployment deep model), real-time intelligent push, marketing push, real-time information stream recommendation, etc. The future trend is cloud + edge collaborative intelligence.

Advantages:

1 Privacy, Security: Information remains on the device and is not uploaded to the cloud
2 Real-time
3 Resource-saving
4 User data and touchpoints

Implementation scenarios:

---
Wind vane, local reordering, smart refresh, conversational recommendations, bounce point prediction
Inference engine:
https://github.com/alibaba/MNN
NCNN
TFLite
Caffe2

Mace
Tensorflow Lite

Frontend focus areas:
Engineering pipeline: Decision engine, behavior collection engine; platform rule center; data analysis; A/B testing
Intelligent UI: Personalized for Each User
Solution:
1 Design template styles
* No standard
* Efficiency

* Algorithm matching missing
* Not general-purpose, no accumulation

2 Semantic tag system + engineering and algorithms

* UI semantic tags: Presentation layer (style, shape, layout, color, text) + Information layer (relation-based, benefit-based, timeliness, cognitive, action)
* User attributes: Age, gender, city Business attributes: Purchase frequency
3 Scene configuration and placement: Dynamic operations at the floor level (target audience, channels, business rules, algorithmic decision-making)

4 Intelligent image composition, visual 稿 generation component
From the perspective of the front-end engineer career path: From Lass, Pass to the current popularity of Sass products, will Sass-level engineers continue to grow in the future, even surpassing back-end engineers? For SaaS-based startup companies, out of 100 engineers, are there basically 50-60 front-end engineers? The medium of human-machine interaction is essentially the product; will front-end engineers gradually evolve into Sass product engineers?
* Sass product engineer
---

* SRE engineer

In terms of numbers: Programmers in the millions, and tens of millions of front-end engineers in China? Will it develop further to a point where there are tens of millions of programmers and millions of front-end engineers?
## Career Path

Front-end knowledge points have a characteristic of being diverse and numerous. If every piece of knowledge is learned, it will not be systematic and will result in a lot of ineffective work. It is necessary to categorize knowledge, focus on learning general knowledge, delve deep into a specific field, and consider the ROI from an economic perspective, which is the input-output ratio.
What is general knowledge?

Things like the "Four Tables and One Board" (charts, forms, lists, tables, and layout) belong to repetitive labor, low-cost knowledge, and will eventually be eliminated by intelligence or low-code construction. These in the middle and back-end fields definitely have no investment value.

What areas are in-depth?

The fields are business fields, Sass tool fields? When we develop a product, we need to focus on the core capabilities of the product, focus on its business model field, and focus on its core tool technology. Like BI data visualization, Sass tool editor field experts
How to consider ROI?

Build:

1. Enhanced setup capabilities

2. Module development-free capability

## Skill Tree

Advanced:
- [] Setup

- [x] nodejs
  + Next.js Midway.js Fastify Sails.js Meteor.js Koa.js Express.js


  + mqtt Kafka RabbitMq Dnode Socket.io Dubbo gRPC

+ GraphQL REST
  + LiteDB Redis MongoDB PostgreSQL MySQL
  + Docker PM2

- [] Internationalization

- [] Experience Management

- [] IDE
- [] Data Visualization
- [] Engineering System: Micro-frontends, Containers
- Cross-platform technology
- Interactive technology
- Intelligence
- Multimedia
Intermediate:
- [] R&D pipeline
- [] Library
---
- [] Framework
- [] Performance Optimization
- [] Working Principle
- [] Comprehensive Ability
Beginner:

- [] html
- [] css
- [] JS
- [] 浏览器
## Direction of Technological Development
### User Experience
Experience Shield:

User Insights | Visual Fidelity | Stability | Performance Optimization
---------|----------|---------
Bounce Rate Analysis | Global: Style, Standards | More Stable Release System | Continuously Optimizing CWV
User Feedback | Business Component Accumulation, Reuse | More Comprehensive Monitoring | Increasing Good URLs Percentage
 |  |  | Image Loading

### R&D Efficiency

* Unit Testing

* Draft of Code Review
  * Indicator Requirements + Review Rules + Patrol Inspection
* Title readability
* Cross-product reusable components
  * Common: Pop-up; Screenshot; Small yellow bar; Image cropping
  * User: Share, Address control

* Card:

  * Activity
How to efficiently manage components
### spa
pv missing
### Team Building
* Sharing mechanism
  * Become a brand
---
* Easy-to-understand heuristic, avoid high-sounding and empty presentations

### Safety Production

### Coding

1 Code standards

Naming; unified encoding format; tab indentation; semicolons

2 Static code analysis
eslint
eslint-watch

### Test


Self-test

---

Test cases

Automated testing

Exception handling
Online monitoring alarm: Interface jserror pv month-on-month decline White screen monitoring

Physical impact + Notify business parties

### Release
1 diff + code review
2 grayscale + rollback
3 verification in real online environment (public access)
### Frontend monitoring
---

Collection plan: Based on Element timing + Performance Observer, custom attribute reporting

Approach to real-time calculation of massive data: Space for time -> Pre-calculate the data cube, just take it out when needed -->
---
---

---

---
---
