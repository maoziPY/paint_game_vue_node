import ctl from './common/ctl.js'
import utils from './common/utils.js'
import io from 'socket.io-client'
// import Vue from 'vue'
Ctl = ctl
socket = io.connect();

// 监听窗口大小变化
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.paths = canvas.pts = [];
    socket.emit('repaint');
}
window.addEventListener('resize',resize);


// 显示消息
socket.on('server msg',function (data) {
    vm.serverMsg(data)
})
// 入口，初始化状态
socket.on('login',function () {
    if(!prompt)
    // if(prompt)
        socket.emit('login',prompt('输入你的姓名'));
    else
        socket.emit('login','手机用户');
    btnIn.outAct();
    canvas.isMe = false;
    btnAutoin.disalbed = false;
});
// 根据RAM中的paths变量，若存在tag==='pts'标识，则绘制，否则清除
socket.on('paint paths',function (paths) {
    paths = JSON.parse(paths);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var k in paths) {
        if(paths[k].tag==='pts')
            Ctl.drawPts(ctx, paths[k]);
        else{
            new Rect(paths[k].x,paths[k].y,paths[k].w,paths[k].h).clearOn(ctx);
        }
    }
});
// 根据路径参数进行绘制
socket.on('paint pts',function (pts) {
    //canvas.paths = paths;
    pts = JSON.parse(pts)
    if(!pts) return;
    Ctl.drawPts(ctx, pts);
});
socket.on('cmd',function (data) {
    // console.log(JSON.parse(data));
});
// 上场的用户
socket.on('reset in users',function (data) {
    data = JSON.parse(data);
    /*
        [
            {name: '', in:true}
        ]
     */
    users.innerHTML = '';
    data.forEach(x=>{
        users.appendChild(utils.makeUserP(x));
    });
})
// 擦除
socket.on('erase',function (x,y,w,h) {
    new Rect(x,y,w,h).clearOn(ctx);
})
// 广播通知有用户上场
socket.on('new in user',function (data) {
    users.appendChild(utils.makeUserP(JSON.parse(data)));
});
socket.on('out user',function (id) {
    var x = users.querySelector('#p'+id);
    if(x) x.outerHTML='';
})
// 上场
socket.on('in',function (data) {
    users.appendChild(utils.makeUserP(JSON.parse(data)));
    users.scrollTop = users.scrollHeight;
    btnIn.inAct();
});
// 下场
socket.on('out',function (id) {
    var x = users.querySelector('#p'+id);
    if(x){
        x.outerHTML='';
        btnIn.outAct();
    }
});
// 信息栏
socket.on('mytime',function (data) {
    data = JSON.parse(data);// name,word:,time
    btnIn.disabled = true;
    info.player.innerText = data.name + '(自己)';
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
    canvas.isMe = true;
});
// 广播信息栏
socket.on('othertime',function (data) {
    data = JSON.parse(data);// name,word:,time
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    canvas.isMe = false;
});
// 广播倒计时及更新提示信息
socket.on('update time',function (data) {
    data = JSON.parse(data);
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
});
// 倒计时
socket.on('update my time',function (data) {
    data = JSON.parse(data);
    info.time.innerText = data.time +'s';
});
// 时间到
socket.on('mytimeout',function (id) {
    var t = users.querySelector('#p'+id);
    if(t) t.outerHTML='';
    info.time.innerText = '时间到了！';
    canvas.isMe = false;
    btnIn.outAct();
});
// 广播时间到，公布答案
socket.on('timeout',function (d) {
    d = JSON.parse(d);
    var t = users.querySelector('#p'+d.id);
    if(t) t.outerHTML='';
    info.time.innerText = '时间到了！';
    info.word.innerText = '正确答案为：'+d.word;
});
// 清空画布
socket.on('clear paint',function () {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
});
// 排行榜
socket.on('tops',function (d) {
    d = JSON.parse(d);
    tops.innerHTML = '';
    var temp = tops.template;
    d.forEach((x,i)=>{
        temp.id = x.id;
        temp.children[0].firstElementChild.innerText = 'No'+(i+1);
        temp.children[1].firstElementChild.innerText = x.name;
        temp.children[2].firstElementChild.innerText = x.v+'次';

        var node = tops.template.cloneNode(true);
        node.removeAttribute('role');
        tops.appendChild(node);
    });
})

