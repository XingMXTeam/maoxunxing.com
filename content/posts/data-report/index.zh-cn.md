---
title: "[WIP] 前端性能报表"
description: ""
date: 2025-02-15
images:
  - data-report/image.png
---

## ServiceWorker缓存命中率统计【折线图】
> 或者可以直接根据pv - uv / pv 代表二次访问的命中率

```sql
(*)| SELECT
  date_format(__time__, '%m-%d %H:00:00') AS Time,
  COUNT(
    CASE
      WHEN p2 = 'cache_hit' THEN 1
    END
  ) * 100.0 / COUNT(*) as hit_rate,
  COUNT(*) as total_requests,
  COUNT(
    CASE
      WHEN p2 = 'cache_hit' THEN 1
    END
  ) as hit_count,
  COUNT(
    CASE
      WHEN p2 = 'cache_miss' THEN 1
    END
  ) as miss_count
FROM  "ods_aes_records"
WHERE
  p1 = 'pc_home_cache_stats'
group by
  Time
order by
  Time
```

## 性能分位统计

```sql
((content: 'entry_f'))| WITH extracted_data AS (
  SELECT 
    date_format(worker.__time__, '%m-%d %H:00:00') AS Time,
    regexp_extract(worker.content, '\[([^ ]+)', 1) AS trace,
    try_cast(
      regexp_extract(worker.content, 'entry_f (\d+)', 1) AS double
    ) AS duration_value,
    replace(gateway.rt, 'ms', '') AS RT
  FROM "b-worker-log" as worker
  LEFT JOIN "a-log" as gateway
  on regexp_extract(worker.content, '\[([^ ]+)', 1) =  gateway.trace
  where gateway.fn = 'xx'
)
SELECT
  Time,
  round(avg(duration_value), 2) as fAverage,
  round(approx_percentile(duration_value, 0.75), 2) as fP75,
  round(approx_percentile(duration_value, 0.90), 2) as fP90,
  round(approx_percentile(duration_value, 0.95), 2) as fP95,
  round(avg(try_cast(rt  as double)),2) as gAverage, 
  round(approx_percentile(try_cast(rt  as double), 0.75), 2) as gP75,  
  round(approx_percentile(try_cast(rt  as double), 0.90), 2) as gP90, 
  round(approx_percentile(try_cast(rt  as double), 0.95), 2) as gP95
FROM extracted_data
GROUP BY Time
ORDER BY Time 
```

## 长尾比较多的柱状图

```sql
WITH binned_data AS (
  SELECT 
    Floor((try_cast(p5 AS double) - try_cast(p4 AS double)) / 1000 / 60) AS value
  FROM 
    "xxx"
  WHERE 
    try_cast(p5 AS double) IS NOT NULL
    AND try_cast(p4 AS double) IS NOT NULL
    AND (try_cast(p5 AS double) - try_cast(p4 AS double)) >= 0
),
binned_values AS (
  SELECT
    CASE
      WHEN value >= 0 AND value < 240 THEN '0-239'
      WHEN value >= 240 AND value < 480 THEN '240-479'
      WHEN value >= 480 AND value < 720 THEN '480-719'
      WHEN value >= 720 AND value < 960 THEN '720-959'
      WHEN value >= 960 AND value < 1200 THEN '960-1199'
      WHEN value >= 1200 AND value < 1440 THEN '1200-1439'
      WHEN value >= 1440 AND value < 1680 THEN '1440-1679'
      WHEN value >= 1680 AND value < 1920 THEN '1680-1919'
      WHEN value >= 1920 AND value < 2160 THEN '1920-2159'
      WHEN value >= 2160 AND value < 2400 THEN '2160-2399'
      ELSE '2400+'
    END AS bin,
    CASE
      WHEN value >= 0 AND value < 240 THEN 0
      WHEN value >= 240 AND value < 480 THEN 240
      WHEN value >= 480 AND value < 720 THEN 480
      WHEN value >= 720 AND value < 960 THEN 720
      WHEN value >= 960 AND value < 1200 THEN 960
      WHEN value >= 1200 AND value < 1440 THEN 1200
      WHEN value >= 1440 AND value < 1680 THEN 1440
      WHEN value >= 1680 AND value < 1920 THEN 1680
      WHEN value >= 1920 AND value < 2160 THEN 1920
      WHEN value >= 2160 AND value < 2400 THEN 2160
      ELSE 2400
    END AS bin_start
  FROM 
    binned_data
)
SELECT 
  bin,
  COUNT(*) AS num
FROM 
  binned_values
GROUP BY 
  bin, bin_start
ORDER BY 
  bin_start;
```

## 分布比较均匀的柱状图

lcp分布：
```sql
select round(try_cast(c1 as double)/100, 0)*100 as val, count(*) as num where try_cast(c1 as double) > 0 and try_cast(c1 as double) < 15000 group by val order by val 
```