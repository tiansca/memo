/**
 * Created by administrator on 2019/11/4.
 */
var express = require('express');
var router = express.Router();
var send = require('../model/mail')

/* GET home page. */
router.post('/',function(req, res, next) {
    var type;
    if(req.body.type && req.body.type == 'html'){
        type = 'html'
    }
    if(req.body.subject && req.body.to && req.body.content){
        var isSend = send({
            to:req.body.to,
            subject:req.body.subject,
            content:req.body.content
        },type)
        console.log(isSend)
        res.send({data:0,msg:'发送成功'})
    }else{
        res.send({data:-1,msg:'发送失败'})
    }
});

module.exports = router;
