---
title: "SQL Statement Classification and Usage Guide"
date: 2022-04-03T10:29:35+08:00
tags:
  - Sql
images:
  - sql/a.jpg
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [DDL Statements (Data Definition Language)](#ddl-statementsdata-definition-language)
- [CREATE TABLE](#create-table)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
  - [DROP TABLE](#drop-table)
- [ALTER TABLE](#alter-table)
    - [Rename](#rename)
    - [Add partition & Delete partition](#add-partition--delete-partition)
    - [Modify table structure](#modify-table-structure)
- [View table structure](#view-table-structure)
- [DML statements (Data Manipulation Language)](#dml-statementsdata-manipulation-language)
- [SELECT](#select)
- [Basic queries](#basic-queries)
- [Limit the number of items](#limit-the-number-of-items)
    - [Deduplication](#deduplication)
    - [Data aggregation](#data-aggregation)
    - [Filter and group statistics result set](#filter-and-group-statistics-result-set)
- [Subquery](#subquery)
    - [Combining data from multiple tables](#combining-data-from-multiple-tables)
    - [Table join operations](#table-join-operations)
  - [INSERT](#insert)
- [Data Control Language (DCL) statements](#dcl-statementsdata-control-language)
- [Common functions](#common-functions)
  - [Date formatting](#date-formatting)
  - [Date arithmetic](#date-arithmetic)
- [String Concatenation](#string-concatenation)
  - [Sorting and Grouping](#sorting-and-grouping)
  - [Taking the Latest Partition](#taking-the-latest-partition)
  - [Database Migration](#database-migration)
- [CASE WHEN expression](#case-when-expression)
- [Analyze single-user behavior](#analyze-single-user-behavior)
- [Remove duplicate data](#remove-duplicate-data)
- [WITH statement](#with-statement)

## DDL Statements (Data Definition Language)

### CREATE TABLE

#### Basic Usage

---
- **Partitioning**: Logically, there is only one table or index, but physically, there are multiple partitions.
- **Lifecycle**: Calculated from the last time partitioned data was modified. After a partitioned table is recycled, the table is not deleted.

Example:
```sql
CREATE TABLE IF NOT EXISTS test(
a STRING, b BIGINT, d STRING
) PARTITIONED BY(ds STRING) 
LIFECYCLE 180;
#### Advanced Usage

- Create a table based on the results of another table (same structure and comments, but different lifecycle):
```sql
CREATE TABLE IF NOT EXISTS test LIKE bbb;
- Create a table based on SELECT results (no partitioning):
```sql

CREATE TABLE ttt
```
AS
SELECT a, b
```
FROM sss
WHERE ds = '20180212';
### DROP TABLE
```

Directly deletes the table, cannot be recovered:

```sql

DROP TABLE IF EXISTS table_name;
### ALTER TABLE
#### Rename
```
```sql

ALTER TABLE table_name RENAME TO new_table_name;

#### Adding Partitions & Deleting Partitions

```
- Adding Partitions:
---
```sql

ALTER TABLE table_name ADD IF NOT EXISTS
PARTITION (partition_col1='partition_col1_value1', ...);
- Delete partition:
```sql
ALTER TABLE table_name DROP IF EXISTS 
```

PARTITION (partition_col1=partition_col1_value1, ...);
---
#### Modify table structure
```
- Modify table comment:
```sql

ALTER TABLE table_name SET COMMENT 'table_comments';
- Add table field:
```sql
```
ALTER TABLE table_name ADD COLUMNS (col1 type, col2 type, ...);

- Rename columns:
```sql
ALTER TABLE table_name CHANGE COLUMN old_col RENAME TO new_col;
- Modify column comments (including partition column comments):

```sql
```
ALTER TABLE table_name CHANGE COLUMN col1 COMMENT 'comments';
- Modify the table lifecycle:

```sql
ALTER TABLE table_name SET LIFECYCLE days;
### View table structure
```

```sql
DESC table_name;
## DML Statements (Data Manipulation Language)
### SELECT
```

#### Basic Query

```
```sql
SELECT 
  a

FROM

```

  aa

WHERE
  ds = '20120201';
#### Limit the number of items
```
```sql
SELECT 
  a
FROM
```

  aa
WHERE
  ds = '20120201'
LIMIT 
```
  10;
---
#### Remove duplicates
Note that this will remove combinations of a, b, c as a whole, so if you need to remove duplicates based on a specific field, you need to use a subquery
```sql
SELECT 

```
  DISTINCT a , b, c 
---
FROM
```
aa
WHERE
  ds = '20120201';
#### Data Aggregation
Supports aggregate functions: `SUM`, `COUNT`, `AVG`, `MAX`, `MIN`.
```sql

SELECT 
  a,
COUNT(1) AS CNT 
FROM 
  aa 
WHERE
```
ds = '20120201' 
GROUP BY 
  a;
```sql
COUNT(DISTINCT col1)
```sql

SUM(CASE
WHEN gpp.type = 'module' AND json_length(gpp.extra, '$.results') THEN json_length(gpp.extra, '$.results')
ELSE 1


END) as num
#### Filter and group the statistical result set
```
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
HAVING 
  COUNT(1) > 1000;
#### Subquery
Use a query result as a subtable:
```sql
SELECT 

  a
FROM 
  (
    SELECT 
      b AS b_rename
FROM 
      btable 
```
    WHERE 
      ds = '20120202'
AND cc = '1' 
```
    GROUP BY 
      b
  ) atable
WHERE
  atable.cc > 1000;
#### Merging Data from Multiple Tables
Constraints: Subqueries in `UNION ALL` must have the same field names and field types.
```

```sql
SELECT 
  a 
FROM
```
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
```
      c AS b_rename 
    FROM
ctable 
    WHERE 
      ds = '20100202'
  ) atable
WHERE 
  atable.cc > 1000;
#### Table Association Operations
- Inner Join: Displays only the results where two records match completely (intersection).

```sql
SELECT a.* 
FROM a 
JOIN b
```
ON (a.id = b.id);
- Left Outer Join: All rows from the left table are queried; if not found in the right table, assign null.
- Right Outer Join: All rows from the right table are queried; if not found in the left table, assign null.
- Full Outer Join: Both tables are selected, and unmatched values are assigned null.

### INSERT

（To be supplemented）

```

## DCL Statement (Data Control Language)

Permission control statements, used to manage database user permissions.

## Common Functions

### Date Formatting

```sql

TO_CHAR('2013-03-01 00:00:02', 'yyyymmdd');

### Date Addition and Subtraction

```sql

DATETIME DATEADD(DATETIME date, BIGINT delta, STRING datepart);
- `datepart`: `dd` (day), `mm` (month), `yyyy` (year), `hh` (hour), `mi` (minute), `ss` (second).
Example:
```sql

DATEADD('2005-02-28 00:00:12', 1, 'dd');

### String concatenation
```sql
CONCAT('ab', 'c');
### Sorting and Grouping
Sort by a specific field and generate row numbers:

```sql
ROW_NUMBER() OVER(PARTITION BY col1 ORDER BY col2 DESC);
Example:
```sql

SELECT 

  a, 
  b, 
```
  ROW_NUMBER() OVER(

PARTITION BY a 

    ORDER BY 
      b DESC
  ) AS rnk
FROM
  (

    SELECT 
```
      ...
) atable;
### Get the latest partition
To get the latest partition of a table:
```sql
SELECT * 
FROM xx 
---
WHERE ds = MAX_PT('xx');
### Database Migration
```sql
SELECT WM_CONCAT(sql || '\n') AS sql_script
FROM (
---

  SELECT

CONCAT(
      'INSERT INTO a (id, gmt_create, gmt_modified) VALUES (',
      yuyan_id, ', SYSDATE, SYSDATE); '
    ) ||
---
CONCAT(
      'INSERT INTO a_ext (id, repo_url, repo_project_id) VALUES (',

      yuyan_id, ', ''', repo_url, ''', ', orig_id, '); '

    ) ||
CONCAT(
      'INSERT INTO b_platform_binding (id, yuyan_id, deploy_pla) VALUES (',
```
      yuyan_id, ', ', yuyan_id, ', ''deploy_pla_value'');'
---
    ) AS sql
FROM (
SELECT
(1231313 + rnk) AS yuyan_id,
```
pkg.id AS orig_id,
package.name AS name,
      package.description AS description,
      'http://example.com/' || package.id AS repo_url -- assuming repo_url is generated this way
    FROM (
```
SELECT
---
        pkg.*, 
        ROW_NUMBER() OVER (PARTITION BY pkg.dt ORDER BY pkg.gmt_create) AS rnk
      FROM xxxx
WHERE pkg.dt = MAX_PT('afxadm.bmw_pkg')
```
        AND pkg.is_delete = '0'
---
        AND pkg.name NOT LIKE '@xx/%'
    ) pkg
) app
) lines;
### CASE WHEN Expression
```
CASE WHEN Expression is commonly used for categorizing or marking data. It is very useful in aggregate functions (such as COUNT, SUM, etc.).
```sql
SELECT COUNT(CASE WHEN p2 = 'cache_hit' THEN 1 END) AS hit_count

FROM your_table;

## Analysis of single-user behavior
```

Through this SQL, you can know which pages the user has visited. Further, from this SQL, obtain the device ID to know the user's other operational behaviors.
```text
type: 'pv' and pid: 'xxxx'
## Remove duplicate data

distinct or subquery

subquery 1:

```sql
SELECT a.*, b.pv
FROM table a 


LEFT JOIN (

    SELECT trace_id, COUNT(*) AS pv 

```
    FROM table
---
WHERE ds = '${bizdate}' 
GROUP BY trace_id
) b 
ON a.trace_id = b.trace_id AND a.ds = '${bizdate}'
WHERE pv = 1;
Subquery 2:
```sql
```
SELECT  COUNT(*) as
FROM    aa

WHERE    trace_id NOT IN (
            SELECT  trace_id
            FROM    aa
WHERE ds = '${bizdate}'
            GROUP BY trace_id
            HAVING  COUNT(trace_id) > 1
        )
## WITH Statement
```
```
```
```


```
