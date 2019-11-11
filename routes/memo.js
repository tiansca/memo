/**
 * Created by administrator on 2019/11/4.
 */
var express = require('express');
var router = express.Router();
var Memo = require('../model/memo');
var Users = require('../model/users');
// var bodyParser = require('body-parser')
// const db = require('../config/db')
// var await = require('await');

/* GET users listing. */
router.post('/',function(req, res, next) {
    var postData = {
        name: req.body.name,
        content: req.body.content,
        rundate: req.body.rundate,
        iscycle: req.body.iscycle,
        hour:req.body.hour,
        minute:req.body.minute,
        second:req.body.second,
        username:req.body.username
    };

    Users.findOne({username:postData.username},function (err, data) {
        if(err || !data){
            res.send({data:-1,msg:'用户不存在'})
        }else {
            console.log(data);
            var user = data;
            postData.email = req.body.email || user.email
            Memo.create(postData,function (err, data) {
                if(err)  throw err;
                console.log('新增');
                // res.redirect('/userL')
                res.send({data:0,msg:'新增成功'})
            })
        }
    })
});
router.get('/getbyuser',function(req, res, next) {
    if(req.query && req.query.username){
        Memo.find({username:req.query.username},function (err,data) {
            if(err){
                res.send({data:1,msg:'查询失败'})
            }else {
                res.send({code:0,data:data})
            }
        })
    }else {
        res.send({code:-1,msg:"缺少参数"})
    }
});

router.get('/remove',function(req, res, next) {
    if(req.query && req.query.id){
        Memo.findByIdAndRemove(req.query.id,function (err,data) {
            if(err){
                res.send({data:1,msg:'删除失败'})
            }else {
                res.send({code:0,data:"删除成功"})
            }
        })
    }else {
        res.send({code:-1,msg:"缺少参数"})
    }
});

router.get('/updatestatus',function(req, res, next) {
    if(req.query && req.query.id){
        Memo.findOne({"_id":req.query.id},function (err,data) {
            if(err){
                res.send({code:1,msg:'切换失败'})
            }else {
                var memoStatus = !data.status
                if(data.iscycle || data.rundate > Date.now() || memoStatus==false){
                    Memo.update({"_id":req.query.id},{"status":memoStatus},function (err,row) {
                        if(err){
                            res.send({code:2,msg:'切换失败'})
                        }else {
                            res.send({code:0,msg:'切换成功'})
                        }
                    })
                }else {
                    var year = (new Date()).getFullYear();
                    var month = (new Date).getMonth() + 1;
                    var date = (new Date).getDate();
                    var newDate = new Date(year + '-' + month + '-' + date + ' ' + data.hour + ':' + data.minute + ":" + data.second);
                    console.log(newDate);
                    if(newDate < Date.now()){
                        newDate = new Date(newDate.valueOf() + 86400000)
                    }
                    Memo.update({"_id":req.query.id},{"status":memoStatus,"rundate":newDate},function (err,row) {
                        if(err){
                            res.send({code:3,msg:'切换失败'})
                        }else {
                            res.send({code:0,msg:'切换成功'})
                        }
                    })
                }
                // res.send({code:0,data:"删除成功"})
            }
        })
    }else {
        res.send({code:-1,msg:"缺少参数"})
    }
});

router.post('/update',function(req, res, next) {
        var postData = {
            name: req.body.name,
            content: req.body.content,
            rundate: req.body.rundate,
            iscycle: req.body.iscycle,
            hour:req.body.hour,
            minute:req.body.minute,
            second:req.body.second,
            username:req.body.username,
            email:req.body.email,
            _id:req.body._id
        };
        console.log(postData)
        Memo.findOne({"_id":postData._id},function (err,data) {
            if(err){
                res.send({code:1,msg:'编辑失败'})
            }else {
                Memo.update({"_id":postData._id},{"status":true,"rundate":postData.rundate,name:postData.name,content:postData.content, iscycle:postData.iscycle,hour:postData.hour,minute:postData.minute,email:postData.email},function (err,row) {
                    if(err){
                        res.send({code:3,msg:'编辑失败'})
                    }else {
                        res.send({code:0,msg:'编辑成功'})
                    }
                })
            }
        })
});


module.exports = router;
