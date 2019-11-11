var express = require('express');
var router = express.Router();
var send = require('../model/mail')

/* GET home page. */
router.get('/', function(req, res, next) {
    //send({to:'1264197264@qq.com',subject:'测试主题',content:'<a style="color:red">测试内容</a>'},'html');
    res.send({data:0})
});

module.exports = router;
