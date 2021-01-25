ajax("http://localhost:3000//footer.html").
then(resp=>{
    document.getElementById("footer").innerHTML = resp;
    //    右下角广告弹出框
    window.onload = function(){
        var msg = document.getElementById("right_ad");
        // console.log(msg);
        msg.style.bottom = "0";
        msg.children[0].onclick = function(){
            msg.style.bottom = "-200px";
            //等3秒后再弹出来
            setTimeout(function(){
                msg.style.bottom = "0";
            },5000);
        }
    }
    // 微信二维码
        $("#twoDimensionalCode").on("click","img",function(){
            var $that = $(this);
            
            if($that.is("#twoDimensionalCode>img:first-child")){
                $("#weiChatCode").removeClass("d-none").next().addClass(" d-none ");
            }
            if($that.is("#twoDimensionalCode>img:last-child")){
                $("#weiboCode").removeClass("d-none").prev().addClass(" d-none ");
            }
        });
});

