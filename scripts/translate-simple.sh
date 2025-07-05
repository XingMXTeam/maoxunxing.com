#!/bin/bash

# Simple Gemini CLI Translation Script
# Translates all Chinese markdown files to English

set -e

echo "🚀 Starting Gemini CLI Translation..."
echo ""

# Check if gemini CLI is available
if ! command -v gemini &> /dev/null; then
    echo "❌ Gemini CLI not found. Please install:"
    echo "   npm install -g @google/gemini-cli"
    echo "   gemini auth"
    exit 1
fi

echo "✅ Gemini CLI found: $(gemini --version)"
echo ""

# Find all Chinese files
echo "🔍 Searching for Chinese files..."
files=($(find ./content -name "*.zh-cn.md" -type f))

if [ ${#files[@]} -eq 0 ]; then
    echo "⚠️  No Chinese files found in ./content"
    exit 0
fi

echo "📁 Found ${#files[@]} Chinese files to translate"
echo ""

# Translate each file
for file in "${files[@]}"; do
    echo "📝 Translating: $file"
    
    # Create output filename
    output_file="${file/.zh-cn.md/.en.md}"
    
    # Create output directory if needed
    mkdir -p "$(dirname "$output_file")"
    
    # Read file content
    content=$(cat "$file")
    
    # Create translation prompt
    prompt="Please translate the following Chinese markdown to English. Keep all markdown formatting, structure, and syntax intact. Only translate the text content:

$content"
    
    # Translate using Gemini CLI
    echo "$prompt" | gemini > "$output_file"
    
    echo "✅ Saved: $output_file"
    echo ""
    
    # Small delay to avoid rate limiting
    sleep 2
done

echo "🎉 Translation completed! Translated ${#files[@]} files" 