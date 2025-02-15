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

async function getRandomIllustration() {
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

        // 从 __NEXT_DATA__ 脚本中获取数据
        const illustrations = await page.evaluate(() => {
            const nextData = document.getElementById('__NEXT_DATA__');
            if (!nextData) return null;
            
            try {
                const data = JSON.parse(nextData.textContent);
                return data.props.pageProps.illustrations;
            } catch (e) {
                return null;
            }
        });

        if (!illustrations || illustrations.length === 0) {
            throw new Error('未找到任何插图数据');
        }

        console.log(`找到 ${illustrations.length} 个插图`);
        
        // 随机选择一个插图
        const randomIllustration = illustrations[Math.floor(Math.random() * illustrations.length)];
        
        if (!randomIllustration.media) {
            throw new Error('选中的插图没有media URL');
        }

        console.log(`获取插图: ${randomIllustration.title} (URL: ${randomIllustration.media})`);

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
        }, randomIllustration.media);

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

        // 替换颜色
        const modifiedSvg = svgContent.replace(/fill="[^"]*"/g, `fill="#${COLOR}"`);
        const modifiedSvgBuffer = Buffer.from(modifiedSvg, 'utf-8');

        console.log('成功获取并验证SVG内容');
        return modifiedSvgBuffer;
    } catch (error) {
        console.error('获取unDraw插图失败:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function generateCover(mdFilePath, outputPath) {
    // 读取markdown文件并解析frontmatter
    const fileContent = fs.readFileSync(mdFilePath, 'utf8');
    const { data: frontmatter } = matter(fileContent);
    const title = frontmatter.title || 'Untitled';

    // 创建画布
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // 设置背景色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 630);

    // 获取随机SVG并转换为PNG
    const svgBuffer = await getRandomIllustration();
    
    // 使用 sharp 将 SVG 转换为 PNG
    const pngBuffer = await sharp(svgBuffer, { density: 300 })  // 增加 density 以提高质量
        .resize(800, 400, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()  // 明确指定输出格式
        .toBuffer();

    // 将PNG写入临时文件
    const tempPngPath = path.join(__dirname, 'temp.png');
    fs.writeFileSync(tempPngPath, pngBuffer);

    // 使用loadImage加载图片
    const img = await loadImage(tempPngPath);
    
    // 将图片绘制在画布上部
    const imgX = (1200 - img.width) / 2;
    const imgY = 50;
    ctx.drawImage(img, imgX, imgY);

    // 删除临时文件
    fs.unlinkSync(tempPngPath);

    // 添加装饰线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 480);
    ctx.lineTo(1000, 480);
    ctx.stroke();

    // 配置文字样式
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let fontSize = 36;
    ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    
    while (ctx.measureText(title).width > 600 && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    }

    // 绘制标题
    ctx.fillText(title, 600, 520);

    // 保存最终图像
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`封面图片已保存至 ${outputPath}`);
}

// 确保输出目录存在
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

generateCover(
    path.join(__dirname, '../content/posts/weekly6/index.zh-cn.md'),
    path.join(outputDir, 'cover.png')
).catch(console.error);
