/**
 * Created by administrator on 2019/11/4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memoSchema = new Schema({
    name:String,
    content:String,
    createAt:{
        type:Date,
        default:Date.now()
    },
    rundate:Date,
    iscycle:{
        type:Boolean,
        default:false
    },
    hour:Number,
    minute:Number,
    second:{
        type:Number,
        default:0
    },
    username:String,
    email:String,
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('memo', memoSchema);