/***************************商品列表中的功能:分页******************************/
const express = require("express");
var router = express.Router();
var query = require("./query");
router.get("/",(req,resp)=>{/*方法!:写一写,就一目了然,正着推想不出,找到结果倒着推,把必要的结果写下来*/
    var output = {//分页需要返回数据
        count:0,//总条数
        pageSize:9,//每页9条
        pageCount:0,//共多少页
        pno:req.query.pno,//第几页，页码 0代表第一页,动态从地址栏获取他的值
        data:[] //数组保存这一页所有的数据
    }
    var kw = req.query.kw;//从查询字符串中拿到关键字kw
    //console.log(kw);//测试http://localhost:3000/products?kw=西湖 龙井 茶
    //kw:"西湖 龙井 茶"  做查询的话 这些关键词最终都会出现在title当中
    var kws = kw.split(" ");//按空格切
    //kws变成了[ '西湖', '龙井', '茶' ]
    // console.log(kws);
    kws.forEach((elem,i,arr)=>{//改原数组kws
        arr[i] = `title like '%${elem}%'`;
    });
    /*kws变成这样了
        [
            title like '%西湖%',
            title like '%龙井%',
            title like '%茶%'
        ]
    */
    //join(" and ")
    var where = kws.join(" and ");//注意:拼sql语句时,多加空格肯定是不会错的,但是,少加空格就极有可能出错,所以,该加空格的时候手勤快点
    //最终的sql语句sql:select * from mt_tea where title like '%西湖%' and title like '%龙井%' and title like '%茶%' 
    var sql = `SELECT * ,(select md from mt_tea_pic where tea_id = lid limit 1) as md FROM mt_tea  where ${where}`;
    //SELECT * , ( select md     from mt_tea_pic where tea_id = lid       limit 1 )         as md   FROM `mt_tea`  //补一列md，子查询
    //             只要md这1列    /这一列从mt_tea_pic中来,条件是tea_id = lid,limit/1只要1张   /补一列md                          
    
    /*测试：resp.send(sql);//检查sql语句对不对
        http://localhost:3000/products?kw=西湖 =>查寻结果放到数据库执行select * from mt_tea where title like '%西湖%'
        http://localhost:3000/products?kw=西湖 龙井 =>查寻结果放到数据库执行select * from mt_tea where title like '%西湖%' and title like '%龙井%'
        http://localhost:3000/products?kw=西湖 龙井 茶 =>查寻结果放到数据库执行select * from mt_tea where title like '%西湖%' and title like '%龙井%' and title like '%茶%'
        http://localhost:3000/products?kw=茶 =>查寻结果放到数据库执行select * from mt_tea where title like '%茶%'
    */
    query(sql,[])
    .then(result=>{
        /*测试resp.send(result);//这个查询查出来的是符合条件的所有内容,只能暂时求出count总数
            http://localhost:3000/products?kw=茶
            http://localhost:3000/products?kw=西湖
            http://localhost:3000/products?kw=西湖 龙井
            http://localhost:3000/products?kw=西湖 龙井 茶
        */
        output.count = result.length;//符合查询条件的总条数
        output.pageCount = Math.ceil(output.count/output.pageSize);//上取整获得总页数
        sql += " limit ?,?";//用这条新的sql语句查本页的数据:从第几条数据开始要几条数据
        return query(sql,[output.pageSize*output.pno,output.pageSize]);
    })
    .then(result=>{//这回出来的才是正式返回的
        output.data = result;
        resp.send(output);//最后测试路径http://localhost:3000/products?kw=茶&pno=2
    });
});


module.exports = router;