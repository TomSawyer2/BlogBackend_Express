# BlogBackend_Express

博客后端的 Express 版本，启动项目需要在根目录下配置`db.js`，示例如下：

```js
var mysql = {
  host: "ip",
  port: "port",
  user: "user",
  password: "password",
  database: "database",
};
module.exports = { mysql };
```
