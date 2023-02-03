const puppeteer = require('puppeteer')
const getNewsList = require('./getNewsList')

const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM

let browser = null
let page = null
const sleep = function (time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('')
        }, time || 1000)
    })
}
async function openBrowser() {
    browser = await puppeteer.launch({
        args: [
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ],
        headless: true,
        // devtools: true
    });
}

async function openPage(url) {
    if (!browser) {
        await openBrowser()
    }
    try{
        page = await browser.newPage();
        // await page.setViewport({width: 390, height: 844});
    }  catch (e) {
        await browser.close();
        return
    }

    try {
        await page.goto(url, {
            waitUntil: ['load', // Remove the timeout
                'domcontentloaded',  //等待 “domcontentloaded” 事件触发
                'networkidle2', // 500ms内请求数不超过2个
            ],
            timeout: 1000 * 60,
        })
        // 注入全局函数
        await page.exposeFunction('getNewsList', getNewsList);
        await page.exposeFunction('sleep', sleep);
        console.log('打开页面成功 ')
        console.log('滚动页面...')
        // 滚动页面
        const dimensions = await page.evaluate(async (lazy) => {
            // 滚动页面
            const height = document.body.scrollHeight
            const page = Math.ceil(height / 700)
            if (page < 30) {
                for (let a = 0; a < page; a++) {
                    window.scrollTo({
                        top: (a + 1) * 700,
                        left: 0,
                        behavior: 'smooth'
                    })
                    await sleep(500)
                }
            }
        });
        await sleep(2000)
        console.log('解析html')
        const list = await page.$$eval('.Post-RichTextContainer .RichText>p, .Post-RichTextContainer .RichText>figure, .Post-RichTextContainer .RichText>div', getNewsList)
        const elementHandle = await page.$$('.RichText iframe');
        const videoList = []
        for (let a = 0; a < elementHandle.length; a++) {
            const iframeItem = await elementHandle[a].contentFrame()
            // console.log(iframeItem)
            const videoObj = {}
            if (await iframeItem.$('video')){
                const video = await iframeItem.$eval('video', video => video.getAttribute('src'))
                const cover = await iframeItem.$eval('img', img => img.getAttribute('src'))
                videoList.push({video, cover})
            }
        }
        // console.log('videoList', videoList)
        for (const listItem of list) {
            if (listItem.type === 'video' && !listItem.data) {
                listItem.data = videoList.splice(0, 1)[0]
            }
        }
        // console.log('list', list)
        return list
    } catch (e) {
        console.log(e)
        await page.close()
        return
    }
}
module.exports = openPage