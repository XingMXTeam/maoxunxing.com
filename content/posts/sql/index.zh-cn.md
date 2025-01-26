---
title: "Sql #1期： sql速查表 "
date: 2022-04-03T10:29:35+08:00
tags:
  - Sql
images:
  - sql/a.jpg
---

{{< table_of_contents >}}

## ddl语句(Data Definition Language)

### create table

- 基本用法  
  - 分区： 逻辑上只有一个表或者索引，但实际上你有多个物理分区
  - 生命周期： 从最后一次分区数据被修改开始计算。 分区表的回收后，该表不会被删除  
  - 例子： 创建这一张分区表，生命周期180天；创建分区，如果没有分区，可以不设置
  ```sql
  CREATE TABLE IF NOT EXISTS test(
    a STRING, b BIGINT, d STRING
  ) PARTITIONED BY(ds STRING) 
  LIFECYCLE 180
  ```

- 高级
  - 按照另外一个表结果创建表，结构和注释一致，但是生命周期不一致

  ```sql
  CREATE TABLE IF NOT EXISTS test LIKE bbb
  ```
  - 按照SELECT结果创建表； 没有分区

  ```sql
  CREATE TABLE ttt
  AS
  SELECT a, b
  FROM sss
  WHERE ds = '20180212'
  ```

### drop table

- 直接删除表，不能恢复

```sql
DROP TABLE IF EXISTS table_name
```

### alter table

- 重命名  

 ```sql
 ALTER TABLE table_name RENAME TO new_table_name
 ```

- 添加分区&删除分区  

 ```sql
 ALTER TABLE table_name ADD IF NOT EXSITS 
 PARTITION partition_spec partition_sepc: (particon_col1=partition_col1_value1,...)
 ```

 ```sql
 ALTER TABLE table_name DROP IF EXISTS 
 PARTITION partition_spec partition_spec:(partition_col1=partition_col1_value1, ...)
 ```

- 修改表结构  
  - 修改表注释
  ```sql
  ALTER TABLE table_name SET COMMENT 'table_comments'
  ```
  - 增加表字段

  ```sql
  ALTER TABLE table_name ADD COLUMNS (col1 type, col2 type, ...)
  ```
  - 修改列名
  ```sql
  ALTER TABLE table_name change COLUMN old_col RENAME TO new_col
  ```
  - 修改列注释（包含分区列注释）

  ```sql
  ALTER TABLE table_name change COLUMN col1 COMMENT 'commnets'
  ```
  - 修改表的生命周期

  ```sql
  ALTER TABLE table_name SET LIFECYCLE days;
  ```

### 查看表结构

```sql
DESC table_name
```

## dml语句(Data Manipulation Language)

### select

- 基础  

```sql
SELECT 
  a 
FROM 
  aa 
where 
  ds = '20120201'
```

- 限制条数  

```sql
SELECT 
  a 
FROM 
  aa 
where 
  ds = '20120201' 
LIMIT 
  10
```

- 去重  

```sql
SELECT 
  distinct a 
FROM 
  aa 
where 
  ds = '20120201'
```

- 数据聚合：聚合函数： `Sum Count AVG MAX/MIN` 

```sql
SELECT 
  a, 
  count(1) AS CNT 
FROM 
  aa 
where 
  ds = '20120201' 
GROUP BY 
  a 
```

- 过滤分组统计结果集  

```sql
SELECT 
  a, 
  count(1) AS CNT 
FROM 
  aa 
where 
  ds = '20120201' 
GROUP BY 
  a 
HAVING 
  count(1) > 1000
```

- 子查询： 将一个查询结果作为子表使用  

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
  atable.cc > 1000
```

- 合并多张表的数据  
限制条件： `union all`的子表，必须是字段命名相同，字段类型相同

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
  atable.cc > 1000
```

- 表关联操作，关联多个表进行数据分析  
  - 内连Inner join: 只有两个记录完全匹配才会显示出来（交集）

 ```sql
 SELECT a.* FROM a JOIN b ON (a.id=b.id)
 ```

  - 左连Left outer join: 左表全部查询；右表查询不到赋空
  - 右连Right outer join: 右表全部查询；左表查询不到赋空
  - 全连接Full outer join: 2个表都选择出来，匹配不上赋值为空

### insert

## dcl语句(Data Contol Language)

权限控制语句

## 函数

### 系统自带、自定义

### 日期格式化

`to_char('2013-03-01 00:00:02', 'yyyymmdd')`

### 日期加减

`DATETIME DATEADD(DATETIME date, BIGINT delta, STRING datepart)`  
`datepart: dd、mm、yyyy、hh、mi、ss`  

例子：
`dateadd('2005-02-28 00:00:12', 1, 'dd')'`

### 字符串拼接

`concat('ab', 'c')`

### 按照某个字段多少排序

`ROW_NUMBER() OVER(PARTITION BY col1 ORDER BY col2 DESC)`

```sql
SELECT 
  a, 
  b ROW_NUMBER() OVER(
    PARTITION BY a 
    ORDER BY 
      b DESC
  ) AS rnk 
FROM 
  (
    SELECT 
      ...
  ) atable
```

### 取某个表的最新分区

```sql
SELECT * FROM xx WHERE ds=max_pt('xx')
```
