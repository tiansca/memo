/**
 * Created by administrator on 2019/11/1.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//声明数据集
var userSchema = new Schema({
    username:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    email:{
        type:String,
        default:'xxxx@163.com'
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('users', userSchema);