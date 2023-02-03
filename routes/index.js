var express = require('express');
var router = express.Router();
var request = require('request')

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
