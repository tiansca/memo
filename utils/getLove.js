const axios = require('axios')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM

const getOneData = async () => {
    try {
        const data = await axios.get('http://wufazhuce.com/')
        // console.log(data.data)
        const document = new JSDOM(data.data).window.document;
        const obj = {}
        obj.img = document.querySelector('.carousel-inner>.item:first-child img').getAttribute('src')
        obj.text = document.querySelector('.carousel-inner>.item:first-child .fp-one-cita>a').innerHTML
        return obj
    } catch (e) {
        console.log(e)
    }

}

const getWeather = async (city) => {
    if (!city) {
        return null
    }
    try {
        const url = encodeURI(`http://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=${city}&needMoreData=true&pageNo=1&pageSize=1`)
        const { data } = await axios.request({
            url: url,
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            }
        })
        if (data && data.data && data.data.list) {
            return data.data.list[0]
        }
        return null
    } catch (e) {
        console.log(e)
    }
}

const getNews = async () => {
    const listUrl = encodeURI('https://www.zhihu.com/people/mt36501/posts')
    try {
        const { data } = await axios.request({
            url: listUrl,
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            }
        })
        // console.log(data)
        const document = new JSDOM(data).window.document;
        const firstListItem = document.querySelector('.ListShortcut .List-item .ContentItem-title a')
        if (!firstListItem) {
            return ''
        }
        let detailUrl = firstListItem.getAttribute('href')
        if (detailUrl.indexOf('http') === -1) {
            detailUrl = 'http:' + detailUrl
        }
        const pageData = await axios.request({
            url: encodeURI(detailUrl),
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            }
        })
        // console.log(pageData)
        const detailDocument = new JSDOM(pageData.data).window.document;
        const contentEl = detailDocument.querySelector('.Post-RichTextContainer .RichText')
        const contentListEl = contentEl.childNodes
        // console.log(contentListEl)
        const news = []
        for (const index in contentListEl) {
            const item = contentListEl[index]
            console.log(item.tagName)
            if (!item.tagName) {
                continue
            }
            const tagName = item.tagName.toLowerCase()
            if (tagName === 'p') {
                if (item.innerHTML) {
                    news.push({
                        type: 'text',
                        data: item.innerHTML,
                        index
                    })
                }
                // console.log(tagName, item.innerHTML)
            } else if (tagName === 'a') {
                if (item.getAttribute('href')) {
                    news.push({
                        type: 'video',
                        data: item.getAttribute('href'),
                        index
                    })
                }
                // console.log(tagName, item.getAttribute('href'))
            } else if (tagName === 'figure') {
                const img = item.querySelector('img')
                if (img) {
                    // console.log(tagName, img.getAttribute('data-original'))
                    news.push({
                        type: 'img',
                        data: img.getAttribute('data-original'),
                        index
                    })
                }
            }
        }
        return news
    } catch (e) {
        console.log(e)
    }
}

module.exports = {getOneData, getWeather, getNews};

