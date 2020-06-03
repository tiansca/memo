var express = require('express');
var router = express.Router();
var send = require('../model/mail')
var request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
    //send({to:'1264197264@qq.com',subject:'测试主题',content:'<a style="color:red">测试内容</a>'},'html');
    res.send({data:0})
});
router.get('/test', function (req, res, next) {
    var url="https://webapi.mybti.cn/Appointment/GetBalance";
    var requestData={enterDates: ["20200603", "20200604"],
    stationName: "天通苑站",
    timeSlot: "0630-0930"}
    httprequest(url,requestData).then(value => {
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
    httprequest(url,requestData, auth, mark).then(value => {
        res.send(value)
    }).catch(error => {
        res.send(error)
    })
})

var getTomorrow = function () {
    var mingtian = new Date()
    mingtian.setTime(mingtian.getTime()+24*60*60*1000)
    let date = ''
    const year = mingtian.getFullYear()
    const month = mingtian.getMonth() + 1
    const date1 = mingtian.getDate()
    date =  year + (month > 9 ? month : ('0' + String(month))) + (date1 > 9 ? date1 : ('0' + String(date1)))
    return date
}

function httprequest(url,data, auth, mark){
    var auth = auth || 'Y2M5MmQ0ZjMtMjVjZC00Nzc1LWI2OTAtNDk2YzY4NDZjYzZmLDE1OTE4NTc2NjE4MDIsRi9vNEhuOHV1VmtLbiszTmg3TmpCZENQRGtjPQ=='
    var mark = data.timeSlot + ' ' + (mark ? mark : '')
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
                if (body.balance >= 0) {
                    console.log('预约成功')
                    send({
                        to: '1264197264@qq.com',
                        subject: '地铁预约成功',
                        content: mark
                    })
                } else {
                    send({
                        to: '1264197264@qq.com',
                        subject: '地铁预约失败',
                        content: mark
                    })
                }
                resolve(body)
            } else {
                send({
                    to: '1264197264@qq.com',
                    subject: '地铁预约失败',
                    content: mark
                })
                reject(body)
            }
        });
    })

}

module.exports = router;
