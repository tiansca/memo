var express = require('express');
var router = express.Router();
var User = require('../model/users');
var send = require('../model/mail');
// var bodyParser = require('body-parser')
// const db = require('../config/db')
// var await = require('await');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var postData = {
        username: req.body.username,
        password: req.body.password,
        // age: req.body.age,
        email: req.body.email
    };

    User.findOne({username:postData.username},function (err, data) {
        console.log(data)
        if(data){
            res.send({data:1,msg:'用户名已被注册'})
        }else{
            User.create(postData,function (err, data) {
                if(err)  throw err;
                console.log('注册成功');
                User.findOne({'username':postData.username},function (err,data1) {
                    if(err || !data1){
                        res.send({data:2,msg:'注册失败！'})
                    }else {
                        var url = 'http://106.13.66.238:3000/users/activate?id=' + data1._id;
                        send({
                            to:data1.email,
                            subject:data1.username + '账户激活',
                            content:'<a href='+ url + '>点击激活</a>'
                        },'html')
                    }
                })
                // res.redirect('/userL')
                res.send({data:0,msg:'注册成功'})
            })
        }
    });
});
router.get('/list', function (req, res) {
    var userList = User.find({}, function (err, data) {
        if (err) throw  err;
        res.send(data)
    });
});

router.get('/activate', function (req, res) {
    console.log(req.query.id)
    if(!req.query || !req.query.id){
        res.send({data:-1,msg:'缺少参数'})
    }else{
        User.findOne({_id:req.query.id},function (err, data) {
            console.log(data)
            if(data){
                User.findByIdAndUpdate(req.query.id, {status:true},function (err, ret) {
                    if(err){
                        res.send({data:1,msg:err})
                    }else{
                        res.send({data:0,msg:'激活成功'})
                    }
                })
            }else {
                res.send({data:2,msg:'参数无效'})
            }
        });

    }
})

router.post('/login', function (req, res) {
    console.log(req.body);
    if(!req.body.username || !req.body.password){
        res.send({data:-1, msg:'缺少参数'})
    }else{
        User.findOne({username:req.body.username},function (err, data) {
            if(err || !data){
                res.send({data:1,msg:'用户不存在'})
            }else {
                if(data.password == req.body.password && data.status){
                    res.send({data:0,msg:'登录成功',user:data})
                }else if(data.password != req.body.password){
                    res.send({data:2,msg:'密码不正确'})
                }else {
                    res.send({data:3,msg:'用户未激活'})
                }
            }
        })
    }
})

router.post('/update', function (req, res) {
    console.log(req.body);
    if(!req.body.email || !req.body.username || !req.body.newPassword){
        res.send({data:-1, msg:'缺少参数'})
    }else{
        User.findOne({username:req.body.username,email:req.body.email},function (err, data) {
            if(err || !data){
                res.send({data:1,msg:'用户不存在'})
            }else {
                User.update({username:req.body.username,email:req.body.email},{password:req.body.newPassword},function (err, ret) {
                 if(err){
                     res.send({data:2,msg:"修改密码失败！"})
                 }else {
                     res.send({data:0,msg:"修改密码成功！"})
                 }
                })
            }
        })
    }

})

module.exports = router;
