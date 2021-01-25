(()=>{

    ajax("http://localhost:3000/index")
    .then(resp=>{
        // console.log(resp);
        // 1F的功能
        var products = JSON.parse(resp);
        // console.log(products);
        var html = "";
        for(var {pic,title,href} of products){
            html += `<div class="border_shadow rounded">
                     <img src="${pic}" class="transition_linear"/>
                     <div><a href="${href}">${title}</a></div>
                 </div>`;
        }
        document.querySelector("#f1>div").innerHTML = html;
    });
    // 2F的功能
    ajax("http://localhost:3000/index/floorTwo")
    .then(resp=>{
        var products = JSON.parse(resp);
        // console.log(products);
        var html ="";
        for( var {pic,title,href} of products){
            html += `<div class="border_shadow rounded">
                     <img src="${pic}" class="transition_linear"/>
                     <div><a href="${href}">${title}</a></div>
                 </div>`;
        }
        document.querySelector("#f2>div").innerHTML = html;
    });
    // 3F的功能
    ajax("http://localhost:3000/index/floorThree")
    .then(resp=>{
        var products = JSON.parse(resp);
        // console.log(products);
        var html = "";
        for( var {pic,title,href} of products){
            html += `<div class="border_shadow rounded ">
                     <img src="${pic}" class="transition_linear rounded animated pulse infinite"/>
                     <div><a href="${href}">${title}</a></div>
                 </div>`;
        }
        document.querySelector("#f3>div").innerHTML = html;
    });

//*楼层滚动的功能*一定要等页面所有内容加载完，再做滚动功能才准！因为要是有楼层没加载完的话，他就憋那里了，这个时候去计算他的距离就不准，得等所有内容都填满了、一个个都撑开了，这个时候再去做楼层才准！**************************************
    var $divLift = $("#main>div:last-child");
    $(window).scroll(function(){//为整个窗口绑定滚动事件
        var $fs = $("#main>div.bgImg>div.floor_F");//找到所有的楼层
        var $f1 = $fs.first();//找到一个个楼层
        var scrollTop = $("html,body").scrollTop();
        var offsetTop = $f1.offset().top;
        // console.log(scrollTop,offsetTop);
              //红       +  绿       >    蓝
        if(innerHeight/2 + scrollTop > offsetTop){//1F过线条件——过文档显示区的1/2：中线
            $divLift.removeClass("d-none");
        }else{
            $divLift.addClass("d-none");
        }
        //功能:根据楼层判断电梯的按钮是亮还是暗----楼层点亮效果：只能有一个亮，从上到下检查每一个楼层，每检查一个楼层，只要这个楼层符合过线的条件，只要当前楼层过线，就找到当前楼层对应的button,比如二楼过线就把二楼的button添加class为danger,然后把他的兄弟的danger都移除掉,这件事要不停的进行判断
        $fs.each((i,f)=>{//f拿到的就是当前楼层,each拿到的是dom元素,dom元素需要封装以下才能offset()过得top属性
            // console.log(f);//f获得的是html片段
            // console.log(i);//i获得的是f对应的下标0  1  2
            offsetTop = $(f).offset().top;//当前楼层的offset的top//当前楼层距body顶部的距离是offsetTop，f时dom元素，用jquery的话得用$()封装以下才能拿到offset().top的属性
            if(innerHeight/2 + scrollTop > offsetTop){//如果当前楼层过线.如果这层楼满足这个条件,找到i位置的按钮,让他按钮变成红色,让他的兄弟变成普通的颜色
                $divLift.children(`:eq(${i})`)//找他的孩子当中第i个按钮
                    .addClass("btn-danger")
                    .siblings()
                    .removeClass("btn-danger");
            }
        });

    });
    $divLift.on("click","button",function(){//给每个按钮绑定单击事件，只允许下面的button访问
        //获得点击的第几个按钮
        var i = $(this).index();//他是在同一个div下找，所以可以用index()
        //获得对应楼层距页面顶部的总距离offsetTop
        var offsetTop = $(`#main>div.bgImg>div.floor_F:eq(${i})`).offset().top;//选择第i个楼层
        var scrollTop = $("html,body").scrollTop();
        console.log(scrollTop,offsetTop);
        //让页面滚动到和楼层距body顶部总距离相同的位置
        $("html").animate({scrollTop:offsetTop},500);
    });
    // 


})();