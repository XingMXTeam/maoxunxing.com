---
title: "SQL 语句分类与使用指南"
date: 2022-04-03T10:29:35+08:00
tags:
  - Sql
images:
  - sql/a.jpg
---

## 目录

1. [DDL 语句（Data Definition Language）](#ddl-语句data-definition-language)
   - [CREATE TABLE](#create-table)
   - [DROP TABLE](#drop-table)
   - [ALTER TABLE](#alter-table)
   - [查看表结构](#查看表结构)
2. [DML 语句（Data Manipulation Language）](#dml-语句data-manipulation-language)
   - [SELECT](#select)
   - [INSERT](#insert)
3. [DCL 语句（Data Control Language）](#dcl-语句data-control-language)
4. [常用函数](#常用函数)
   - [日期格式化](#日期格式化)
   - [日期加减](#日期加减)
   - [字符串拼接](#字符串拼接)
   - [排序与分组](#排序与分组)
   - [取最新分区](#取最新分区)

---

## DDL 语句（Data Definition Language）

### CREATE TABLE

#### 基本用法
- **分区**：逻辑上只有一个表或索引，但实际上有多个物理分区。
- **生命周期**：从最后一次分区数据被修改开始计算。分区表的回收后，该表不会被删除。

示例：
```sql
CREATE TABLE IF NOT EXISTS test(
  a STRING, b BIGINT, d STRING
) PARTITIONED BY(ds STRING) 
LIFECYCLE 180;
```

#### 高级用法
- 按照另一个表的结果创建表（结构和注释一致，但生命周期不一致）：
```sql
CREATE TABLE IF NOT EXISTS test LIKE bbb;
```

- 按照 SELECT 结果创建表（无分区）：
```sql
CREATE TABLE ttt
AS
SELECT a, b
FROM sss
WHERE ds = '20180212';
```

---

### DROP TABLE

直接删除表，无法恢复：
```sql
DROP TABLE IF EXISTS table_name;
```

---

### ALTER TABLE

#### 重命名
```sql
ALTER TABLE table_name RENAME TO new_table_name;
```

#### 添加分区 & 删除分区
- 添加分区：
```sql
ALTER TABLE table_name ADD IF NOT EXISTS 
PARTITION (partition_col1=partition_col1_value1, ...);
```

- 删除分区：
```sql
ALTER TABLE table_name DROP IF EXISTS 
PARTITION (partition_col1=partition_col1_value1, ...);
```

#### 修改表结构
- 修改表注释：
```sql
ALTER TABLE table_name SET COMMENT 'table_comments';
```

- 增加表字段：
```sql
ALTER TABLE table_name ADD COLUMNS (col1 type, col2 type, ...);
```

- 修改列名：
```sql
ALTER TABLE table_name CHANGE COLUMN old_col RENAME TO new_col;
```

- 修改列注释（包括分区列注释）：
```sql
ALTER TABLE table_name CHANGE COLUMN col1 COMMENT 'comments';
```

- 修改表的生命周期：
```sql
ALTER TABLE table_name SET LIFECYCLE days;
```

---

### 查看表结构
```sql
DESC table_name;
```

---

## DML 语句（Data Manipulation Language）

### SELECT

#### 基础查询
```sql
SELECT 
  a 
FROM 
  aa 
WHERE 
  ds = '20120201';
```

#### 限制条数
```sql
SELECT 
  a 
FROM 
  aa 
WHERE 
  ds = '20120201' 
LIMIT 
  10;
```

#### 去重
```sql
SELECT 
  DISTINCT a 
FROM 
  aa 
WHERE 
  ds = '20120201';
```

#### 数据聚合
支持聚合函数：`SUM`, `COUNT`, `AVG`, `MAX`, `MIN`。
```sql
SELECT 
  a, 
  COUNT(1) AS CNT 
FROM 
  aa 
WHERE 
  ds = '20120201' 
GROUP BY 
  a;
```

```sql
SUM(CASE
WHEN gpp.type = 'module' AND json_length(gpp.extra, '$.results') THEN json_length(gpp.extra, '$.results')
ELSE 1
END) as num
```

#### 过滤分组统计结果集
```sql
SELECT 
  a, 
  COUNT(1) AS CNT 
FROM 
  aa 
WHERE 
  ds = '20120201' 
GROUP BY 
  a 
HAVING 
  COUNT(1) > 1000;
```

#### 子查询
将一个查询结果作为子表使用：
```sql
SELECT 
  a 
FROM 
  (
    SELECT 
      b AS b_rename 
    FROM 
      btable 
    WHERE 
      ds = '20120202' 
      AND cc = '1' 
    GROUP BY 
      b
  ) atable 
WHERE 
  atable.cc > 1000;
```

#### 合并多张表的数据
限制条件：`UNION ALL` 的子表必须字段命名相同，字段类型相同。
```sql
SELECT 
  a 
FROM 
  (
    SELECT 
      b AS b_rename 
    FROM 
      btable 
    WHERE 
      ds = '20120202' 
      AND cc = '1' 
    UNION ALL 
    SELECT 
      c AS b_rename 
    FROM 
      ctable 
    WHERE 
      ds = '20100202'
  ) atable 
WHERE 
  atable.cc > 1000;
```

#### 表关联操作
- 内连接（Inner Join）：只显示两个记录完全匹配的结果（交集）。
```sql
SELECT a.* 
FROM a 
JOIN b 
ON (a.id = b.id);
```

- 左连接（Left Outer Join）：左表全部查询；右表查询不到赋空。

- 右连接（Right Outer Join）：右表全部查询；左表查询不到赋空。

- 全连接（Full Outer Join）：两个表都选择出来，匹配不上赋值为空。

---

### INSERT

（待补充）

---

## DCL 语句（Data Control Language）

权限控制语句，用于管理数据库用户的权限。

---

## 常用函数

### 日期格式化
```sql
TO_CHAR('2013-03-01 00:00:02', 'yyyymmdd');
```

---

### 日期加减
```sql
DATETIME DATEADD(DATETIME date, BIGINT delta, STRING datepart);
```
- `datepart`: `dd`（天）、`mm`（月）、`yyyy`（年）、`hh`（小时）、`mi`（分钟）、`ss`（秒）。

示例：
```sql
DATEADD('2005-02-28 00:00:12', 1, 'dd');
```

---

### 字符串拼接
```sql
CONCAT('ab', 'c');
```

---

### 排序与分组
按某个字段排序，并生成行号：
```sql
ROW_NUMBER() OVER(PARTITION BY col1 ORDER BY col2 DESC);
```

示例：
```sql
SELECT 
  a, 
  b, 
  ROW_NUMBER() OVER(
    PARTITION BY a 
    ORDER BY 
      b DESC
  ) AS rnk 
FROM 
  (
    SELECT 
      ...
  ) atable;
```

---

### 取最新分区
获取某个表的最新分区：
```sql
SELECT * 
FROM xx 
WHERE ds = MAX_PT('xx');
```

### 数据库迁移

```sql
SELECT WM_CONCAT(sql || '\n') AS sql_script
FROM (
  SELECT 
    CONCAT(
      'INSERT INTO a (id, gmt_create, gmt_modified) VALUES (',
      yuyan_id, ', SYSDATE, SYSDATE); '
    ) ||
    CONCAT(
      'INSERT INTO a_ext (id, repo_url, repo_project_id) VALUES (',
      yuyan_id, ', ''', repo_url, ''', ', orig_id, '); '
    ) ||
    CONCAT(
      'INSERT INTO b_platform_binding (id, yuyan_id, deploy_pla) VALUES (',
      yuyan_id, ', ', yuyan_id, ', ''deploy_pla_value'');'
    ) AS sql
  FROM (
    SELECT
      (1231313 + rnk) AS yuyan_id,
      pkg.id AS orig_id,
      pkg.name AS name,
      pkg.description AS description,
      'http://example.com/' || pkg.id AS repo_url -- 假设 repo_url 的值是这样生成的
    FROM (
      SELECT
        pkg.*, 
        ROW_NUMBER() OVER (PARTITION BY pkg.dt ORDER BY pkg.gmt_create) AS rnk
      FROM xxxx
      WHERE pkg.dt = MAX_PT('afxadm.bmw_pkg')
        AND pkg.is_delete = '0'
        AND pkg.name NOT LIKE '@alipay/%'
    ) pkg
  ) app
) lines;
```

### CASE WHEN 表达式

CASE WHEN 表达式通常用于对数据进行分类或标记。在聚合函数（如 COUNT、SUM 等）中，它非常有用。

```sql
SELECT COUNT(CASE WHEN p2 = 'cache_hit' THEN 1 END) AS hit_count
FROM your_table;
```

## 分析单用户行为

通过这个sql，可以知道用户具体了那些页面。进一步，从这个sql拿到设备id，知道这个用户的其他操作行为。

```text
type: 'pv' and pid: 'xxxx'
```