var request = require("request");
var getToday = function () {
    let date = ''
    const year = (new Date()).getFullYear()
    const month = (new Date()).getMonth() + 1
    const date1 = (new Date()).getDate()
    date =  year + (month > 9 ? month : ('0' + String(month))) + (date1 > 9 ? date1 : ('0' + String(date1)))
    return date
}
// 0:工作日   1:周末    2:节假日
var getJiari = function () {
    return new Promise(function (resolve, reject) {
        request('http://tool.bitefu.net/jiari/?d=' + getToday(), function (error, response, body) {
            console.log(body)
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the baidu homepage.
                resolve(body)
            } else {
                reject('-1')
            }
        })
    })
}

module.exports = getJiari;
