/**
 * Created by administrator on 2019/11/4.
 */
var schedule = require('node-schedule');
var memo = require('../model/memo');
var send = require('../model/mail')

// const  scheduleCronstyle = ()=>{
//     //每分钟的第30秒定时执行一次:
//     schedule.scheduleJob('30 * * * * *',()=>{
//         console.log('scheduleCronstyle:' + new Date());
//     });
// }
//
// scheduleCronstyle();
var updateSchedule = function () {
    console.log(global.memoLength)
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
        }, function (err, data) {
        if(err){
            console.log(err)
        }else {
            global.memoLength = data.length;
            console.log(global.memoLength);
            var memoArr = data;
            for(let a = 0; a < data.length; a++){
                if(data[a].iscycle){
                    var rule = data[a].second + ' ' + data[a].minute + ' ' + data[a].hour + ' * * *';
                    var emailData = {
                        to:data[a].email,
                        subject:data[a].name,
                        content:data[a].content
                    }
                    emailDataArr.push(emailData)
                    schedule.scheduleJob('tiansc' + a, rule, function(){
                        send(emailDataArr[a])
                    });
                    // schedule.scheduleJob('tiansc' + 0,'40 * * * * *',function () {
                    //     console.log('定时任务' + a)
                    // })
                    // schedule.scheduleJob('tiansc' + 1,'50 * * * * *',function () {
                    //     console.log('定时任务2' + a)
                    // })
                }else {
                    var emailData = {
                        to:data[a].email,
                        subject:data[a].name,
                        content:data[a].content
                    }
                    emailDataArr.push(emailData)
                    schedule.scheduleJob('tiansc' + a, data[a].rundate, function(){
                        // console.log('生命，宇宙，一切的答案。。。!');
                        send(emailDataArr[a])
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

