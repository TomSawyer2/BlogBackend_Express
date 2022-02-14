/* eslint-disable */

var express = require('express')
var app = express()
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
router.use(express.json())
var connection = mysql.createConnection(models.mysql)
connection.connect()

router.post('/api/getAllMessages',function (req,res) {
    connection.query('select * from messages' ,function (err,result) {
        if (err) {
            res.send({
                status: 18,
                msg: "获取全部消息失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "成功",
                data: result
            })
        }
    })
})

router.post('/api/addMessage',function (req,res) {
    connection.query('insert into messages set ?', req.body, function (err,result) {
        if (err) {
            res.send({
                status: 19,
                msg: "添加信息失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "成功",
                data: req.body
            })
        }
    })
})

router.post('/api/replyMessage',function (req,res) {
    connection.query('update messages set reply=? where id=' + "'" + req.body.id + "'", req.body.reply, function (err,result) {
        if (err) {
            res.send({
                status: 20,
                msg: "回复失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "回复成功"
            })
        }
    })
})

router.post('/api/deleteMessage',function (req,res) {
    connection.query('delete from messages where id=?', req.body.id, function (err,result) {
        if (err) {
            res.send({
                status: 21,
                msg: "删除失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "删除成功"
            })
        }
    })
})

module.exports = router