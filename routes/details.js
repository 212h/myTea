const express = require("express");
var router = express.Router();
var query = require("./query");
// var query = require("./query");
router.get("/",(req,resp)=>{
    var lid = req.query.lid;
    // console.log(lid);//拿到地址栏的lid 的参数值  
    var output ={};
    var sql = "SELECT * FROM `mt_tea` WHERE lid = ? ";
    query(sql,[lid])
    .then((result)=>{//result总是返回数组
        // console.log(result);
        output.product = result[0];
        var fid = output.product.family_id;
        var sql = "SELECT spec,lid FROM `mt_tea` WHERE family_id=?  ";
        //要像继续用then，必须返回Promise对象
        return query(sql,[fid]); //return Promise      
    })
    .then(result=>{
        // console.log(result);
        output.specs = result;
        var sql = "SELECT * FROM `mt_tea_pic` WHERE tea_id=? ";
        return query(sql,[lid]);  
    })
    .then(result=>{
        // console.log(result);
        output.pics = result; 
        resp.send(output);
        // console.log(output);
    })
    .catch(error=>{
        // console.log(error);
    }) ;     
});
module.exports = router;
//http://localhost:3000/details?lid=3