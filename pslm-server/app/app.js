
const koa = require('koa');
const koaLogger = require('koa-logger');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const multer = require('koa-multer');
const apis = require('./api');
const cors = require('koa2-cors');
const https = require('https');
const fs = require('fs');
const app = new koa();
const static = require('koa-static')
const koaBody = require('koa-body');
const md5 = require('md5');
const url = require('url');
const request = require('request');
const axios = require('axios');
const convert = require('koa-convert')

// const child_process = require('child_process');

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});


/*
//连接mysql数据库
const db =require('./database.js')
db.query('select * from take_task',[],function(response){console.log(response)})
*/
//连接mysql数据库
const graphdb = require('./neo4j.js')

// const { PythonShell } = require('python-shell')
// PythonShell.runString('x=1+1;print(x)', null, function (err, result) {
//   if (err) throw err;
//   console.log(typeof(result));
// });
// child_process.spawnSync('java', ['-jar', './app/controller/kg/Matrix.jar', './app/static/uploadGraphcsv/mainStructure/输入/bom.xlsx', 'Sheet1', './app/static/uploadGraphcsv/mainStructure/输入/module.xlsx', 'Sheet1', '35', './app/static/uploadGraphcsv/mainStructure/test'])
//连接mysql数据库
const mongodb = require('./database/mongodb.js')
// mongodb.create('userTask',{processDefinitionId:''})

// 宁波信息院接口soap
// const wf =require('./wf_wsdl.js')

var PORT = 50;
const SSLPORT = 500;
const options = {
  cert: fs.readFileSync('app/Nginx/1_cattery.zjukms.com_bundle.crt'),
  key: fs.readFileSync('app/Nginx/2_cattery.zjukms.com.key')
};
global.TicketCacheMap = [];
global.TokenCache = {};
app.env = process.env.NODE_ENV || 'development';
if (app.env === 'development') {
  app.use(convert(koaLogger()));
}
onerror(app);
app.use(cors());

app.use(koaBody({
  multipart: true
  // formidable: {
  //   maxFileSize: 20000 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  // }
}));
app.use(bodyParser());

app.use(convert(apis.routes()));

//app.use(multer)
app.use(convert(static('app/static')))
app.use(convert(apis.allowedMethods()));

// 宁波信息院
// AppId + 时间戳 + AppKey
// var str = 'AppId=2008&Ts=' + Date.now() + '23b0b2faad4f42e184e0dda70f459431';
// axios.get('http://ipoptest.sti.gov.cn/CommonApi/HignTech/DetailList', {
//     params: {
//     AppId: 2008,
//     Ts: Date.now(),
//     Sn: md5(str)
//     }
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });
// request({
//   timeout: 5000,    // 设置超时
//   method: 'GET',    //请求方式
//   url: url.parse('http://ipoptest.sti.gov.cn/CommonApi/HignTech/DetailList'), //url
//   qs: {                                                  //参数，注意get和post的参数设置不一样  
//     AppId: 2008,
//     Ts: Date.now(),
//     Sn: md5(str)
//   }

// }, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body);

//   } else {
//     console.log("error", error);
//   }
// });

app.listen(PORT, function () {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});


//var httpServer = http.createServer(app);


https.createServer(options, app.callback()).listen(SSLPORT, function () {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
