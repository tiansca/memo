const axios = require('axios')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
const getZhihuDetail = require('../utils/getZhihuDetail')
const getNewsList = require('../utils/getNewsList')

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
}

const getNews = async () => {
    // 列表页
    const listUrl = encodeURI('https://www.zhihu.com/people/mt36501/posts')
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
        news = await getNews()
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

