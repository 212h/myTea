const express=require("express");
var router=express.Router();
var pool=require("../pool");
// 1F
router.get("/",(req,resp)=>{
  var sql="SELECT * FROM `mt_index_product` WHERE seq_recommended!=0 ORDER BY seq_recommended LIMIT 6 ";
  pool.query(sql,[],(err,result)=>{
    if(err) throw err;
    resp.send(result);
  });
});
// 2F
router.get("/floorTwo",(req,resp)=>{
  var sql = "SELECT * FROM `mt_index_product` WHERE seq_recommended>6 AND seq_recommended<13 ORDER BY seq_recommended LIMIT 6 ";
  pool.query(sql,[],(err,result)=>{
    if(err) throw err;
    resp.send(result);
  });
});
// 3F
router.get("/floorThree",(req,resp)=>{
  var sql = "SELECT * FROM `mt_index_product` WHERE seq_recommended>12 AND seq_recommended<19 ORDER BY seq_recommended LIMIT 6 ";
  pool.query(sql,[],(err,result)=>{
    if(err) throw err;
    resp.send(result);
  });

});
module.exports=router;
//http://localhost:3000/index