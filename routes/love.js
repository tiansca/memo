var express = require('express');
var router = express.Router();
var send = require('../model/mail')
const writePage = require('../utils/getLove')
const axios = require("axios");

router.get('/sendEmail',async function (req, res, next) {
    const email = req.query.email
    const city = req.query.city
    const day = req.query.day || ''
    if (!email || !city) {
        res.send({
            error: '缺少参数',
            code: -1
        })
        return
    }
    const origin = req
    // console.log(req)
    console.log(req.url)
    console.log(global.port)
    // 爬页面数据，发邮件
    try {
        const url = `http://localhost:${global.port}/?city=${city}&day=${day}`
        const data = await axios.get(encodeURI(url))
        // console.log(data.data)
        send({
            to: email,
            subject: 'love email',
            content: data.data
        }, 'html')
        res.send({
            code: 0,
            data: '发送成功'
        })
    } catch (e) {
        console.log(e)
        res.send({
            code: -1,
            data: '发送失败',
            error: e
        })
    }
});

module.exports = router;