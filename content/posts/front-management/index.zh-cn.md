---
title: "中后台开发"
date: 2025-02-06
tags:
  - Web开发
---

## 目录
1. [研发效能提升的新思路](#研发效能提升的新思路)
2. [Fusion 表格下拉列表问题](#fusion-表格下拉列表问题)
3. [复杂表单的实现](#复杂表单的实现)
4. [Fusion Balloon 的层级变化](#fusion-balloon-的层级变化)
5. [FormItem 嵌套与字段管理](#formitem-嵌套与字段管理)
6. [Field 表单工具的使用与优化](#field-表单工具的使用与优化)
7. [多页应用状态共享问题](#多页应用状态共享问题)
8. [B端系统交互简化建议](#b端系统交互简化建议)

---

## 研发效能提升的新思路

传统提升研发效能的方式通常从高效写代码入手，例如自动化、模板化、辅助调试等。然而，**hpaPaaS** 提出了全新的思路：
- **可视化编排**：通过拖拽和配置快速搭建应用。
- **封装良好的 API**：降低开发门槛，提升开发效率。
- **模型驱动开发**：通过定义业务逻辑快速生成应用。

这种方式更适合中后台系统、简单应用和原型研发。虽然这些应用看似简单，但根据业界数据统计，它们占公司内应用总量的 **60%**。

---

## Fusion 表格下拉列表问题

### 问题描述
- Fusion 表格的下拉列表偶现不展示。
- **解决方法**：
  - 移除锁列属性（`lock`）即可解决问题。
  - 或者改用 `Table.StickyLock` 组件替代锁列功能。

---

## Fusion Balloon 的层级变化

### 问题描述
- 在 Balloon 中增加 `followTrigger` 属性后，DOM 结构会发生变化。
- **影响**：原先的 Popup 层级可能会发生变化，导致样式或交互异常。

---

## FormItem 嵌套与字段管理

### 特性说明
- `FormItem` 支持嵌套，只需确保嵌套的 `name` 属性保持一致。
- 示例代码：
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

### 字段管理
- `{...this.detailField.init('xxx')}` 和 `name='xxx'` 是等价的。
- 使用 `Field.setValues` 时需要注意：
  - 如果数据源是数组，每次操作会默认追加（append）。
  - 解决方法：
    ```js
    this.field.remove(this.field.getNames());
- 自定义表单组件需要实现 `onChange` 和 `value` 属性。    ```

---

## Field 表单工具的使用与优化

### 功能说明
- `Field` 表单工具支持手动指定 `valueName`（默认为 `value`）。
- 数据源为数组时，可以通过 `deleteArrayValue` 方法删除或添加元素。

### 示例代码
- 抽屉表单中的数据源在重新设置前需要深拷贝，避免抽屉修改内容影响原数据：
  ```js
  formFiled.validate((error, result) => {  
      if (error) return;  
      result = cloneDeep(result);  // 深拷贝 
      const values = { ...tableState, dataSource: [...tableState.dataSource, result] };  
      onChange && onChange(values.dataSource);
  });
  ```

---

## 多页应用状态共享问题

### 问题描述
- **场景**：多页应用中，通过列表页面搜索 ID 定位到卡片，点击卡片进入详情页后返回，无法找到原来的卡片。
- **本质**：多页应用无法共享状态的问题。

### 解决方案
1. **URL 参数**：将状态存储在 URL 中，通过参数传递。
2. **服务器存储**：将状态保存在服务器端，通过接口获取。
3. **本地缓存**：使用浏览器的 `localStorage` 或 `sessionStorage` 存储状态。

---

## B端系统交互简化建议

### 问题描述
- B端系统交互复杂，可能导致用户体验不佳。
- 示例：`Table` 组件在表单中的数据由 `dataSource` 字段指定。

### 简化建议
- 使用更直观的 UI 设计，减少用户操作步骤。
- 提供默认值或智能推荐，降低用户输入成本。
- 对于复杂表单，可以通过分步引导或动态加载的方式逐步展示内容。

---

## 微模块设计

`/apps/module.aa/bb` 框架会请求这个路径（这个路径是唯一的）获得微模块的资源，然后加载微模块的资源。 
然后组件然后挂载到指定的DOM容器

---


## 什么是页面路由和服务器路由

### 页面路由
页面路由是指前端应用中用户访问的路径，通常由前端框架（如React、Vue、Angular）管理。页面路由决定了用户在浏览器地址栏中看到的URL，并控制页面内容的展示。

例如：
- `/home`：显示首页。
- `/about`：显示关于我们页面。
- `/product/:id`：显示某个具体产品的详情页。

### 服务器路由
服务器路由是指后端服务器根据请求的URL路径返回相应的资源或数据。服务器路由通常用于处理API请求、静态文件服务等。

例如：
- `/api/products`：返回商品列表数据。
- `/static/images/logo.png`：返回静态图片资源。

---

## 页面路由与服务器路由的关系

页面路由和服务器路由虽然分别由前端和后端管理，但它们之间存在紧密的联系：
1. **初始加载**  
   当用户首次访问一个单页应用（SPA）时，服务器需要根据请求的URL返回对应的HTML文件。如果页面路由与服务器路由不一致，可能会导致404错误。

2. **动态加载**  
   在单页应用中，页面路由的变化不会触发页面刷新，而是通过JavaScript动态更新页面内容。此时，服务器路由主要用于提供API接口支持。

3. **SEO优化**  
   对于需要搜索引擎抓取的页面，服务器路由需要能够正确响应页面路由的请求，返回对应的HTML内容。

---

## 为什么页面路由与服务器路由需要一致

1. **避免404错误**  
   如果页面路由与服务器路由不一致，当用户直接访问某个页面路由时，服务器可能无法找到对应的资源，从而返回404错误。

2. **提升用户体验**  
   页面路由与服务器路由一致可以确保用户在刷新页面或直接输入URL时，能够正常访问到目标页面。

3. **支持SEO**  
   搜索引擎爬虫通常会直接访问页面路由。如果服务器路由无法正确响应，可能导致页面无法被索引。

4. **简化开发与维护**  
   路由一致性可以减少前后端沟通成本，避免因路由配置问题导致的开发和调试困难。

---

## 如何处理页面路由与服务器路由的一致性

### 前端配置
1. **使用前端路由库**  
   使用现代前端框架的路由库（如React Router、Vue Router）定义页面路由规则。确保路由规则清晰且与业务需求一致。

2. **配置Fallback路由**  
   在单页应用中，配置一个Fallback路由（通常是`/*`），将所有未匹配的请求指向`index.html`，以便前端路由接管。

   示例（React Router）：
   ```javascript
   <BrowserRouter>
     <Routes>
       <Route path="/home" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="*" element={<NotFound />} />
     </Routes>
   </BrowserRouter>
   ```

### 后端配置
1. **配置服务器路由规则**  
   确保服务器能够正确响应页面路由的请求。对于单页应用，通常需要将所有未匹配的请求重定向到`index.html`。

   示例（Nginx配置）：
   ```nginx
   location / {
       try_files $uri /index.html;
   }
   ```

2. **区分API路由和页面路由**  
   将API路由与页面路由分开管理。例如，API路由以`/api`开头，而页面路由则直接映射到静态文件。

   示例（Express.js）：
   ```javascript
   const express = require('express');
   const app = express();

   // API路由
   app.use('/api', apiRouter);

   // 页面路由
   app.use(express.static('public'));
   app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });
   ```

---

## 常见问题与解决方案

### 问题1：页面刷新后出现404错误

- **原因**  
  服务器未正确配置Fallback路由，导致无法找到对应的静态资源。

- **解决方案**  
  配置服务器将未匹配的请求重定向到`index.html`。

### 问题2：API请求被误认为页面路由

- **原因**  
  API路由与页面路由冲突，导致API请求被重定向到`index.html`。

- **解决方案**  
  明确区分API路由和页面路由。例如，API路由以`/api`开头。

### 问题3：SEO优化问题

- **原因**  
  单页应用的页面路由无法被搜索引擎正确抓取。

- **解决方案**  
  使用服务端渲染（SSR）或静态生成（SSG）技术，确保每个页面路由都能返回完整的HTML内容。





