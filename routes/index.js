var express = require('express');
var router = express.Router();
var getLove = require('../utils/getLove')
var request = require('request')


/* 爱心邮件静态页面 */
router.get('/', async function (req, res, next) {
    // const email = req.query.email
    const city = req.query.city // 城市
    const day = req.query.day // 纪念日，选填
    const showNews = req.query.showNews || 'true' // 是否显示新闻，默认显示
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
    let news = []
    if (showNews === 'true') {
        try {
            news = await getLove.getNews()
        } catch (e) {
            console.log(e)
        }
    }
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.render('love', {weather, memory, one, news});
});
router.get('/test', function (req, res, next) {
    var url="https://webapi.mybti.cn/Appointment/GetBalance";
    var requestData={
        enterDates: [getTomorrow(true), getTomorrow()],
        stationName: "天通苑站",
        timeSlot: "0630-0930"
    }
    httprequest1(url,requestData).then(value => {
        res.send(value)
    }).catch(error => {
        res.send(error)
    })
})
router.get('/yuyue', function (req, res, next) {
    var enterDate = getTomorrow()
    var time = '0750-0800'
    if (req.query && req.query.time) {
        time = req.query.time
    }
    var auth
    if (req.query && req.query.auth) {
        auth = req.query.auth
    }
    var mark
    if (req.query && req.query.mark) {
        mark = req.query.mark
    }
    var url="https://webapi.mybti.cn/Appointment/CreateAppointment";
    var requestData={
        enterDate: enterDate,
        lineName: "5号线",
        snapshotTimeSlot: "0630-0930",
        snapshotWeekOffset: 0,
        stationName: "天通苑站",
        timeSlot: time}
    httprequest(url,requestData, auth, mark, 1).then(value => {
        res.send(value)
    }).catch(error => {
        res.send(error)
    })
})

var getTomorrow = function (today) {
    var mingtian = new Date()
    if (!today) {
        mingtian.setTime(mingtian.getTime()+24*60*60*1000)
    }
    let date = ''
    const year = mingtian.getFullYear()
    const month = mingtian.getMonth() + 1
    const date1 = mingtian.getDate()
    date =  year + (month > 9 ? month : ('0' + String(month))) + (date1 > 9 ? date1 : ('0' + String(date1)))
    return date
}

function httprequest(url,data, auth, mark, index){
    if(index) {
        index++
    }
    var auth = auth || 'Y2M5MmQ0ZjMtMjVjZC00Nzc1LWI2OTAtNDk2YzY4NDZjYzZmLDE1OTE4NTc2NjE4MDIsRi9vNEhuOHV1VmtLbiszTmg3TmpCZENQRGtjPQ=='
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                authorization: auth
            },
            body: data
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // 请求成功的处理逻辑
                if (body.balance >= 0) {
                    console.log('预约成功')
                    send({
                        to: '1264197264@qq.com',
                        subject: '地铁预约成功',
                        content: data.timeSlot + ' ' + (mark ? mark : '')
                    })
                } else {
                    if(index <= 4) {
                        setTimeout(() => {
                            httprequest(url,data, auth, mark, index)
                        }, 10000)
                    }
                    if (index === 5){
                        send({
                            to: '1264197264@qq.com',
                            subject: '地铁预约失败',
                            content: data.timeSlot + ' ' + (mark ? mark : '')
                        })
                    }
                }
                resolve(body)
            } else {
                if(index <= 4) {
                    setTimeout(() => {
                        httprequest(url,data, auth, mark, index)
                    }, 10000)
                }
                if (index === 5){
                    send({
                        to: '1264197264@qq.com',
                        subject: '地铁预约失败',
                        content: data.timeSlot + ' ' + (mark ? mark : '')
                    })
                }
                reject(body)
            }
        });
    })

}
function httprequest1(url,data, auth){
    var auth = auth || 'Y2M5MmQ0ZjMtMjVjZC00Nzc1LWI2OTAtNDk2YzY4NDZjYzZmLDE1OTE4NTc2NjE4MDIsRi9vNEhuOHV1VmtLbiszTmg3TmpCZENQRGtjPQ=='
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                authorization: auth
            },
            body: data
        }, function(error, response, body) {
            console.log(body)
            if (!error && response.statusCode == 200) {
                console.log(body) // 请求成功的处理逻辑
                resolve(body)
            } else {
                reject(body)
            }
        });
    })

}

module.exports = router;
