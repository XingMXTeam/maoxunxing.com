---
title: "Sql Diary #1: sql quick reference table"
description: "sql quick reference table"
date: 2022-04-03T10:29:35+08:00
tags:
  - Sql Diary
images:
  - sql/a.jpg
---

{{< table_of_contents >}}

## DDL Statements (Data Definition Language)

### CREATE TABLE

- **Basic Usage**  
  - **Partitioning:** Logically, there is only one table or index, but in reality, there are multiple physical partitions.
  - **Lifecycle:** The lifecycle is calculated from the last time the partition data was modified. After a partitioned table is retired, it won’t be deleted.
  - **Example:** Create a partitioned table with a lifecycle of 180 days. You can specify the partition if there is one, or skip it if there isn’t.

  ```sql
  CREATE TABLE IF NOT EXISTS test(
    a STRING, b BIGINT, d STRING
  ) PARTITIONED BY(ds STRING) 
  LIFECYCLE 180
  ```

- **Advanced Usage**
  - **Create a table based on another table’s structure:** The new table will have the same structure and comments, but a different lifecycle.

  ```sql
  CREATE TABLE IF NOT EXISTS test LIKE bbb
  ```
  - **Create a table based on a SELECT result:** No partitions are included.

  ```sql
  CREATE TABLE ttt
  AS
  SELECT a, b
  FROM sss
  WHERE ds = '20180212'
  ```

### DROP TABLE

- **Drop a table directly, without recovery:**

```sql
DROP TABLE IF EXISTS table_name
```

### ALTER TABLE

- **Rename the table:**  

 ```sql
 ALTER TABLE table_name RENAME TO new_table_name
 ```

- **Add or drop partitions:**  

 ```sql
 ALTER TABLE table_name ADD IF NOT EXISTS 
 PARTITION partition_spec (partition_col1=partition_col1_value1,...)
 ```

 ```sql
 ALTER TABLE table_name DROP IF EXISTS 
 PARTITION partition_spec (partition_col1=partition_col1_value1, ...)
 ```

- **Modify table structure:**  
  - **Change the table comment:**
  ```sql
  ALTER TABLE table_name SET COMMENT 'table_comments'
  ```
  - **Add columns to the table:**

  ```sql
  ALTER TABLE table_name ADD COLUMNS (col1 type, col2 type, ...)
  ```
  - **Rename a column:**
  ```sql
  ALTER TABLE table_name CHANGE COLUMN old_col RENAME TO new_col
  ```
  - **Modify column comments (including partition column comments):**

  ```sql
  ALTER TABLE table_name CHANGE COLUMN col1 COMMENT 'comments'
  ```
  - **Change the table lifecycle:**

  ```sql
  ALTER TABLE table_name SET LIFECYCLE days;
  ```

### View Table Structure

```sql
DESC table_name
```

## DML Statements (Data Manipulation Language)

### SELECT

- **Basic Query:**  

```sql
SELECT 
  a 
FROM 
  aa 
WHERE 
  ds = '20120201'
```

- **Limit the number of rows:**  

```sql
SELECT 
  a 
FROM 
  aa 
WHERE 
  ds = '20120201' 
LIMIT 
  10
```

- **Distinct (Remove duplicates):**  

```sql
SELECT 
  DISTINCT a 
FROM 
  aa 
WHERE 
  ds = '20120201'
```

- **Data aggregation:** Aggregate functions: `SUM`, `COUNT`, `AVG`, `MAX/MIN` 

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
```

- **Filter aggregated results:**  

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
  COUNT(1) > 1000
```

- **Subquery:** Use a query result as a subtable  

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

- **Merge data from multiple tables:**  
  The tables used in `UNION ALL` must have the same column names and types.

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

- **Join operations:** Join multiple tables for data analysis.  
  - **Inner Join:** Only shows records where there is a complete match (intersection).

 ```sql
 SELECT a.* FROM a JOIN b ON (a.id=b.id)
 ```

  - **Left Outer Join:** All records from the left table are selected; unmatched records from the right table are assigned null values.
  - **Right Outer Join:** All records from the right table are selected; unmatched records from the left table are assigned null values.
  - **Full Outer Join:** All records from both tables are selected; unmatched records are assigned null values.

### INSERT

(Details not provided)

## DCL Statements (Data Control Language)

Permission control statements.

## Functions

### System-Provided and User-Defined Functions

### Date Formatting

`TO_CHAR('2013-03-01 00:00:02', 'yyyymmdd')`

### Date Arithmetic

`DATETIME DATEADD(DATETIME date, BIGINT delta, STRING datepart)`  
`datepart` options: `dd`, `mm`, `yyyy`, `hh`, `mi`, `ss`  

Example:
`DATEADD('2005-02-28 00:00:12', 1, 'dd')`

### String Concatenation

`CONCAT('ab', 'c')`

### Sort by a Field

`ROW_NUMBER() OVER(PARTITION BY col1 ORDER BY col2 DESC)`

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
  ) atable
```

### Get the Latest Partition of a Table

```sql
SELECT * FROM xx WHERE ds=MAX_PT('xx')
```