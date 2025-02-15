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
    console.log(`keyword`, keyword)
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
        // 随机选择一个结果
        // const randomIndex = Math.floor(Math.random() * response.pageProps.initialResults.length);
        console.log(`response`, JSON.stringify(response.pageProps.initialResults[0]))
        return response.pageProps.initialResults[0].media;
    }
    return null;
}

async function getSvgContentFromMedia(page, media) {
    // 直接从 media URL 获取 SVG
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

    const svgContent = result.content;

    // 验证SVG内容
    if (!svgContent || !svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        console.error('无效的SVG内容:', svgContent.substring(0, 200) + '...');
        throw new Error('获取的内容不是有效的SVG');
    }
    return svgContent
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
    const svgBuffer = await getRandomIllustration(mdFilePath);
    
    // 直接加载原始SVG
    const img = await loadImage('data:image/svg+xml;base64,' + svgBuffer.toString('base64'));
    
    console.log('Original image dimensions:', img.width, 'x', img.height);
    
    // 保持原始比例进行缩放
    const maxWidth = 800;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
    const scaledWidth = Math.round(img.width * scale);
    const scaledHeight = Math.round(img.height * scale);
    
    // 居中绘制
    const imgX = Math.round((1200 - scaledWidth) / 2);
    const imgY = Math.round((630 - scaledHeight) / 2);
    
    // 绘制图片
    ctx.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);

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
    // 确保输出目录存在
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    generateCover(
        path.join(__dirname, '../content/posts/weekly6/index.zh-cn.md'),
        path.join(outputDir, 'cover.png')
    ).catch(console.error);
}
