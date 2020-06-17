/**
 * Created by administrator on 2019/11/4.
 */
var schedule = require('node-schedule');
var memo = require('../model/memo');
var send = require('../model/mail')
var getJiari = require("../model/jiari");

// const  scheduleCronstyle = ()=>{
//     //每分钟的第30秒定时执行一次:
//     schedule.scheduleJob('30 * * * * *',()=>{
//         console.log('scheduleCronstyle:' + new Date());
//     });
// }
//
// scheduleCronstyle();
var date = ''
var jiari = ''
var getToday = function () {
    let date = ''
    const year = (new Date()).getFullYear()
    const month = (new Date()).getMonth() + 1
    const date1 = (new Date()).getDate()
    date =  year + (month > 9 ? month : ('0' + String(month))) + (date1 > 9 ? date1 : ('0' + String(date1)))
    return date
}
var updateSchedule = function () {
    console.log(global.memoLength)
    const currDay = (new Date()).getDay()
    if(global.memoLength){
        for(var a = 0; a < global.memoLength; a++){
            schedule.cancelJob('tiansc' + a);
            console.log('tiansc' + a)
        }
    }
    var emailDataArr = []
    // var count = 0;
    var currTime = (new Date()).valueOf();
    memo.find(
        {
            "$or":[{"iscycle":true,"status" : true},{"rundate":{"$gt":Date.now()},"status" : true}]
        }, async function (err, data) {
            if (err) {
                console.log(err)
            } else {
                global.memoLength = data.length;
                console.log(global.memoLength);
                var memoArr = data;
                // 设置节假日标识
                const today = getToday()
                if (date && date === today) {
                    console.log('使用', date)
                } else {
                    date = today
                    console.log('计算', date)
                    jiari = await getJiari().then(item => {
                        return item
                    }).catch(error => {
                        console.log('error', error)
                        return error
                    })
                }
                console.log('是否假日', jiari)

                for (let a = 0; a < data.length; a++) {
                    if (data[a].iscycle) {
                        // 如果选择跳过节假日
                        if (data[a].isWorkDay && jiari !== '0') {
                            continue
                        }
                        // 如果不是跳过节假日，则按照周几来处理
                        if (data[a].week.indexOf(currDay) === -1 && !data[a].isWorkDay) {
                            continue
                        }
                        var rule = data[a].second + ' ' + data[a].minute + ' ' + data[a].hour + ' * * *';
                        var emailData = {
                            to: data[a].email,
                            subject: data[a].name,
                            content: data[a].content
                        }
                        console.log(emailData)
                        emailDataArr.push(emailData)
                        schedule.scheduleJob('tiansc' + emailDataArr.length, rule, function () {
                            send(emailDataArr[emailDataArr.length - 1])
                        });
                        // schedule.scheduleJob('tiansc' + 0,'40 * * * * *',function () {
                        //     console.log('定时任务' + a)
                        // })
                        // schedule.scheduleJob('tiansc' + 1,'50 * * * * *',function () {
                        //     console.log('定时任务2' + a)
                        // })
                    } else {
                        var emailData = {
                            to: data[a].email,
                            subject: data[a].name,
                            content: data[a].content
                        }
                        console.log(emailData)
                        emailDataArr.push(emailData)
                        schedule.scheduleJob('tiansc' + emailDataArr.length, data[a].rundate, function () {
                            // console.log('生命，宇宙，一切的答案。。。!');
                            console.log(emailDataArr, emailDataArr.length)
                            send(emailDataArr[emailDataArr.length - 1])
                        });
                    }
                }
            }
        })

    memo.updateMany({"rundate":{"$lt":Date.now()},"status":true,"iscycle":false},{"status":false},function (err, row) {
        if(err){
            console.log('更新失败')
        }else {
            console.log('The raw response from Mongo was ', row)
        }
    })

}
//大于某个时间
// db.things.find({
//     "createTime":{
//         "$gt":"2018-5-21 0:0:0"
//     }
// });

module.exports = updateSchedule

