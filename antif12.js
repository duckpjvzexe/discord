console.log(
    "%c 🚨 STOP! F12 WARNING! 🚨 %c\nPlease close DevTools to continue using the website.",
    "font-size:80px; font-weight:bold; color:#fff; background:#d00000; padding:25px 50px; border-radius:12px; text-shadow:2px 2px 0 #000;",
    "font-size:24px; color:#666;"
);

setInterval(function(){
    var before=new Date().getTime();
    debugger;
    var after=new Date().getTime();
    if(after-before>200){
        document.querySelector("html").innerHTML="";
        window.location.reload(true);
    }
},100);

if (devtool) { devtool.remove(); }
