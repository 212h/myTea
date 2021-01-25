// ******************购物车项*********************************************************
var express = require("express");
var router = express.Router();
var pool = require("../pool");
var query = require("./query");//支持promise

//访问这个网址cartItems，获得当前用户的购物车项,按编号降序排列,因为淘宝的购物车顺序是新的商品在最上面
router.get("/",(req,resp)=>{//返给人家的是详细信息：单价、数量、商品名、
    var sql = "SELECT *, (SELECT md FROM mt_tea_pic WHERE tea_id=lid LIMIT 1) AS md FROM mt_shoppingcart_item INNER JOIN mt_tea ON product_id=lid WHERE user_id=? ORDER BY iid DESC ";
    var uid = req.session.uid;//uid 是从session中来
    pool.query(sql,[uid],(err,result)=>{
        resp.send(result);
    });
    //测试：先 http://localhost:3000/login.html先登陆成功,保证session里面有uid
    //     再 http://localhost:3000/cartItems
});

//方法:先查询有没有这个商品，如果没有就插入，如果有的话就更新数量******************************
router.get("/add",(req,resp)=>{//往购物车加一项，用户id从session来，商品id从按钮(客户端)上来
    var {lid,count} = req.query;
    var uid = req.session.uid;
    console.log(req.query);
    var sql = "select * from mt_shoppingcart_item where user_id=? and product_id=?";
    query(sql,[uid,lid])
    .then(result=>{
        if(result.length==0){//如果没有,result.length==0没找到就插入一条,你怎么知道这个人的购物车里有没有这个商品：在这之前要查以下
            var sql = "insert into mt_shoppingcart_item values(null,?,?,?,0)";//null自动增长
            pool.query(sql,[uid,lid,count],(err,result)=>{
                resp.send();
            });
        }else{//否则找到了就更新数量,拿用户这个人和商品联合找一下,在他的购物车当中的这个商品的数量
            var sql = "update mt_shoppingcart_item set count=count+? where user_id=? and product_id=?";//null自动增长
            pool.query(sql,[count,uid,lid],(err,result)=>{
                resp.send();
            });
        }
    });
    //测试: 先http://localhost:3000/login.html 先登录成功
    //  再http://localhost:3000/cartItems/add?lid=X&count=X
    //  结果: 数据库中多一行记录
    //  再请求相同地址
    //  结果: 数据库中不会多一行记录，而是原记录数量增长
});
router.get("/delete",(req,resp)=>{//删除购物车里面的一项

});
router.get("/update",(req,resp)=>{//修改购物车中商品数量
    var {iid,count} = req.query; //iid是购物车每一项的编号；iid和count会从客户端发来
    if(count>0){//如果新的数量>0就更新
        var sql = "update mt_shoppingcart_item set count=? where iid=?";
        pool.query(sql,[count,iid],(err,result)=>{
            resp.send();
        });
    }else{//否则如果count==0 就删除
        var sql = "delete from mt_shoppingcart_item where iid=?";
        pool.query(sql,[iid],(err,result)=>{
            resp.send();
        });
    }  
    //测试地址  http://localhost:3000/cartItems/update?iid=X&count=X  
});


module.exports = router;