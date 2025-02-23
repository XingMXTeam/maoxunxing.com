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

A minimalist cartoon illustration showing a simple dashboard scene in landscape format. Two cute stick figure characters with big expressive eyes stand beside a large simplified graph display. The graph shows basic line charts representing web performance metrics.

Style elements:
- Bold black outlines around all elements
- Flat colors using only 3 colors: light blue, soft grey, and black
- White/light grey background
- Simple geometric shapes throughout

Main elements:
- A large simplified monitor/screen showing basic line charts
- Two stick figure characters with round heads and simple facial features
- One character points excitedly at the rising trend line
- Small speech bubble with "Cache hit rate ↑" text
- Simple geometric shapes representing data points and axes

Character details:
- Round heads with minimal facial features (dots for eyes, simple curved line for smile)
- Stick-like arms and legs
- One character wearing glasses made from simple circles
- Excited poses with raised arms

Composition:
- Horizontal layout with screen taking up 60% of width
- Characters positioned on either side of the screen
- Clean, uncluttered arrangement with plenty of white space

Technical specifications:
- No gradients or shadows
- Thick, consistent line weights
- Maximum 3 colors plus black outlines
- Landscape orientation (16:9 ratio)