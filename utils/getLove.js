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

module.exports = {getOneData, getWeather};

