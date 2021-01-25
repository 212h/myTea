$(function(){//DOM内容加载后就提前触发
    /***************在这里面要干的就是从服务器拿数据***********************/
    if(location.search.indexOf("kw=") !== -1){
        var kw = decodeURI(location.search.split("=")[1]);//按=切割，取后面的部分
        //第2步：定义函数loadPage封装$.ajax,定义参数pno，默认=0
        function loadPage(pno=0){//注意：pno作为参数不能写死，0作为默认第一页
            $.ajax({//向服务器发请求
                url:"http://localhost:3000/products",
                type:"get",
                data:{ kw, pno },//要传的参数kw:关键字  pno:第几页
                dataType:"json",//他返回的肯定是json对象
                success:function(output){//他返回的是output
                    //console.log(output);//测试:搜索框输入 茶，控制台可以看到data(9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                    var {data,pageCount,pno} = output;//pageCount符合查询条件的总页数，pno现在第几页，data保存这一夜所有数据，pageSize一页9条，count总数
                    var html = "";
                    for(var p of data){
                        var {md,lid,price,title} = p;
                        html += `<div class="col-md-4 p-1">
                        <div class="card mb-4 box-shadow pr-2 pl-2">
                        <a href="product_details.html?lid=${lid}">
                            <img class="card-img-top" src="${md}">
                        </a>
                        <div class="card-body p-0">
                            <h5 class="text-info font-weight-bold text-info py-3">￥${price.toFixed(2)}</h5>
                            <p class="card-text">
                            <a href="product_details.html?lid=1" class="text-muted h5 " title="${title}">${title}</a>
                            </p>
                            <div class="d-flex justify-content-between align-items-center p-2 pt-0">
                            <button class="btn btn-outline-secondary p-0 border-0" type="button">-</button>
                            <input type="text" class="form-control p-1" value="1">
                            <button class="btn btn-outline-secondary p-0 border-0" type="button">+</button>
                            <a class="btn btn-info float-right ml-1 pl-1 pr-1" href="cart.html" data-lid="${lid}">加入购物车</a>
                            </div>
                        </div>
                        </div>
                    </div>`;
                        }
                    //加入购物车需要商品编号product_id，怎么做将来获得这个lid最方便？放在自己身上！data-lid="${lid}
                    //SELECT * , ( select md from mt_tea_pic where tea_id = lid limit 1 ) as md  FROM `mt_tea`
                    //只要md这1列/这一列从mt_tea_pic中来,条件是tea_id = lid,limit/1只要1张                            补一列md
                    $("#plist").html(html);
                    //**********************************分页**************************
                    var html = `<li class="page-item  disabled"><a class="text-info page-link bg-transparent" href="#">上一页</a></li>`;
                    for( var i=0;i<pageCount;i++){
                        html += `<li class="page-item ${i==pno?'active':''}"><a class="text-info page-link border" href="#">${i+1}</a></li>`;
                    }
                    html += `<li class="page-item"><a class="text-info page-link bg-transparent" href="#">下一页</a></li>`;
                    var $ul = $("#plist+h6>nav>ul");
                    $ul.html(html);
                    //********功能:上一页和下一页什么时候禁用
                    if(pno == 0){
                        $ul.children(":first-child").addClass("disabled");
                    }else{
                        $ul.children(":first-child").removeClass("disabled");
                    }
                    if(pno == pageCount-1){
                        $ul.children(":last-child").addClass("disabled");
                    }else{
                        $ul.children(":last-child").removeClass("disabled");
                    }
                }
            });
        }
        //第3步：页面首次加载时，得自己调用一次loadPage()
        loadPage();
        //第1步：将on(click)从$.ajax中剪切到外部和$.ajax平级
        $("#plist+h6>nav>ul").on("click","li>a",function(e){ //   绑定事件，做分页的单击//绑定在ul上，li>a触发事件
            e.preventDefault();
            var $a = $(this);
            //    a分三种情况：上一页 下一页 中间几页
            if($a.parent().is(":not(.active):not(.disabled)")){//a不是active且也不是disabled,既不是现在页，也不是禁用的——屏蔽
                // alert("疼");
                var i = $("#plist+h6>nav>ul>li.active>a").html()-1;//因为在一个爹下找，所以可以直接用index()，目的——获得现在选中的i
                if($a.parent().is(":first-child")){
                    loadPage(i-1);
                }else if($a.parent().is(":last-child")){
                    loadPage(i+1);
                }else{//否则就是中间按钮：点击，重新给服务器发ajax请求，请求这一页pno
                    loadPage($a.html()-1);//加载这页
                }
            }
        });
        //**********实现的功能:点击+-按钮中间的Input里的数字会变化***************
        $("#plist").on("click",".card-body>div>button,.card-body>div>a",function(e){//不写在ajax里面,因为每次刷新不影响大的div#plist,他影响的是里面的内容,不影响#plist这个父元素
            e.preventDefault();
            // alert("疼");//检测找对了不，要步步为营
            var $btn = $(this);
            var n = parseInt($btn.siblings("input").val());//以防万一parseInt以下
            console.log(n);
            if($btn.is("button")){//如果$btn是button,就做加减
                if($btn.html() == "+"){
                    n ++;
                }else if(n > 1){
                    n --;
                }
                $btn.siblings("input").val(n);//把n放回去
            }else{//否则就说明是加入购物车：加到谁的购物车？加到各自的购物车！要用session,必须懂!
                // ***功能：加入购物车***********************
                var lid = $btn.attr("data-lid"); //lid在自己身上
                var count = $btn.siblings("input").val(); //旁边兄弟的值
                $.ajax({
                    url:"http://localhost:3000/users/islogin",
                    type:"get",
                    dataType:"json",
                    success:function(data){
                        
                        if(data.ok == 0){//功能:加入点击加入购物车时验证没登陆就跳到登录页
                            alert("请先登陆！");
                            location.href = "http://localhost:3000/login.html?back="+location.href;
                        }else{
                            $.ajax({
                                url:"http://localhost:3000/cartItems/add",
                                type:"get",
                                data:{lid,count},
                                success:function(){
                                    $btn.siblings("input").val(1);//添加购物车成功后要把input的值改为1
                                    alert("添加购物车成功!");
                                    loadCart();
                                }
                            });
                        }
                    }
                })
                
            }

        });
    }
    // 功能：加载****************************************************
    //只有在登陆成功之后才会加载他的购物车，这个人如果没有登陆的话，他可以查商品，但是右边的购物车不显示
    function loadCart(){
        //坑：点击+-按钮不变化原因:要是反复加载就不能下面一个for循环了,因为旧的还在上面,新的就已经被insert上去了
        //所以在每次insert之前,甚至于在每次ajax请求之前要删掉除最后一个和第一个li之间的所有li
        $("#cart>li:gt(0):not(:last)").remove();//中间全删掉,大于第一个之后的、且小于最后一个之前的
        $.ajax({
            url:"http://localhost:3000/users/islogin",
            type:"get",
            dataType:"json",
            success:function(data){
                if(data.ok === 1){//只有当data.ok等于1的时候才加载购物车内容
                    $.ajax({//客户端需要参数，但是这个参数在session里
                        url:"http://localhost:3000/cartItems",//往根目录发就是加载
                        type:"get",
                        dataType:"json",//他返回的一定是json
                        success:function(items){
                            console.log(items);//确保先拿过来再说//测试 没登陆看控制台输出没有商品，登陆后看控制台输出有商品就对了
                            var $ul = $("#cart");
                            var total = 0;
                            for(var item of items){
                                var {price,count,title,iid} = item;
                                total += price*count;
                                $(`<li class="p-0 list-group-item d-flex justify-content-between lh-condensed">
                                        <div class="input-group input-group-sm mt-1 mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text text-truncate bg-white p-1 border-0 d-inline-block" title="${title}">${title}</span>
                                            <button class="btn btn-outline-secondary p-0 border-0" type="button" data-iid="${iid}">-</button>
                                        </div>
                                        <input type="text" class="form-control p-1" aria-label="Small" value="${count}" aria-describedby="inputGroup-sizing-sm">
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary p-0 border-0" type="button" data-iid="${iid}">+</button>
                                            <span class="input-group-text bg-white border-0 p-0 pl-1">¥${(price*count).toFixed(2)}</span>
                                        </div>
                                        </div>
                                    </li>`).insertBefore("#cart>li:last-child");
                                    //注意:这里的+- 你没点一下都牵扯到数据库在变,你反应的就是数据库的数据,你变了数据库也得变化,所以点+-的时候要去修改数据库里的购物车里的数量,需要iid,缓存在+-按钮上,到时候可以轻松拿到
                                    //创建一个东西之后马上就给他加到页面上去了,既不能用追加,也不能用开头插入,因为上面有个头,后面有个尾,insert
                            }
                            $ul.find("li:last-child>h4").html(`￥${total.toFixed(2)}`);
                        }
                    });
                }
            }
        });
    }
    loadCart();//在页面加载时自己先调一次
    //功能：点击右边购物车里的+-按钮数量变化：这是事件绑定不需要写在ajax里面,原因不是每次都改,父元素一般是不变的
    $("#cart").on("click","button",function(){
        var $btn = $(this);
        var count = parseInt($btn.parent().siblings("input").val());
        if($btn.html() == "+"){
            count++;
        }else{
            count--;
        }
        //注意：这个input里的数量不是你想改就能改了,应该是数据库是多少,读出来之后再决定是多少
        var iid = $btn.attr("data-iid");
        $.ajax({
            url:"http://localhost:3000/cartItems/update",
            type:"get",
            data:{iid,count},
            success:function(){
                //修改时候干什么：你改了数量之后你的小计、总计都要从新计算
                loadCart();//当每次数量增减完之后我再调一次
            }
        })
    });
});