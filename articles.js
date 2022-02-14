/* eslint-disable */

var express = require('express')
var app = express()
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants')
router.use(express.json())
var connection = mysql.createConnection(models.mysql)
connection.connect()

router.post('/api/addArticle',function (req,res) {
    var articleParams = req.body;
    var tagsArray = req.body.tags;
    articleParams.tags = articleParams.tags.join('-');
    connection.query('insert into articles set ?', articleParams, function (err,result) {
        if (err) {
            res.send({
                status: 4,
                msg: "文章添加失败"
            })
            return;
        } else {
            let i = 0;
            for(i; i < tagsArray.length; i ++ ) {
                connection.query('update tags set value=value+1 where name=?', tagsArray[i], function (err,result) {
                    if (err) {
                        res.send({
                            status: 4,
                            msg: "文章添加失败"
                        })
                        return;
                    }
                })
            }
            res.send({
                status: 0,
                msg: "文章添加成功"
            })
            return;
        }
    })
})

router.post('/api/deleteArticle',function (req,res) {
    connection.query('select id,tags from articles where id=?', req.body.id, function (err,result) {
        if(result.length == 0) {
            res.send({
                status: 5,
                msg: "文章不存在"
            })
            return;
        } else {
            let i = 0;
            let tagsArray = result[0].tags.split('-');
            for(i; i < tagsArray.length; i ++ ) {
                connection.query('update tags set value=value-1 where name=?', tagsArray[i], function (err,result) {
                    if (err) {
                        res.send({
                            status: 6,
                            msg: "文章删除失败"
                        })
                        return;
                    }
                })
            }
            connection.query('delete from articles where id=?', req.body.id, function (err,result) {
                if (err) {
                    res.send({
                        status: 6,
                        msg: "文章删除失败"
                    })
                    return;
                } else {
                    res.send({
                        status: 0,
                        msg: "文章删除成功"
                    })
                    return;
                }
            })
        }
    })
    
})

router.post('/api/getAllArticle',function (req,res) {
    connection.query('select title,update_time,id,brief,tags,have_like,likes from articles', function(err, result) {
        if(err) {
            res.send({
                status: 7,
                msg: "查询失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "查询成功",
                data: result
            })
            return;
        }
    })
})

router.post('/api/updateArticle',function (req,res) {
    connection.query('select id,tags from articles where id=?', req.body.id, function (err,result) {
        if(result.length == 0) {
            res.send({
                status: 8,
                msg: "文章不存在"
            })
            return;
        } else {
            let i = 0;
            var tagsArray = result[0].tags.split('-');
            for(i; i < tagsArray.length; i ++ ) {
                connection.query('update tags set value=value-1 where name=?', tagsArray[i], function (err,result) {
                    if (err) {
                        res.send({
                            status: 9,
                            msg: "更新失败"
                        })
                        return;
                    }
                })
            }
            var newTagsArray = req.body.tags;
            var updateParams = {"title": req.body.title, "content": req.body.content, "tags": req.body.tags.join('-'), "brief": req.body.brief};
            connection.query('update articles set ? where id=' + "'" + req.body.id + "'",updateParams , function(err, result) {
                if(err) {
                    console.log(err)
                    res.send({
                        status: 9,
                        msg: "更新失败"
                    })
                    return;
                } else {
                    let i = 0;
                    for(i; i < newTagsArray.length; i ++ ) {
                        connection.query('update tags set value=value+1 where name=?', newTagsArray[i], function (err,result) {
                            if (err) {
                                res.send({
                                    status: 9,
                                    msg: "更新失败"
                                })
                                return;
                            }
                        })
                    }
                    res.send({
                        status: 0,
                        msg: "更新成功",
                        data: req.body
                    })
                    return;
                }
            })
        }
    })
})

router.post('/api/getArticleById',function (req,res) {
    
    connection.query('select * from articles where id=?', req.body.id, function(err, result) {
        if(err) {
            res.send({
                status: 13,
                msg: "查询失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "查询成功",
                data: result
            })
            return;
        }
    })
})

router.post('/api/getArticleByTag',function (req,res) {
    
    connection.query("select title,id,brief,tags,update_time from articles where tags like concat('%',?,'%')", req.body.tag, function(err, result) {
        if(err) {
            res.send({
                status: 14,
                msg: "用tag查询失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "查询成功",
                data: result
            })
            return;
        }
    })
})

router.post('/api/updateTempArticle',function (req,res) {
    let updateParams = req.body;
    updateParams.tags = req.body.tags.join('-');
    connection.query('update tempArticles set ? where id=1', updateParams, function(err, result) {
        if(err) {
            console.log(err)
            res.send({
                status: 15,
                msg: "草稿提交失败"
            })
            return;
        } else {
            connection.query('UPDATE tempArticles SET have_temp = 1 WHERE id = 1', function(err, result) {
                if(err) {
                    console.log(err)
                    res.send({
                        status: 15,
                        msg: "草稿提交失败"
                    })
                    return;
                } else {
                    res.send({
                        status: 0,
                        msg: "草稿提交成功"
                    })
                    return;
                }
            })
            return;
        }
    })
})

router.post('/api/deleteTempArticle',function (req,res) {
    let updateParams = {title: "", content: "", tags: "", brief: "", have_temp: 0}
    connection.query('update tempArticles set ? where id=1', updateParams, function(err, result) {
        if(err) {
            console.log(err)
            res.send({
                status: 16,
                msg: "草稿删除失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "草稿删除成功"
            })
            return;
        }
    })
})

router.post('/api/searchTempArticle',function (req,res) {
    connection.query('select * from tempArticles where id=1', function(err, result) {
        if(err) {
            console.log(err)
            res.send({
                status: 17,
                msg: "查询是否有草稿失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "草稿查询成功",
                data: result
            })
            return;
        }
    })
})

router.post('/api/like',function (req,res) {
    connection.query('update articles set likes=likes+1 where id=?', req.body.id, function(err, result) {
        if(err) {
            res.send({
                status: 17,
                msg: "点赞失败"
            })
            return;
        } else {
            res.send({
                status: 0,
                msg: "点赞成功"
            })
            return;
        }
    })
})

module.exports = router