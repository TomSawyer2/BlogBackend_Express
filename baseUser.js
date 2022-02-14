/* eslint-disable */

var express = require('express')
var app = express()
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
var crypto = require('crypto');
const jwt = require("jsonwebtoken")
//撒盐，加密时候混淆
const secret = 'rthghfTomSawyer2dfvjxkhvjaklsv'
router.use(express.json())
var connection = mysql.createConnection(models.mysql)
connection.connect()

router.post('/api/register',function (req,res) {
    var users = []
    var registerParams = req.body
    connection.query('select user_name from users where user_name=' + "'" + registerParams.userName + "'",function (err,result) {
        if (err) throw err
        if(result.length == 0) {
            registerParams.password = crypto.createHash('md5').update(registerParams.password).digest("hex")
            connection.query('insert into users set ?', registerParams, function (err,result) {
                if (err) {
                    throw err
                } else {
                    res.send({
                        status: 0
                    })
                    return;
                }
            })
        } else {
            res.send({
                status: 1,
                msg: "用户已存在"
            })
            return;
        }
    })
})

router.post('/api/login', function(req, res) {
    connection.query('select user_name from users where user_name=' + "'" + req.body.userName + "'" ,function (err,result) {
        if(result.length != 0) {
            var password = crypto.createHash('md5').update(req.body.password).digest("hex")
            connection.query('select password from users where password=' + "'" + password + "'", function (err, result) {
                if(result.length == 0) {
                    res.send({
                        status: 2,
                        msg: "账户密码错误"
                    })
                } else {
                    var info = req.body;
                    var token = jwt.sign(info, secret, {
                        //Token有效时间 单位s
                        expiresIn:60 * 60 * 10
                    })
                    res.send({
                        status: 0,
                        msg: "登录成功",
                        token: token
                    })
                }
            })
        } else {
            res.send({
                status: 3,
                msg: "不存在这个账号"
            })
        }
        console.log(result)
    })
})

module.exports = router