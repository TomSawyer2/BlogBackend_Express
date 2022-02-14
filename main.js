/* eslint-disable */

var express = require('express')
const path = require('path')
const fs = require('fs')
const https = require('https')
// 根据项目的路径导入生成的证书文件
const privateKey = fs.readFileSync(path.join(__dirname, './cert/2_tomsawyer2.xyz.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, './cert/1_tomsawyer2.xyz_bundle.crt'), 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate,
}
var logger = require('morgan');
var accessLogger = fs.createWriteStream('access.log', { flags: 'a' });
var app = express()
app.use(logger('dev'));
app.use(logger({ stream: accessLogger }));

var cors = require('cors')
app.use(cors())

//allow custom header and CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

// var server = app.listen(4000, "172.17.0.12", function () {
//   var host = server.address().address
//   var port = server.address().port
//   console.log('Server has running at http://%s:%s',host,port)
// })

// 创建https服务器实例
const httpsServer = https.createServer(credentials, app)

// 设置https的访问端口号
const SSLPORT = 4000

// 启动服务器，监听对应的端口
httpsServer.listen(SSLPORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`)
})

var baseUser = require('./baseUser')
var articles = require('./articles')
var tags = require('./tags')
var messages = require('./messages')

app.use(baseUser)
app.use(articles)
app.use(tags)
app.use(messages)
