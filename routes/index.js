var express = require('express');
var router = express.Router();
var getLove = require('../utils/getLove')

/* 爱心邮件静态页面 */
router.get('/', async function (req, res, next) {
    // const email = req.query.email
    const city = req.query.city
    const day = req.query.day
    let memory = {}
    if (!city) {
        res.send({
            error: '缺少参数',
            code: -1
        })
        return
    }
    let weather = {}
    try {
        weather = await getLove.getWeather(city)
    } catch (e) {
        console.log(e)
    }

    console.log(weather)
    // 计算纪念日
    if (day) {
        try {
            memory.text = req.query.dayType || '今天是我们在一起的第'
            const dayTimestamp = new Date(day).valueOf()
            const currTimestamp = new Date().valueOf()
            const dayCount = Math.abs((currTimestamp - dayTimestamp) / 1000 / (60 * 60 * 24))
            // console.log(dayCount)
            memory.dayCount = Math.ceil(dayCount)
        } catch (e) {
            console.log(e)
        }

    }
    let one = {}
    try {
        one = await getLove.getOneData()
    } catch (e) {
        console.log(e)
    }
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.render('love', {weather, memory, one});
});

module.exports = router;
