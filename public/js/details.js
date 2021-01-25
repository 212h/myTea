//在这个页面是所有支持商品详情页功能的代码
(()=>{
    var lid = location.search.split("=")[1];//拿到地址栏中?lid=3的lid的值
    ajax("http://localhost:3000/details",{lid:lid})
    .then(resp=>{
        resp = JSON.parse(resp);
        // console.log(resp);//请求路径http://localhost:3000/product_details.html
        var {product,specs,pics} = resp;
        var {title,price,promise} = product;
        var html = `<h5 class="font-weight-bold p-2">${title}</h5>
                <h6 class="p-2">
                    <a class="small text-dark font-weight-bold "  href="javascript:;">新鲜的好茶，很好喝！</a>
                </h6>
                <div class="alert alert-info  small" role="alert">
                    <div class="p-2">
                        <span>售价：</span>
                        <h2 class="d-inline text-primary font-weight-bold" style="color:#ff720b !important;">¥${price.toFixed(2)}</h2>
                    </div>
                    <div class="p-2">
                        <span>服务承诺：</span>
                        <span>${promise}</span>
                    </div>
                </div>`;
                var divDetails = document.getElementById("details");
        divDetails.innerHTML = html + divDetails.innerHTML;  
        //规格遍历 
        var html = "";
        for( var s of specs){
            var id = s.lid;
            var spec = s.spec;
            // console.log(id);
            // console.log(spec);
            html += `<a class="btn btn-sm btn-outline-secondary m-1 ${id==lid?'active':''}" href="product_details.html?lid=${id}">${spec}</a>`;
        } 
        document.querySelector("#details>div:nth-child(5)>div:nth-child(2)").innerHTML = html;
       
        //动态加载左侧最下面一排小图片,同时用自定义扩展属性将 中图片和大图片都缓存在客户端本地
        var html = "";
        for( var {sm,md,lg} of pics){//遍历pics数组
            html += `<li class="float-left p-1">
                        <img src="${sm}" data-md="${md}" data-lg="${lg}">
                    </li>`;
            /*这里自定义扩展属性一个非常重要的作用：缓存客户端数据
            鼠标放入小图片的时候，是不是要快速切换上方的中图片？这个时候还有必要去服务器再问一次吗？服务器我的中图片是哪张？这无形中就增加了请求的次数，对吧？
            我们完全可以怎么样？
            在刚一开始的时候，用自定义扩展属性将中图片的路径和大图片的路径都缓存在客户端本地，这样的话，当我的鼠标换了li之后,是不是从我自己身上就能轻松拿到我的中图片,就不用去远程拿了，这就是自定义扩展属性的典型用法之一：缓存客户端数据
            */
        }
        var ulImgs = document.querySelector("#preview>div>div:nth-child(5)>div:nth-child(2)>ul");//这个ul老用，就把他存一下
        ulImgs.innerHTML = html;
        // 动态对ul的宽度设置
        ulImgs.style.width = `${pics.length*62}px`;//因为每个li的宽是62px
        /*
        你首页加载的时候,用户没选呢，中图片的位置不能空着啊！
        是不是要把列表当中第一张图片的中图片默认放到中图片的位置去占位，不管他选没选，先把第一张图片放上来,你中图片的位置不能空着啊
        */
        // 中图片：默认占位的一张
        var mImg = document.querySelector("#preview>div>img");
        mImg.src = pics[0].md;//pics中第一个元素的中图片：目的：占位！
        // 找到大图片
        var divLg = document.getElementById("div-lg");
        //默认把他的背景图片设置为第一张图片的大图片,这样在刚一开始的时候，大图片的位置就不是空的了
        divLg.style.backgroundImage = `url(${pics[0].lg})`;
        //鼠标进入img时,都要自动切换中图片和大图片,给ul绑定鼠标进入事件
        ulImgs.onmouseover = function(e){//onmouseover鼠标进入时
            if(e.target.nodeName === "IMG"){//e.target拿到的就是正在进入的当前图片
                /*在这里面要改两样东西:现在鼠标进入一个图片了，这个图片你已经拿到了，
                1.我现在想获得中图片的地址，在哪呢？2.大图片的地址。福利：上面在绑定每个li的时候,已经将每个图片的小图片版本和中图片路径还有大图片路径缓存在了小图片的<img>元素上,所以当我们鼠标进入一个小图片的<img>的时候,就可以获得当前<img>身上已经缓存的md图片的路径:获得自定义的扩展属性的值:dataset
                */
                var img = e.target;
                mImg.src = img.dataset.md;//要拿中图片的地址
                divLg.style.backgroundImage = `url(${img.dataset.lg})`;
            }
        }

        //接下来要做的是：鼠标进入中图片，然后，中图片显示一个半透明的遮罩层小方块,这个小方块可以跟着鼠标移动
        //首先,这个小方块包括旁边的大图片都是鼠标进入的时候显示,鼠标离开的时候隐藏
        //先保证鼠标进去时，mask和大图片都能正常显示，而且mask不闪
        var mask = document.getElementById("mask");//半透明遮罩层
        var superMask = document.getElementById("super-mask");//透明玻璃板
        superMask.onmouseover = function(){//当鼠标进入玻璃板的时候
            mask.className = mask.className.replace("d-none","");
            divLg.className = divLg.className.replace("d-none","");
        }
        /*当鼠标在玻璃板上移动的时候,要求mask跟着鼠标动
        如果mask跟着鼠标动的话，是不是要随时更改mask的top和left，先获得鼠标位置再说，这个功能 有个特点：鼠标始终在mask的中心
        */
        superMask.onmousemove = function(e){/*当鼠标在玻璃板上移动的时候*/
            // console.log(e);
            var {offsetX,offsetY} = e;//当前鼠标的位置,鼠标相对于玻璃板左上角的位置
            var top = offsetY - 88; //mask顶部相对于玻璃板顶部的距离
            var left = offsetX - 88;//mask左边相对于玻璃板左边框的距离
            top=top<0?0:top>176?176:top;//如果top<0说明上边出去了,就把top改成0；top的最大值为：玻璃板的高352-mask的高176=176；如果top>176就强行把top改为176,否则保持不变top=top
            left=left<0?0:left>176?176:left;
            mask.style.top = `${top}px`;//反推
            mask.style.left = `${left}px`;
            divLg.style.backgroundPosition = `${-800/352*left}px ${-800/352*top}px`;//大图片是用背景图片设置的图片的内容
        }
        superMask.onmouseout = function(){//当鼠标离开玻璃板的时候
            mask.className += " d-none";//注意：1.这里 += 是往mask里面追加className；如果只是=，就是清楚里面出来d-none之外的所有className用d-none替换掉所有的className
                                        //     2.保险起见：在 d-none前加空格，因为两个class之间要有空格分割
            divLg.className += " d-none";
        }

        //接下来的功能：点左边的箭头，图片往右动；点右边的箭头，图片往左动。
        //每个按钮在点击的时候，即可能影响自己，又可能影响对方:两个按钮之间互相的影响
        var btnLeft = document.querySelector("#preview>div>div:nth-child(5)>img");//左边按钮
        var btnRight = btnLeft.nextElementSibling.nextElementSibling;
        var moved = 0;//用来记录左移的li的个数,点右边的按钮moved+1,点左边的按钮moved-1；
        if(pics.length <=4){//如果图片<=4张，一加载的时候就要判断能不能用
            btnRight.className += " disabled";
        }
        btnLeft.onclick = function(){
            var btn = this;
            if(btn.className.indexOf("disabled") === -1){//如果按钮上没有disabled
                moved --;
                ulImgs.style.marginLeft = `${-moved*62}px`;
                if(moved === 0){
                    btn.className += " disabled";
                }
                if(pics.length - moved > 4){//点左边的按钮同时又影响右边的按钮
                    btnRight.className = btnRight.className.replace("disabled","");
                }
            }
        }
        btnRight.onclick = function(){
            var btn = this;
            if(btn.className.indexOf("disabled") === -1){
                moved ++;
                ulImgs.style.marginLeft = `${-moved*62}px`;
                if(pics.length - moved === 4){
                    btn.className += " disabled";
                }
                if(moved >0 ){//点右边的按钮同时又影响左边的按钮
                    btnLeft.className = btnLeft.className.replace("disabled","");
                }
            }
        }

        //加载商品详情下方的很大的大图片
        var {description,image} = product;
        // console.log(description,image);
        var html = `<p></p>
            <p class="animated pulse infinite p-3 page-link text-info alert mb-5">${description}</p>
            <p class="p-3 text-center py-5 mb-5">
                <img src="${image}" class="m-auto animated pulse infinite">
            </p>`;
        document.getElementById("big_big_img").innerHTML = html;
        // ********点击+-按钮 加入购物车功能*************
        
        //**************jquery做****************** */
        // 1.点击+-按钮数量变化
        $("#IPT").parent().on("click","button",function(){
            var $btn = $(this);
            var n = parseInt($("#IPT").val());
            if($btn.html() == "+"){
                n++;
            }else if(n>1){
                n--;
            }
            $("#IPT").val(n);
        });
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
        loadCart();//后面反复调动
        //2.加入购物车
        $("#shopCart").on("click","a",function(){
           var $that = $(this);
           if($that.is("#shopCart>a:nth-child(2)")){
                var lid = location.search.split("=")[1];
                console.log(lid);
                var count = $("#IPT").val(); //旁边兄弟的值
                $.ajax({
                    url:"http://localhost:3000/users/islogin",
                    type:"get",
                    dataType:"json",
                    success:function(data){
                        console.log(data);
                        if(data.ok == 0){//功能:加入点击加入购物车时验证没登陆就跳到登录页
                            alert("请先登陆！");
                            location.href = "http://localhost:3000/login.html?back="+location.href;
                        }else{
                            $.ajax({
                                url:"http://localhost:3000/cartItems/add",
                                type:"get",
                                data:{lid,count},
                                success:function(){
                                    $("#IPT").val(1);//添加购物车成功后要把input的值改为1
                                    alert("添加购物车成功!");
                                    loadCart();
                                }
                            });
                        }
                    }
                });
            }    
               
                
        });



        
    });
})();