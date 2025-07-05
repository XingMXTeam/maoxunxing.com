# 🐚 Shell Script Translation Guide

使用 Gemini CLI 的 shell 脚本翻译方案，无需 API Key，直接调用本地 Gemini CLI。

## 快速开始

### 1. 安装 Gemini CLI
```bash
npm install -g @google/gemini-cli
```

### 2. 认证（如果需要）
```bash
gemini auth
```

### 3. 开始翻译

#### 方法一：简单批量翻译（推荐）
```bash
npm run translate:simple
```

#### 方法二：完整功能脚本
```bash
# 翻译所有文件
npm run translate:shell:all

# 翻译指定目录
npm run translate:shell:all content/notes

# 翻译单个文件
npm run translate:shell content/notes/example/index.zh-cn.md
```

## 脚本说明

### `translate-simple.sh` - 简单版本
- ✅ 自动查找所有 `*.zh-cn.md` 文件
- ✅ 保持 Markdown 格式
- ✅ 自动创建输出目录
- ✅ 包含延迟避免频率限制

### `translate-gemini-shell.sh` - 完整版本
- ✅ 所有简单版本功能
- ✅ 分别翻译 frontmatter 和内容
- ✅ 彩色输出和进度显示
- ✅ 错误处理和验证
- ✅ 支持单文件和批量翻译

## 使用示例

### 测试 Gemini CLI
```bash
# 检查是否安装
gemini --version

# 测试翻译
echo "你好世界" | gemini
```

### 批量翻译
```bash
# 最简单的方式
npm run translate:simple

# 或者直接运行脚本
bash scripts/translate-simple.sh
```

### 翻译单个文件
```bash
# 使用完整脚本
npm run translate:shell content/notes/example/index.zh-cn.md

# 或者直接使用 gemini
echo "请翻译这个中文文本" | gemini > output.txt
```

## 优势

✅ **无需 API Key** - 直接使用本地 CLI  
✅ **无需网络问题** - 本地调用，避免超时  
✅ **简单易用** - 一行命令完成批量翻译  
✅ **保持格式** - 保留所有 Markdown 格式  
✅ **免费使用** - 使用 Gemini CLI 免费额度  

## 注意事项

1. **首次使用需要认证**：运行 `gemini auth` 进行认证
2. **频率限制**：脚本包含延迟，避免触发频率限制
3. **文件格式**：确保中文文件以 `.zh-cn.md` 结尾
4. **输出文件**：英文文件会自动保存为 `.en.md`

## 故障排除

### 如果遇到认证问题
```bash
gemini auth
```

### 如果 CLI 未安装
```bash
npm install -g @google/gemini-cli
```

### 如果权限问题
```bash
chmod +x scripts/*.sh
```

### 如果网络问题
- 确保 VPN 连接正常
- 尝试重新认证：`gemini auth`

## 完整工作流程

```bash
# 1. 安装 CLI
npm install -g @google/gemini-cli

# 2. 认证（如果需要）
gemini auth

# 3. 测试 CLI
echo "Hello" | gemini

# 4. 开始翻译
npm run translate:simple

# 5. 检查结果
ls content/notes/*/index.en.md
```

🎉 现在你可以轻松翻译所有中文文章了！ 