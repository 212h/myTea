/*********************juquery做*************************/
// 表单验证:用户名获取焦点添加边框阴影，移除边框阴影
var $txtUpwd = $("#upwd");
$("#uname").focus(function(){
    $(this).addClass(" box-shadow-green-inset");
});
$("#uname").blur(function(){
    $(this).removeClass(" box-shadow-green-inset");
});
// 表单验证:密码框获取焦点添加边框阴影，移除边框阴影
$("#upwd").focus(function(){
    $(this).addClass(" box-shadow-green-inset");
});
$("#upwd").blur(function(){
    $(this).removeClass(" box-shadow-green-inset");
});

// 表单动态前后端交互验证
$(function(){//在dom内容加载后就提前触发
    //功能：从哪个页面跳回来的，登陆成功之后还能跳回哪个页面去******************* */
    $("#login").click(function(){
        var uname = $("#uname").val();//获取uname
        var upwd = $("#upwd").val();//获取upwd
        console.log(uname,upwd);
            $.ajax({
                url:"http://localhost:3000/users/signin",
                type:"post",
                data:{ uname, upwd},
                dataType:"json",
                success:function(data){
                    if(data.ok == 0){
                        alert(data.msg);//用户名或密码错误
                    }else{
                        if(location.search.indexOf("back=")!=-1){//哪儿来回哪儿去
                            alert("登陆成功，返回上一页！");
                            var back = location.search.slice(6);//?back=之后的都要
                            console.log(back);
                            location.href = back; 
                        }else{//否则回首页：防：直接进入登陆页
                            alert("登陆成功，返回首页");
                            location.href="http://localhost:3000/index.html";
                        }
                        
                    }
                }
            });
    });
});





