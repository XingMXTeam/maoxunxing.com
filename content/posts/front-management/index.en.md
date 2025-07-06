title: "Admin/Backend Solutions"
date: 2025-02-06
tags:
  - Web Development
  - Admin/Backend
---
Building an admin/backend architecture based on ice 3.0
## Communication Mechanism
Store communication and event communication
## Permission Control
Use the `defineAuthConfig` method to define permissions.
Permissions are provided through the `import { useAuth } from 'xiaoer-auth'` component.
This plugin is not loaded by default; it's only enabled when configured in the config.
Declarative
```js
// Permission component encapsulation
function Auth({ children, authKey }) {
  const [auth] = useAuth();
  return auth[authKey] ? children : <NoAuth />;
}
// Usage example
<Auth authKey="canEdit">
  <EditButton />
</Auth>
```
Or within the current page
```js
export default function Home() {
  return <div>Home</div>
}
export const pageConfig = definePageConfig(() => ({
  auth: ['admin'],
}));
```
## Code Style
Configure a unified specification package in package.json
```js
{
  "prettier": "xiaoer-prettier-spec"
}
```
## Plugin Mechanism
Preset plugins support rapid framework-level adjustments
Supports nested configurations
Runtime plugins
## Routing
Supports nested routes
`defineConfig` supports configuring `routes: { ignores: "" }`
`pages/layout.jsx` is the global layout
`pages/list/layout.jsx` is the page layout
`Outlet` serves as the slot for child routes
```jsx
// Parent route component
function Dashboard() {
  return (
    <div>
      <h1>Shared Header</h1>
      <Outlet /> {/* Child route content is rendered here */}
    </div>
  );
}
// Route configuration
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="messages" element={<Messages />} />
  <Route path="tasks" element={<Tasks />} />
</Route>
```
Route navigation: Smooths out the differences between micro-application navigation and route path navigation
Cache route components: `<KeepAliveOutlet>` or use React 18's `<Activity>`
The route's `basename` refers to your root file directory. For example, if all your js/css files are in the 'abc' folder, and you access /home, you actually need to access
/abc/home. In this case, you need to configure `basename: 'abc'`
Extend runtime capabilities through routing, for example, by uniformly adding authentication logic to route components (by adding a Higher-Order Component)
```js
// src/app.ts
export const modifyRoutes = (routes) => {
  return routes.map(route => ({
    ...route,
    element: route.path !== '/login' ? <AuthWrapper>{route.element}</AuthWrapper> : route.element
  }));
};
```
## Requests
### Mocking
Local mock files:
- index.js
- index.css
Supports modifying the response (via `body-parser`) and automatic generation of mock data
Request API supports a `mock` field
### Custom Host
Supports defining global error handling as a plugin (referencing axios's implementation)
```js
request.createInst({
  get1: {
    url: 'xxx:geta'
  }
})
```
### Preloading
Supports page-level / API-level / global preloading
`definePageConfig` configures preloaded data
`defineConfig`
---
## Case Studies
### New Ideas for Improving R&D Efficiency
Traditional methods for improving R&D efficiency usually start with writing code efficiently, such as automation, templating, and debugging assistance. However, **hpaPaaS** proposes a completely new approach:
- **Visual Orchestration**: Quickly build applications through drag-and-drop and configuration.
- **Well-encapsulated APIs**: Lower the development barrier and improve development efficiency.
- **Model-Driven Development**: Quickly generate applications by defining business logic.
This approach is more suitable for admin/backend systems, simple applications, and prototype development. Although these applications may seem simple, according to industry data, they account for **60%** of the total applications within a company.
### Fusion Table Dropdown List Issue
### Problem Description
- The dropdown list in a Fusion table occasionally fails to display.
- **Solution**:
  - Removing the column lock property (`lock`) resolves the issue.
  - Alternatively, use the `Table.StickyLock` component to replace the column lock functionality.
### Fusion Balloon's Layering Changes
- After adding the `followTrigger` property to a Balloon, the DOM structure changes.
- **Impact**: The original Popup's layering may change, leading to style or interaction anomalies.
- `FormItem` supports nesting, just ensure the nested `name` attributes are consistent.
- Example code:
  ```jsx
  <FormItem label="Bank Account：">
    <Row gutter="4">
      <Col>
        <FormItem name="A" required requiredTrigger="onBlur">
          <Input />
        </FormItem>
      </Col>
    </Row>
  </FormItem>
  ```
- `{...this.detailField.init('xxx')}` and `name='xxx'` are equivalent.
- When using `Field.setValues`, be aware that:
  - If the data source is an array, each operation will append by default.
  - Solution:
    ```js
    this.field.remove(this.field.getNames());
- Custom form components need to implement `onChange` and `value` properties.    ```
### Usage and Optimization of the Field Form Tool
- The `Field` form tool supports manually specifying `valueName` (defaults to `value`).
- When the data source is an array, elements can be deleted or added using the `deleteArrayValue` method.
- The data source in a drawer form needs to be deep-copied before being reset to prevent modifications in the drawer from affecting the original data:
  ```js
  formFiled.validate((error, result) => {  
      if (error) return;  
      result = cloneDeep(result);  // Deep copy 
      const values = { ...tableState, dataSource: [...tableState.dataSource, result] };  
      onChange && onChange(values.dataSource);
  });
  ```
### Multi-Page Application State Sharing Problem
### Problem Description
- **Scenario**: In a multi-page application, you locate a card by searching for an ID on a list page. After clicking the card to enter the details page and then returning, you cannot find the original card.
- **Essence**: The problem of multi-page applications being unable to share state.
### Solutions
1. **URL Parameters**: Store the state in the URL and pass it via parameters.
2. **Server-side Storage**: Save the state on the server and retrieve it via an API.
3. **Local Cache**: Use the browser's `localStorage` or `sessionStorage` to store the state.
### Suggestions for Simplifying B-side (Business-facing) System Interactions
- Complex interactions in B-side systems can lead to a poor user experience.
- Example: The data for a `Table` component within a form is specified by the `dataSource` field.
- Use more intuitive UI design to reduce user operation steps.
- Provide default values or smart recommendations to reduce the user's input cost.
- For complex forms, display content progressively through step-by-step guidance or dynamic loading.
### Micro-module Design
The framework requests the path `/apps/module.aa/bb` (this path is unique) to get the micro-module's resources, and then loads them.
Then the component is mounted to the specified DOM container.
### What are Page Routes and Server Routes?
Page routes refer to the paths users access in a front-end application, usually managed by a front-end framework (like React, Vue, Angular). Page routes determine the URL seen in the browser's address bar and control the display of page content.
For example:
- `/home`: Displays the home page.
- `/about`: Displays the about us page.
- `/product/:id`: Displays the detail page for a specific product.
Server routes refer to the corresponding resources or data returned by the back-end server based on the requested URL path. Server routes are typically used to handle API requests, serve static files, etc.
For example:
- `/api/products`: Returns product list data.
- `/static/images/logo.png`: Returns a static image resource.
Although page routes and server routes are managed by the front-end and back-end respectively, they are closely related:
1. **Initial Load**  
   When a user first visits a Single Page Application (SPA), the server needs to return the corresponding HTML file based on the requested URL. If the page route and server route do not match, it can lead to a 404 error.
2. **Dynamic Loading**  
   In an SPA, a change in the page route does not trigger a page refresh but dynamically updates the page content via JavaScript. At this point, the server route is mainly used to provide API support.
3. **SEO Optimization**  
   For pages that need to be crawled by search engines, the server route must be able to correctly respond to the page route's request and return the corresponding HTML content.
Why Page Routes and Server Routes Need to be Consistent
1. **Avoid 404 Errors**  
   If the page route and server route are inconsistent, when a user directly accesses a specific page route, the server may not find the corresponding resource, resulting in a 404 error.
2. **Improve User Experience**  
   Consistent page and server routes ensure that users can access the target page normally when refreshing the page or entering the URL directly.
3. **Support SEO**  
   Search engine crawlers usually access page routes directly. If the server route cannot respond correctly, the page may not be indexed.
4. **Simplify Development and Maintenance**  
   Route consistency can reduce communication costs between front-end and back-end, avoiding development and debugging difficulties caused by routing configuration issues.
How to Handle Consistency Between Page and Server Routes
1. **Use a Front-end Routing Library**  
   Use the routing library of a modern front-end framework (like React Router, Vue Router) to define page routing rules. Ensure the routing rules are clear and consistent with business requirements.
2. **Configure a Fallback Route**  
   In an SPA, configure a fallback route (usually `/*`) to direct all unmatched requests to `index.html`, allowing the front-end router to take over.
   Example (React Router):
   ```javascript
   <BrowserRouter>
     <Routes>
       <Route path="/home" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="*" element={<NotFound />} />
     </Routes>
   </BrowserRouter>
   ```
Backend Configuration
1. **Configure Server Routing Rules**  
   Ensure the server can correctly respond to page route requests. For an SPA, you typically need to redirect all unmatched requests to `index.html`.
   Example (Nginx configuration):
   ```nginx
   location / {
       try_files $uri /index.html;
   }
   ```
2. **Differentiate API Routes and Page Routes**  
   Manage API routes and page routes separately. For example, API routes start with `/api`, while page routes map directly to static files.
   Example (Express.js):
   ```javascript
   const express = require('express');
   const app = express();
   // API Routes
   app.use('/api', apiRouter);
   // Page Routes
   app.use(express.static('public'));
   app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });
   ```
Common Problems and Solutions
Problem 1: 404 error after page refresh
- **Reason**  
  The server is not correctly configured with a fallback route, making it unable to find the corresponding static resource.
- **Solution**  
  Configure the server to redirect unmatched requests to `index.html`.
Problem 2: API request is mistaken for a page route
- **Reason**  
  The API route conflicts with the page route, causing the API request to be redirected to `index.html`.
- **Solution**  
  Clearly differentiate between API routes and page routes. For example, have API routes start with `/api`.
Problem 3: SEO optimization issue
- **Reason**  
  The page routes of an SPA cannot be correctly crawled by search engines.
- **Solution**  
  Use Server-Side Rendering (SSR) or Static Site Generation (SSG) techniques to ensure that each page route can return complete HTML content.
