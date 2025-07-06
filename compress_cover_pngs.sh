#!/usr/bin/env bash

# 1. 压缩所有 cover.png（大于 500KB 的才压缩）
cover_files=($(find . -type f -name "cover.png"))
total_cover=${#cover_files[@]}
count_cover=0
for file in "${cover_files[@]}"; do
    count_cover=$((count_cover+1))
    size_kb=$(du -k "$file" | cut -f1)
    if [ "$size_kb" -lt 500 ]; then
        echo "[cover $count_cover/$total_cover] 跳过 $file（已小于500KB）"
        continue
    fi
    echo "[cover $count_cover/$total_cover] 压缩 $file"
    pngquant --quality=65-80 --ext .png --force "$file"
done

# 2. 压缩 content/posts 下所有大于 500KB 的 PNG 图片（排除已在 cover_files 中的）
large_pngs=($(find content/posts/ -type f -iname "*.png" -size +500k))
total_large=${#large_pngs[@]}
count_large=0
for file in "${large_pngs[@]}"; do
    # 跳过已在 cover_files 中的文件
    skip=false
    for cover in "${cover_files[@]}"; do
        if [[ "$file" == "$cover" ]]; then
            skip=true
            break
        fi
    done
    if [ "$skip" = true ]; then
        continue
    fi
    count_large=$((count_large+1))
    echo "[large $count_large/$total_large] 压缩 $file"
    pngquant --quality=65-80 --ext .png --force "$file"
done

echo "所有 cover.png 及大图片已压缩完成。"