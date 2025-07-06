#!/usr/bin/env bash

# 递归查找所有 cover.png 并用 pngquant 进行压缩，覆盖原文件
files=($(find . -type f -name "cover.png"))
total=${#files[@]}
count=0

for file in "${files[@]}"; do
    count=$((count+1))
    echo "[$count/$total] 压缩 $file"
    pngquant --quality=65-80 --ext .png --force "$file"
done

echo "所有 cover.png 已压缩完成。"