const axios = require('axios')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
const getZhihuDetail = require('../utils/getZhihuDetail')
const getNewsList = require('../utils/getNewsList')
const regionMap = require('./region_map.json')

const getOneData = async () => {
    const data = await axios.get('http://wufazhuce.com/')
    // console.log(data.data)
    const document = new JSDOM(data.data).window.document;
    const obj = {}
    obj.img = document.querySelector('.carousel-inner>.item:first-child img').getAttribute('src')
    obj.text = document.querySelector('.carousel-inner>.item:first-child .fp-one-cita>a').innerHTML
    return obj
}

const getWeather = async (city) => {
    if (!city) {
        return null
    }
    try {
        const weatherUrl = encodeURI(`https://devapi.qweather.com/v7/weather/3d?key=7ad3070c1ad34ab0b0e31606f507c7f4&location=${city}`)
        const alertUrl = encodeURI(`https://devapi.qweather.com/v7/warning/now?key=7ad3070c1ad34ab0b0e31606f507c7f4&location=${city}`)
        const res = await Promise.all([axios.request({
            url: weatherUrl,
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            }
        }), axios.request({
            url: alertUrl,
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            }
        })])
        if (!res[0].data || !res[0].data.daily) {
            return null
        }
        const weatherData = res[0].data.daily[0]
        const warningData = res[1].data
        weatherData.city = regionMap[city].county || ''
        weatherData.moreData = {
            alert:  warningData.warning
        }
        return weatherData
    } catch (e) {
        console.log(e)
        return {}
    }
}

const getNews = async () => {
    // 列表页
    const listUrl = encodeURI('https://www.zhihu.com/people/mt36501/posts')
    const { data } = await axios.request({
        url: listUrl,
        method: 'get',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Origin': 'https://www.zhihu.com',
            'Referer': 'https://www.zhihu.com'
        }
    })
    // console.log(data)
    const document = new JSDOM(data).window.document;
    const firstListItem = document.querySelector('.ListShortcut .List-item .ContentItem-title a')
    if (!firstListItem) {
        return []
    }
    let detailUrl = firstListItem.getAttribute('href')
    if (detailUrl.indexOf('http') === -1) {
        detailUrl = 'http:' + detailUrl
    }
    // detailUrl = 'https://zhuanlan.zhihu.com/p/598129736'

    // 详情页
    // 方法1、通过headless浏览器打开页面并解析内容
    return await getZhihuDetail(detailUrl)

    // 方法2、get请求直接获取内容
    /*const pageData = await axios.request({
        url: encodeURI(detailUrl),
        method: 'get',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    })
    const detailDocument = new JSDOM(pageData.data).window.document;
    const contentEl = detailDocument.querySelector('.Post-RichTextContainer .RichText')
    const contentListEl = contentEl.childNodes
    return getNewsList(contentListEl)*/
}

// 计算纪念日
function getMemory(day) {
    const dayTimestamp = new Date(day).valueOf()
    const currTimestamp = new Date().valueOf()
    const dayCount = Math.abs((currTimestamp - dayTimestamp) / 1000 / (60 * 60 * 24))
    // console.log(dayCount)
    return Math.ceil(dayCount)
}

// 知乎日报
async function getZhihudaily() {
    const data = await axios.request({
        url: 'https://daily.zhihu.com/',
        method: 'get',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Origin': 'https://www.zhihu.com',
            'Referer': 'https://www.zhihu.com'
        }
    })

    // console.log(data.data)
    const document = new JSDOM(data.data).window.document;
    const domList = document.querySelectorAll('.main-content-wrap .wrap .box')
    const zhihuList = []
    if (domList && domList.length) {
        for (let a = 0; a < domList.length; a++) {
            if (a >= 10) {
                break
            }
            const obj = {}
            obj.link = 'https://daily.zhihu.com' + domList[a].querySelector('.link-button').getAttribute('href')
            obj.img = domList[a].querySelector('.preview-image').getAttribute('src')
            obj.title = domList[a].querySelector('.title').innerHTML
            zhihuList.push(obj)
        }
    }
    console.log('知乎list', zhihuList.length)
    return zhihuList
}

async function getData(params) {
    const {city, day, showNews, dayType} = params
    let memory = {} // 纪念日数据
    let weather = {} // 天气数据
    let one = {} // 每日一图数据
    let news = [] // 新闻数据
    weather = await getWeather(city)
    one = await getOneData()
    if (day) {
        memory.dayCount = getMemory(day)
        memory.text = dayType
    }
    if (showNews) {
        news = await getZhihudaily()
    }
    const pageData = {
        memory,
        weather,
        one,
        news
    }
    for (const key in pageData) {
        console.log(key, pageData[key])
    }
    return pageData
}

module.exports = {getOneData, getWeather, getNews, getMemory, getData};

