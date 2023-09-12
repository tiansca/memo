var express = require('express');
var router = express.Router();
const getPageData = require('../utils/getPageData')
const axios = require('axios')
const send = require('../utils/mail')
const getPageAndSendEmail = require('../utils/getPageAndSendEmail')
const {getData} = require("../utils/getPageData");
const path = require('path')

/* 邮件页面 */
router.get('/page', async function (req, res, next) {
  // const email = req.query.email
  const city = req.query.city // 城市
  const day = req.query.day // 纪念日，选填
  const showNews = req.query.showNews || 'true' // 是否显示新闻，默认显示
  const dayType = req.query.dayType || '今天是我们在一起的第'
  if (!city) {
    res.send({
      massage: '缺少city参数',
      code: -1
    })
    return
  }
  try {
    const pageData = await getPageData.getData({city, day, showNews, dayType})
    res.render('mail', pageData);
  } catch (e) {
    console.log(e)
    next(e)
  }

});

// 发邮件
router.get('/send',async function (req, res, next) {
  const email = req.query.email
  const city = req.query.city
  const day = req.query.day || ''
  const subject = req.query.subject || '一封暖暖的邮件'
  const showNews = req.query.showNews || 'true' // 是否显示新闻，默认显示
  const dayType = req.query.dayType || '今天是我们在一起的第'
  if (!email || !city) {
    res.send({
      massage: '缺少参数',
      code: -1
    })
    return
  }
  // 爬页面数据，发邮件
  try {
    await getPageAndSendEmail({
      email,
      city,
      day,
      subject,
      showNews,
      dayType
    })
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
router.get('/icon',async function (req, res, next) {
  const iconCode = req.query.code
  if (!iconCode) {
    res.send("code is required")
  }
  const {data} = await axios.request({
    url: `https://a.hecdn.net/img/common/icon/202106d/${iconCode}.png`,
    method: 'get',
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
      referer: 'https://a.hecdn.net/img/'
    }
  })
  console.log(data)
  // res.setEncoding("binary")
  res.setHeader('Content-Type', 'image/png')
  res.send(data)
});

module.exports = router;
