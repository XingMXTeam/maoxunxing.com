const fs = require('fs');
const path = require('path');
const { generateCover } = require('./generate-cover');

// 递归获取所有 markdown 文件
function getAllMarkdownFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(getAllMarkdownFiles(fullPath));
        } else if (item.endsWith('.md')) {
            results.push(fullPath);
        }
    }

    return results;
}

async function generateAllCovers() {
    // 获取所有文章目录
    const contentDir = path.join(__dirname, '../content/post');
    const markdownFiles = getAllMarkdownFiles(contentDir);

    console.log(`找到 ${markdownFiles.length} 个 Markdown 文件`);

    // 确保输出目录存在
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 为每个文章生成封面
    for (const mdFile of markdownFiles) {
        const relativePath = path.relative(contentDir, mdFile);
        const outputName = relativePath.replace(/[\/\\]/g, '_').replace('.md', '.png');
        const outputPath = path.join(outputDir, outputName);

        console.log(`正在为 ${relativePath} 生成封面...`);
        try {
            await generateCover(mdFile, outputPath);
            console.log(`成功生成封面: ${outputPath}`);
        } catch (error) {
            console.error(`生成封面失败: ${relativePath}`, error);
        }
    }
}

generateAllCovers().catch(console.error); 