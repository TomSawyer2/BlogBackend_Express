/* eslint-disable */

var express = require('express')
var app = express()
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
const e = require('express')
router.use(express.json())
var connection = mysql.createConnection(models.mysql)
connection.connect()

router.post('/api/getAllTags',function (req,res) {
    connection.query('select * from tags', function (err,result) {
        if (err) {
            res.send({
                status: 12,
                msg: "获取所有标签失败"
            })
        } else {
            res.send({
                status: 0,
                msg: "获取标签成功",
                data: result
            })
            return;
        }
    })
})

router.post('/api/addTag',function (req,res) {
    let tags = req.body;
    connection.query('select name from tags where name=\"?\"', tags.name, function (err, result) {
        if(result.length != 0) {
            res.send({
                status: 11,
                msg: "tag已存在"
            })
            return;
        } else {
            connection.query('insert into tags set ?', tags, function (err,result) {
                if (err) {
                    res.send({
                        status: 10,
                        msg: "添加标签失败"
                    })
                } else {
                    res.send({
                        status: 0,
                        msg: "添加标签成功"
                    })
                    return;
                }
            })
        }
    })
})

module.exports = router