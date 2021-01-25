//使用express构建web服务器 --11:25
const express = require('express');
const session = require('express-session');//引入安装的express-session模块
const bodyParser = require('body-parser');


/*1.引入路由模块*/
var index=require("./routes/index");
var details=require("./routes/details");
var products = require("./routes/products");
var users = require("./routes/users");
var cartItems = require("./routes/cartItems");

//解决跨域
//加载跨域模块

var app = express();



//加载跨域模块
var cors = require('cors');

//配置跨域模块;允许哪个地址跨域访问
app.use(cors({
  origin: [//同源策略：保证域名和端口号一致！
	  'http://127.0.0.1:4200',
	  'http://localhost:4200',
	  'http://127.0.0.1:8100',
	  'http://localhost:8100'
  ],
  credentials:true
}));



var server = app.listen(3000);
//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));


//托管静态资源到public目录下
app.use(express.static('public'));
app.use(session({
    secret:'随机字符串',
    cookie:{maxAge:60*1000*30},//过期时间ms  30分钟
    resave:false,
    saveUninitialized:true
}));//将服务器的session放在req.session中,将来在路由中就可以用req.session去操作服务器的session


/*2.使用路由器来管理路由*/
app.use("/index",index);
app.use("/details",details);
app.use("/products",products);
app.use("/users",users);
app.use("/cartItems",cartItems);
