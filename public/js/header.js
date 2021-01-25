(function(){
    ajax("http://localhost:3000/header.html").
    then(resp=>{//header的内容请求回来才执行//then的意思是说我已经从远程把header给你拿过来并且加载完了
         document.getElementById("header").innerHTML = resp;

         //等待header的内容全部加载完，才能找事件绑定
         /**************************按关键字查找的功能****************************/
         var btnSearch = document.querySelector("#header>nav>div>span>img");
         var input = btnSearch.parentNode.previousElementSibling.previousElementSibling;
         btnSearch.onclick = function(e){//点击搜索图标跳转到products.html页面
             var btn = this;
            if(input.value.trim() !== -1){
                location.href = `http://localhost:3000/products.html?kw=${input.value}`;
            }
         }
         input.onkeyup = function(e){//按回车进行跳转到porducts.html页面
             if(e.keyCode === 13){ //只有到e.keyCode === 13的时候才做事
                 btnSearch.onclick();//事件出来函数也是一个普通的函数，普通的函数页可以加()调用
             }
         }
         if(location.search.indexOf("kw=") !== -1){//到了商品列表页面怎么从地址栏中把关键词拿下来还放到input里面去？
             input.value = decodeURI(location.search.split("=")[1]);
         }
        //  **************************登陆、注销 让谁显示************************************
        //根据这个人有没有登陆来动态决定让谁显示,让谁不显示
        function isLogin(){
            $.ajax({//向服务器发请求
                url:"http://localhost:3000/users/islogin",
                type:"get",
                dataType:"json",
                success:function(data){
                    //console.log(data);
                    if(data.ok == 0){
                        $("#signout").show().next().hide();
                    }else{
                        $("#signout").hide().next().show();
                        $("#uname").html(data.uname);
                    }
                }
            });
        }
        isLogin();//先调用一次
        $("#btnSignout").click(function(e){
            e.preventDefault();
            $.ajax({
                url:"http://localhost:3000/users/signout",
                type:"get",
                success:isLogin//如果不涉及this的话,简写：success:isLogin//不用加(),因为这是个回调函数
            });
        });        
        $("#btnLogin").click(function(e){//点击登陆
            e.preventDefault();//因为是a,所以上来就阻止默认
            location.href = "http://localhost:3000/login.html?back="+location.href;//简单跳转到login.html，back=location.href是当前页面的url，这样跳到登录页之后就能携带者旧的地址过去了

        });
        $("[data-trigger=dropdown]")
            .next()
            .hide()
            .parent()
            .mouseenter(function(){
                $(this).children(":last").slideDown();
            })
            .mouseleave(function(){
                $(this).children(":last").slideUp();
            })
        ;
        // 输入框获取焦点显示边框阴影
        var txt_search = document.getElementById("txt_search");
        // console.log(txt_search); 
        $("#txt_search").focus(function(){
            $(this).parent().addClass("box-shadow-green");
        });   
        $("#txt_search").blur(function(){
            $(this).parent().removeClass("box-shadow-green");
        }); 
    });
        
    
})();