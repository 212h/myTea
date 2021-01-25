var express = require("express");
var router = express.Router();//创建路由对象
var pool = require("../pool");

router.post("/signin",(req,resp)=>{//登陆功能
    // var {uname,upwd} = req.query;//测试用get
    var {uname,upwd} = req.body;
    var sql = "select * from mt_user where uname=? and upwd=? ";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            req.session.uid = result[0].uid;//把uid放进去,首次打开浏览器，请求服务器时: 服务器为该客户端创建session对象，并生成唯一的session_id，将session_id发回到客户端浏览器保存。
            resp.send({ok:1});
        }else{
            resp.send({ok:0,msg:"用户名或密码错误,请重新新输入！"});
        }
    });
});
router.get("/islogin",(req,resp)=>{//判断是否登陆,不需要传参,是看session里面有没有uid
    if(req.session.uid == null){
        resp.send({ok:0});
    }else{
        console.log(req.session.uid);
        var sql = "select uname,upwd from mt_user where uid=? ";
        pool.query(sql,[req.session.uid],(err,result)=>{
            if(err) throw err;
                resp.send({ok:1,uname:result[0].uname});
        });       
    }
});

router.get("/signout",(req,resp)=>{//注销
    delete req.session.uid;
    resp.send();
});
router.post("/isregister",(req,resp)=>{
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    var email = req.body.email;
    var phone = req.body.phone;
    // console.log(uname,upwd,email,phone);
    if(uname !== ""){
        var sql = "SELECT * FROM mt_user WHERE uname = ?";
        pool.query(sql,[uname],(err,result)=>{        
            // console.log(uname,upwd,email,phone);
            if(err) throw err;
            console.log("result:"+result.length);
            if(result.length == 0){
                // console.log(uname,upwd,email,phone);            
                var sql = "INSERT INTO mt_user (uname,upwd,email,phone) VALUES (?,?,?,?) ";
                pool.query(sql,[uname,upwd,email,phone],(err,result)=>{
                    if(err) throw err;
                    resp.send({code:1,msg:"注册成功"});
                });
            }else{
                resp.send({code:0,msg:"用户名已存在"});
            }
        });
    }else{
        resp.send({code:-1,msg:"没有获取到uname"});
    }
});
router.post("/register",(req,resp)=>{

});
module.exports = router;