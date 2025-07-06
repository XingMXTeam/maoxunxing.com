---
title: "Frontend Tracking Guide"
date: 2024-12-09
description: ""
tags:
  - Web Development
  - Tracking
custom_toc:
  - title: "SPM Tracking"
  - title: "Automatic Exposure"
images:
  - spm/cover.png
---
## SPM Tracking
SPM (Super Position Model) is a tracking model used to trace user behavior and sources. It is widely applied in data analysis, traffic source tracking, and user behavior analysis. With SPM parameters, you can accurately identify the user's source field, exposure position information, and the unique identifier for a session or operation.
---
## SPM Parameter Description
### spm-url
- **Purpose**  
  `spm-url` is used to identify the user's source field, i.e., from which page or channel the user entered the current page.
- **Application Scenario**  
  For example, when a user navigates to the target page from a search engine, an ad link, or an internal recommendation slot, `spm-url` can record the specific source information.
### spm-cnt
- **Purpose**  
  `spm-cnt` is used to identify exposure position information, usually indicating the specific position of a piece of content or a module on the page.
- **Characteristics**  
  If a page navigation occurs, `spm-cnt` is automatically carried over to the URL of the target page, enabling cross-page exposure tracking.
- **Example**  
  On a product detail page, `spm-cnt` can mark the specific position of a recommended product (e.g., row 3, column 2).
### pageid
- **Purpose**  
  `pageid` is a unique identifier for each session or operation, used to distinguish different user actions or sessions.
- **Generation Rule**  
  It is recommended to generate a new `pageid` for each session, or even for each operation, to ensure data accuracy and traceability.
- **Application Scenario**  
  For example, when a user clicks a button or completes an action, a new `pageid` is generated for subsequent analysis.
---
## Tracking Case Study
The following is a typical SPM tracking case study:
### Scenario Description
Assume a user clicks on a recommendation slot on the homepage to enter a product detail page and completes a purchase on that page.
### Tracking Implementation
1. **Homepage Recommendation Click**
   - The user clicks on a recommended product on the homepage.
   - Tracking parameters:
     ```javascript
     spm-url: "home.recommend" // Source field: homepage recommendation slot
     spm-cnt: "item_001"       // Exposure position: 1st product in the recommendation slot
     pageid: "1234567890abcdef" // Unique identifier for the current operation
     ```
2. **Navigate to Product Detail Page**
   - After the user navigates to the product detail page, `spm-cnt` is automatically carried over in the URL.
   - Example Product Detail Page URL:
     ```
     https://example.com/product?id=123&spm-url=home.recommend&spm-cnt=item_001&pageid=1234567890abcdef
     ```
3. **Complete Purchase Operation**
   - The user completes the purchase operation on the product detail page.
   - Tracking parameters:
     ```javascript
     spm-url: "home.recommend" // Source field: homepage recommendation slot
     spm-cnt: "item_001"       // Exposure position: 1st product in the recommendation slot
     pageid: "abcdef1234567890" // New unique identifier for the operation
     action: "purchase"        // User action: purchase
     ```
### Data Analysis
Through the tracking above, the following information can be analyzed:
- Which page or recommendation slot the user entered the product detail page from.
- Which specific product in the recommendation slot was clicked.
- Whether the user completed the purchase operation.
---
## Automatic Exposure
### MutationObserver
- **Purpose**: To monitor changes in the DOM tree.
- **Functionality**:
  - Detects element additions, deletions, attribute changes, etc.
- **In our code**:
  - Used to detect when a new target element is added to the DOM.
  - When a new element is added, it is registered with an `IntersectionObserver` to monitor its exposure status.
> **Additional Note**: `MutationObserver` is a powerful tool that can efficiently listen for dynamic changes in the DOM without significantly impacting performance.
### IntersectionObserver
- **Purpose**: To monitor the intersection status of an element with the viewport (or a specified root element).
- **Functionality**:
  - Detects whether an element enters or leaves the viewport.
- **In our code**:
  - Used to detect when a target element enters the viewport (i.e., is exposed).
  - When the element enters the viewport, it triggers a callback function and stops observing that element.
> **Additional Note**: `IntersectionObserver` is a lightweight way to avoid frequent scroll event listeners, thereby improving performance.
## Code Implementation
The following is the complete implementation code, showing how to combine `MutationObserver` and `IntersectionObserver` to detect the exposure status of a target element.
```js
// Throttle function
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}
/**
 * Listens for the exposure status of a target element
 * @param {string} targetElement - The selector for the target element
 * @param {Function} callback - The callback function for when exposure occurs
 */
function observeElementExposure(targetElement, callback) {
  // Create a throttled callback function
  const throttledCallback = throttle(callback, 500);
  // Create an IntersectionObserver instance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { // Enters the viewport
        throttledCallback(entry.target);
        observer.unobserve(entry.target); // Stop observing the element that has been exposed
      }
    });
  });
  // Create a MutationObserver instance
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(targetElement)) {
            observer.observe(node); // Start observing the newly added target element
          }
        });
      }
    });
  });
  // Start observing DOM changes
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}
// Usage example
observeElementExposure('.target-div', (element) => {
  console.log('Target div has been exposed:', element);
});
```