vm = new Vue({
    el: '#paintGame',
    data: {
        // 消息框
        msg: '',
        // 当前选中的绘制工具，0=没选，1=画笔，2=橡皮擦
        paintToolsSelected: 0,
        // 是否自动上场
        isAutoin: false,
        // 选中的颜色下标，-1=没选，用默认的黑色
        selectedColorIndex: -1,
        // 画笔的宽度
        lineWidth: 1,
        colorArr: []
    },
    mounted () {
    	let _this = this
        _this.init();

        // 初始化颜色数据
        // PS:在html中直接用:style="{ backgroundColor: addColor()}"生成样式有bug，选择颜色或者改变宽度时会自动触发addColor()
        for (let i=0; i<20; i++) {
            colorArr.push(this.addColor())
        }
        this.colorArr = colorArr


        canvas = document.getElementsByTagName('canvas')[0];
        ctx = canvas.getContext('2d');
        btnIn = document.getElementById('btn-in');

        // 初始化已上场状态
        btnIn.inAct = function () {
            this.innerText='下场';
            this.in=true;
        };
        // 初始化待上场状态
        btnIn.outAct = function () {
            this.innerText='上场！';
            this.in=false;
            this.disabled = false;
        };

        resize();

        msg = document.getElementById('msg');
    	btnAutoin = document.getElementById('btn-autoin');
        info = document.getElementById('info');
        users = document.getElementById('div-users');

        tops.template = tops.querySelector('[role=template]').cloneNode(true);

        info.time = info.querySelector('#time')
        info.player = info.querySelector('#player')
        info.word = info.querySelector('#word')
    },
    methods: {
        // 初始化canvas状态
        init () {
            canvas.paths=[];
            canvas.pts=[];
            canvas.color = 'black';
            canvas.lw = this.lineWidth;
        },
        // 按回车发送消息
        sendMessage () {
        	
            let _this = this
            if(_this.msg !== ''){
                if(canvas.isMe){
                    alert('绘图者不能够发送消息！');
                    return;
                }
                socket.emit('client msg',_this.msg);
                _this.msg = '';
            }
        },
        /**
         * [choosePaintTools 选择绘制工具]
         * @param  {[string]} type [可能的值：brush=画笔，eraser=橡皮擦]
         */
        choosePaintTools (type) {
            if (type === 'brush') {
                this.paintToolsSelected = 1
                delete canvas.erase
            } else if (type === 'eraser') {
                this.paintToolsSelected = 2
                canvas.erase=true;
            }
        },
        /**
         * [chooseColor 选择画笔颜色]
         * @param  {[number]} index [颜色数组的下标]
         */
        chooseColor (index) {
            this.selectedColorIndex = index
            Ctl.setColor(colorArr[index]);
        },
        // 选择画笔宽度 
        changeLineWidth () {
        	Ctl.setLw(this.lineWidth);
        },
        // 上场
        getIn () {
            var t = btnIn.in;
            if(btnIn.t) clearTimeout(btnIn.t);
            // 自动上下场
            btnIn.t = setTimeout(function () {
                socket.emit(!t?'in':'out');
            },400);
        },
        // 自动上场
        autoin () {
            var btnin = btnIn;
            if(btnin.autoIn == null){
                if(!btnin.in) socket.emit('in');
                // 5少轮循，检查自动上场
                btnin.autoIn = setInterval(function () {
                    // 上场后，isMe=true，btnin.in=true
                    if(canvas.isMe) return;
                    if(!btnin.in) socket.emit('in');
                },5000);
            }else{
                clearInterval(btnin.autoIn);
                delete btnin.autoIn;
            }
            // toggle关于on的class
            this.isAutoin = !this.isAutoin
        },
        /**
         * [random 生成随机数，主要用于随机生成颜色]
         * @param  {[number]} b [最大的数减1]
         * @return {[number]}   [0~b-1的数]
         */
        random (b) {
            return Math.floor(Math.random()*b)
        },
        // 返回随机的颜色
        addColor () {
            let r = this.random
            let color = 'rgb('+[r(256),r(256),r(256)].join(',')+')'
            colorArr.push(color)
            return color
        },
        // 开始绘制
        canvasMousedown (e) {
        	if(!canvas.isMe) return;
        	if(canvas.erase){
        	    var w=20,h=20;
        	    // w>>>1相当于Math.ceil(w/2)，表示向上取整
        	    var rect = new Rect(x-(w>>>1),y-(h>>>1),w,h);
        	    rect.clearOn(ctx);
        	    socket.emit('erase',rect.x,rect.y,rect.w,rect.h);
        	    return;
        	}
        	var x = e.offsetX,y = e.offsetY;
        	Ctl.clearPos();
        	Ctl.addPos(x,y);
        },
        // 绘制中
        canvasMousemove (e) {
        	var w=20,h=20;
        	if(canvas.isMe){
        	    var x = e.offsetX, y = e.offsetY;
        	    // e.buttons === 1，表示鼠标左键按下时并划动
        	    if(e.buttons === 1) {
        	        if(!canvas.erase){
        	            Ctl.addPos(x,y);
        	            Ctl.drawPts(ctx, canvas.pts);
        	            socket.emit('paint',JSON.stringify({data:new Path(canvas.pts),status:'ing'}))
        	        }else{
        	            var rect = new Rect(x-(w>>>1),y-(h>>>1),w,h);
        	            rect.clearOn(ctx);
        	            socket.emit('erase',rect.x,rect.y,rect.w,rect.h);
        	        }
        	    }
        	}
        },
        // 绘制结束
        canvasMouseup (e) {
        	if(!canvas.isMe || canvas.erase) return;
        	var x = e.offsetX,y = e.offsetY;
        	Ctl.addPos(x,y);
        	Ctl.addPath(canvas.pts);
        	socket.emit('paint',JSON.stringify({data:new Path(canvas.pts),status:'end'}));
        	Ctl.clearPos();
        },
        // 消息框
        serverMsg (data) {
        	var ele = document.createElement('p');
        	ele.innerHTML = data;
        	msg.appendChild(ele);
        	msg.scrollTop = msg.scrollHeight;
        }

    },
    computed: {}
})