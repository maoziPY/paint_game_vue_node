!function(t){var e={};function n(o){if(e[o])return e[o].exports;var a=e[o]={i:o,l:!1,exports:{}};return t[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(o,a,function(e){return t[e]}.bind(null,a));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);var o=n(1);function a(){canvas.width=canvas.parentElement.clientWidth,canvas.paths=canvas.pts=[],socket.emit("repaint")}Ctl=o.default,socket=io.connect(),window.addEventListener("resize",a),vm=new Vue({el:"#paintGame",data:{msg:"",paintToolsSelected:0,isAutoin:!1,selectedColorIndex:-1,lineWidth:1,colorArr:[]},mounted(){this.init();for(let t=0;t<20;t++)colorArr.push(this.addColor());this.colorArr=colorArr,canvas=document.getElementsByTagName("canvas")[0],ctx=canvas.getContext("2d"),btnIn=document.getElementById("btn-in"),btnIn.inAct=function(){this.innerText="下场",this.in=!0},btnIn.outAct=function(){this.innerText="上场！",this.in=!1,this.disabled=!1},a(),msg=document.getElementById("msg"),btnAutoin=document.getElementById("btn-autoin"),info=document.getElementById("info"),users=document.getElementById("div-users"),tops.template=tops.querySelector("[role=template]").cloneNode(!0),info.time=info.querySelector("#time"),info.player=info.querySelector("#player"),info.word=info.querySelector("#word")},methods:{init(){canvas.paths=[],canvas.pts=[],canvas.color="black",canvas.lw=this.lineWidth},sendMessage(){let t=this;if(""!==t.msg){if(canvas.isMe)return void alert("绘图者不能够发送消息！");socket.emit("client msg",t.msg),t.msg=""}},choosePaintTools(t){"brush"===t?(this.paintToolsSelected=1,delete canvas.erase):"eraser"===t&&(this.paintToolsSelected=2,canvas.erase=!0)},chooseColor(t){this.selectedColorIndex=t,Ctl.setColor(colorArr[t])},changeLineWidth(){Ctl.setLw(this.lineWidth)},getIn(){var t=btnIn.in;btnIn.t&&clearTimeout(btnIn.t),btnIn.t=setTimeout(function(){socket.emit(t?"out":"in")},400)},autoin(){var t=btnIn;null==t.autoIn?(t.in||socket.emit("in"),t.autoIn=setInterval(function(){canvas.isMe||t.in||socket.emit("in")},5e3)):(clearInterval(t.autoIn),delete t.autoIn),this.isAutoin=!this.isAutoin},random:t=>Math.floor(Math.random()*t),addColor(){let t=this.random,e="rgb("+[t(256),t(256),t(256)].join(",")+")";return colorArr.push(e),e},canvasMousedown(t){if(canvas.isMe){if(canvas.erase){var e=new Rect(n-10,o-10,20,20);return e.clearOn(ctx),void socket.emit("erase",e.x,e.y,e.w,e.h)}var n=t.offsetX,o=t.offsetY;Ctl.clearPos(),Ctl.addPos(n,o)}},canvasMousemove(t){if(canvas.isMe){var e=t.offsetX,n=t.offsetY;if(1===t.buttons)if(canvas.erase){var o=new Rect(e-10,n-10,20,20);o.clearOn(ctx),socket.emit("erase",o.x,o.y,o.w,o.h)}else Ctl.addPos(e,n),Ctl.drawPts(ctx,canvas.pts),socket.emit("paint",JSON.stringify({data:new Path(canvas.pts),status:"ing"}))}},canvasMouseup(t){if(canvas.isMe&&!canvas.erase){var e=t.offsetX,n=t.offsetY;Ctl.addPos(e,n),Ctl.addPath(canvas.pts),socket.emit("paint",JSON.stringify({data:new Path(canvas.pts),status:"end"})),Ctl.clearPos()}},serverMsg(t){var e=document.createElement("p");e.innerHTML=t,msg.appendChild(e),msg.scrollTop=msg.scrollHeight}},computed:{}})},function(t,e,n){"use strict";n.r(e);var o={drawPts:function(t,e){if(e instanceof Path||e.pts){var n=e.color,o=e.lw;e=e.pts}var a=e[0];t.save(),t.beginPath(),t.moveTo(a.x,a.y),e.slice(1).forEach(e=>{t.lineTo(e.x,e.y)}),t.lineWidth=o||canvas.lw,t.strokeStyle=n||canvas.color,t.stroke(),t.restore()},setLw(t){canvas.lw=t},setColor(t){canvas.color=t},addPath:function(t){canvas.paths.push(new Path(t,canvas.lw,canvas.color))},addPos:function(t,e){canvas.pts.push(new Pos(t,e))},clearPos:function(){canvas.pts=[]}};e.default=o}]);