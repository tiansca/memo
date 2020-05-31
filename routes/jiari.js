/**
 * Created by administrator on 2019/11/4.
 */
var express = require('express');
var router = express.Router();
var request = require("request");

router.get('/',function(req, res, next) {
    if(req.query && req.query.d){
        request('http://tool.bitefu.net/jiari/?d=' + req.query.d, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the baidu homepage.
                res.send(body)
            }
        });
    } else {
        res.send(-1)
    }
});

module.exports = router;
