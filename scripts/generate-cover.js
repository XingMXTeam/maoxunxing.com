const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');
const sharp = require('sharp');
const puppeteer = require('puppeteer');

const COLOR = '6C63FF'; // 统一的主题色

// 修改重试函数以支持 POST 请求
async function fetchWithRetry(url, options, maxRetries = 6) {
    const fetch = (await import('node-fetch')).default;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`尝试获取SVG (${i + 1}/${maxRetries})...`);
            const response = await fetch(url, {
                ...options,
                timeout: 15000,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'content-type': 'application/json',
                    'cookie': '_ga=GA1.1.331121143.1739598893; _ga_BJX76M5QD8=GS1.1.1739604273.1.0.1739604279.0.0.0',
                    'dnt': '1',
                    'origin': 'https://undraw.co',
                    'referer': 'https://undraw.co/illustrations',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                    'priority': 'u=1, i',
                    ...options.headers
                },
                // 添加更多的 fetch 选项
                credentials: 'include',
                mode: 'cors',
                cache: 'no-cache',
                redirect: 'follow',
                referrerPolicy: 'strict-origin-when-cross-origin'
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
            }
            
            return await response.buffer();
        } catch (error) {
            console.log(`第 ${i + 1} 次尝试失败:`, error.message);
            lastError = error;
            // 增加重试间隔时间
            if (i < maxRetries - 1) {
                const delay = 2000 * Math.pow(2, i); // 指数退避
                console.log(`等待 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

async function searchIllustration(page, mdFilePath) {
    const keyword = process.argv[2] || 'react';
    // 获取图片索引参数，默认为0（第一张）
    const imageIndex = parseInt(process.argv[3]) || 0;
    
    // 构建API URL
    const apiUrl = `https://undraw.co/_next/data/QEhEuZcohYSR0YIqIdBj4/search/${keyword}.json?term=${keyword}`;
    
    // 设置请求头
    const headers = {
        'accept': '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-nextjs-data': '1'
    };

    // 使用 page.evaluate 发送请求

    const response = await page.evaluate(async (url, headers) => {
        const resp = await fetch(url, { headers });
        return resp.json();
    }, apiUrl, headers);

    
    if (response && response.pageProps?.initialResults && response.pageProps?.initialResults.length > 0) {
        const results = response.pageProps.initialResults;
        // 确保索引在有效范围内
        const validIndex = Math.min(Math.max(1, imageIndex), results.length - 1);
        console.log(`找到 ${results.length} 张图片，使用第 ${validIndex + 1} 张`);
        return results[validIndex-1].media;
    }
    return null;
}

async function getSvgContentFromMedia(page, media) {
    const result = await page.evaluate(async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'image/svg+xml,*/*',
                    'Referer': 'https://undraw.co/illustrations'
                }
            });
            
            if (!response.ok) {
                return {
                    success: false,
                    error: `HTTP error! status: ${response.status}`,
                    responseText: await response.text()
                };
            }
            
            const text = await response.text();
            return {
                success: true,
                content: text
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }, media);

    if (!result.success) {
        console.error('获取SVG失败:', result.error);
        if (result.responseText) {
            console.error('响应内容:', result.responseText);
        }
        if (result.stack) {
            console.error('错误堆栈:', result.stack);
        }
        throw new Error('获取SVG失败: ' + result.error);
    }

    let svgContent = result.content;

    // 验证SVG内容
    if (!svgContent || !svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        console.error('无效的SVG内容:', svgContent.substring(0, 200) + '...');
        throw new Error('获取的内容不是有效的SVG');
    }

    // 修改SVG的viewBox和尺寸
    svgContent = svgContent.replace(/<svg[^>]*>/, (match) => {
        return match
            .replace(/width="[^"]*"/, 'width="1200"')
            .replace(/height="[^"]*"/, 'height="630"')
            .replace(/viewBox="[^"]*"/, 'viewBox="0 0 1200 630"');
    });

    return svgContent;
}

async function getRandomIllustration(mdFilePath) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        console.log('正在访问 unDraw 网站...');
        await page.goto('https://undraw.co/illustrations', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        const media = await searchIllustration(page, mdFilePath)
        const svgContent = await getSvgContentFromMedia(page, media)
        
        // 直接返回原始SVG内容，不做任何修改
        return Buffer.from(svgContent, 'utf-8');
    } catch (error) {
        console.error('获取unDraw插图失败:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function generateCover(mdFilePath, outputPath) {
    // 创建画布
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // 设置背景色为浅灰色
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 1200, 630);

    // 获取SVG
    const svgContent = await getRandomIllustration(mdFilePath);
    
    // 加载调整后的SVG
    const img = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64'));
    
    // 直接绘制图片，不需要缩放
    ctx.drawImage(img, 0, 0, 1200, 630);

    // 保存最终图像
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`封面图片已保存至 ${outputPath}`);
}

// 在文件末尾添加
module.exports = {
    generateCover
};

// 如果直接运行此文件，则生成示例封面
if (require.main === module) {
    // 获取执行命令时的目录和当前工作目录
    const rootDir = process.cwd();
    const currentDir = process.env.INIT_CWD || rootDir; // INIT_CWD 是 npm 提供的原始执行目录
    
    console.log('当前执行目录:', currentDir);
    
    // 检查当前目录是否包含 index.zh-cn.md
    const mdFile = path.join(currentDir, 'index.zh-cn.md');
    if (!fs.existsSync(mdFile)) {
        console.error('错误: 当前目录下未找到 index.zh-cn.md 文件');
        console.error('请确保在包含 index.zh-cn.md 的目录下执行命令');
        console.error('例如: cd content/posts/react-3 && npm run cover');
        process.exit(1);
    }

    console.log('使用方法: node generate-cover.js [关键词] [图片索引(1开始)]');
    console.log('例如: npm run cover react 2');

    generateCover(
        mdFile,
        path.join(currentDir, 'cover.png')
    ).catch(console.error);
}
