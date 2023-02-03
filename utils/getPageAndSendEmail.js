const ejs = require('ejs');
const { readFile } = require('fs')
const send = require('./mail') // 发邮件
const getPageData = require("./getPageData")
const path = require('path')
async function getPageAndSendEmail(params) {
    const {city, day, email, showNews, subject, dayType} = params
    const pageData = await getPageData.getData(params)
    const html = await ejs.renderFile(
        // ejs文件路径
        "./views/mail.ejs",
        // 参数
        pageData // {memory, weather, one, news}
    )
    send({
        to: email,
        subject: subject,
        content: html
    }, 'html')
}
module.exports = getPageAndSendEmail