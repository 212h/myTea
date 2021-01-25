(function(){
    ajax("http://localhost:3000/common_banner.html").then(resp=>{
        // console.log(resp);
        document.getElementById("common_banner").innerHTML = resp;
    });
})();