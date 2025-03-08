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






