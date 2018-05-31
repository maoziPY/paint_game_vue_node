var socket = io.connect();
var canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d'),
    msg = document.getElementById('msg'),
    ranger = document.getElementById('ranger'),
    colors = document.getElementById('colors');

var input = document.getElementById('input-msg'),
    users = document.getElementById('div-users'),
    btnIn = document.getElementById('btn-in'),
    btnAutoin = document.getElementById('btn-autoin'),
    info = document.getElementById('info'),
    tops = document.getElementById('tops');
/**
 * [Ctl Controller]
 *
 * pts=points，有对应的x、y属性
 *
 * canvas相关：
 * ctx.save() ==> 保存当前环境的状态，save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作
 * ctx.beginPath() ==> 起始一条路径，或重置当前路径
 * ctx.moveTo() ==> 把路径移动到画布中的指定点，不创建线条
 * ctx.lineTo() ==> 添加一个新点，然后在画布中创建从该点到最后指定点的线条
 * ctx.lineWidth ==> 设置当前的线条宽度
 * ctx.strokeStyle ==> 设置用于笔触的颜色、渐变或模式
 * ctx.stroke() ==> 绘制已定义的路径
 * ctx.restore() ==> 返回之前保存过的路径状态和属性
 */
var Ctl = {
    /**
     * [drawPts 绘制路径]
     * @param  {[object]} ctx [2d上下文]
     * @param  {[object or array]} pts [坐标点集合，或者包括坐标点集合及其他绘制属性的对象]
     * @return {[object]}     [ctx.restore()]
     */
    drawPts: function (ctx,pts) {
        if(pts instanceof Path || pts.pts){
            var color = pts.color,lw = pts.lw;
            pts = pts.pts;
        }
        var p1 = pts[0];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        pts.slice(1).forEach(v=>{
            ctx.lineTo(v.x,v.y);
        });
        ctx.lineWidth = lw || canvas.lw
        ctx.strokeStyle = color || canvas.color;
        ctx.stroke();
        ctx.restore();
    },
    // 设置画笔宽度
    setLw(lw){
        canvas.lw = lw;
    },
    // 设置画笔颜色
    setColor(c){
        canvas.color = c;
    },
    // 把路径添加到canvas.paths中
    addPath : function (pts) {
        canvas.paths.push(new Path(pts,canvas.lw,canvas.color));
    },
    // 添加正在绘制过程中的所有点
    addPos : function (x,y) {
        // canvas.pts.x，canvas.pts.y返回这种结果
        canvas.pts.push(new Pos(x,y));
    },
    // 清除绘制的所有点
    clearPos : function () {
        canvas.pts = []
    }
};

// 监听窗口大小变化
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.paths = canvas.pts = [];
    socket.emit('repaint');
}
window.addEventListener('resize',resize);
resize();


var vm = new Vue({
    el: '#paintGame',
    data: {
        // 消息框
        msg: '',
        // 当前选中的绘制工具，0=没选，1=画笔，2=橡皮擦
        paintToolsSelected: 0,
        // 是否自动上场
        isAutoin: false,
        // 选中的颜色下标，-1=没选，用默认的黑色
        selectedColorIndex: -1
    },
    created () {
        this.init();
    },
    methods: {
        // 初始化canvas状态
        init () {
            canvas.paths=[];
            canvas.pts=[];
            canvas.color = 'black';
            canvas.lw = 1;
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
        // 选择画笔颜色
        chooseColor (e) {
            var t = e.target;
            Array.prototype.slice.call(this.getElementsByClassName('active'))
               .forEach(v=>v.classList.remove('active'));
            t.classList.add('active');
            Ctl.setColor(t.style.backgroundColor);
        },
        // 上场
        inAct () {
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
                // btnin.outAct();
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
        addColor () {
            let r = this.random
            return 'rgb('+[r(256),r(256),r(256)].join(',')+')';
        }
    },
    computed: {
        
    }
})

var socket = io.connect();
var canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d'),
    msg = document.getElementById('msg'),
    ranger = document.getElementById('ranger'),
    colors = document.getElementById('colors');

var input = document.getElementById('input-msg'),
    users = document.getElementById('div-users'),
    btnIn = document.getElementById('btn-in'),
    btnAutoin = document.getElementById('btn-autoin'),
    info = document.getElementById('info'),
    tops = document.getElementById('tops');
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
tops.template = tops.querySelector('[role=template]').cloneNode(true);

info.time = info.querySelector('#time')
info.player = info.querySelector('#player')
info.word = info.querySelector('#word')
// 自动上场
// btnAutoin.addEventListener('click',function (e) {
//     var btnin = btnIn;
//     if(btnin.autoIn == null){
//         // btnin.outAct();
//         if(!btnin.in) socket.emit('in');
//         // 5少轮循，检查自动上场
//         btnin.autoIn = setInterval(function () {
//             // 上场后，isMe=true，btnin.in=true
//             if(canvas.isMe) return;
//             if(!btnin.in) socket.emit('in');
//         },5000);
//     }else{
//         clearInterval(btnin.autoIn);
//         delete btnin.autoIn;
//     }
//     this.classList.toggle('on');
// });
// 上场
// btnIn.addEventListener('click',function () {
//     var t = this.in;
//     if(this.t) clearTimeout(this.t);
//     // 自动上下场
//     this.t = setTimeout(function () {
//         socket.emit(!t?'in':'out');
//     },400);
// })

// window.onload = function () {
//     Ctl.init();
//     // 改变窗口大小时，重新绘制
//     function resize() {
//         canvas.width = canvas.parentElement.clientWidth;
//         canvas.paths = canvas.pts = [];
//         socket.emit('repaint');
//     }
//     this.addEventListener('resize',resize);
//     resize();
//     // 消息框信息事件监听
//     input.onkeydown = function (e) {
//         if(e.keyCode === 13 && this.value!=''){
//             if(canvas.isMe){
//                 alert('绘图者不能够发送消息！');
//                 return;
//             }
//             socket.emit('client msg',this.value);
//             this.value = '';
//         }
//     }
//     // 画笔、橡皮擦、清空、下载。仅用于两笔和橡皮擦切换显示激活的样式
//     document.querySelector('#btns').addEventListener('click',function (e) {
//         // 画笔或橡皮擦
//         if(e.target.classList.contains('btn-active-able')){
//             // 由prevBtn判断是否有active的元素，有则去除
//             if(this.prevBtn){
//                 this.prevBtn.classList.remove('active')
//             }
//             e.target.classList.add('active')
//             this.prevBtn = e.target;
//         }
//     },true);
// }

// 绘制中
canvas.addEventListener('mousemove',function (e) {
    var w=20,h=20;
    if(canvas.isMe){
        var x = e.offsetX, y = e.offsetY;
        // e.buttons === 1，表示鼠标左键按下时并划动
        if(e.buttons === 1) {
            if(!this.erase){
                Ctl.addPos(x,y);
                Ctl.drawPts(ctx, this.pts);
                socket.emit('paint',JSON.stringify({data:new Path(this.pts),status:'ing'}))
            }else{
                var rect = new Rect(x-(w>>>1),y-(h>>>1),w,h);
                rect.clearOn(ctx);
                socket.emit('erase',rect.x,rect.y,rect.w,rect.h);
            }
        }
    }
});

// 绘制结束
canvas.addEventListener('mouseup',function (e) {
    if(!canvas.isMe || this.erase) return;
    var x = e.offsetX,y = e.offsetY;
    Ctl.addPos(x,y);
    Ctl.addPath(this.pts);
    socket.emit('paint',JSON.stringify({data:new Path(this.pts),status:'end'}));
    Ctl.clearPos();

})

// 开始绘制
canvas.addEventListener('mousedown',function (e) {
    if(!this.isMe) return;
    //-------------------- 可爱的分隔线------------------
    if(this.erase){
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
});

// 选择画笔颜色
// colors.addEventListener('click',function (e) {
//     var t = e.target;
//     // 只对点击方形颜色块有效
//     if(t.classList.contains('rect')){
//         Array.prototype.slice.call(this.getElementsByClassName('active'))
//             .forEach(v=>v.classList.remove('active'));
//         t.classList.add('active');
//         Ctl.setColor(t.style.backgroundColor);
//     }
// });

// 选择画笔宽度
ranger.addEventListener('change',function (e) {
    this.nextElementSibling.innerText = this.value;
    Ctl.setLw(this.value);
});

// model

function Pos(x,y) {
    this.x=x;this.y=y;
}

function Path(pts,lw,color) {
    this.pts = pts;
    this.lw = lw || canvas.lw;
    this.color = color || canvas.color;
}

function Rect(x,y,w,h) {
    this.x=x;this.y=y;this.w=w;this.h=h;
}


Rect.prototype.clearOn = function (ctx) {
    ctx.clearRect(this.x,this.y,this.w,this.h);
}



// socket
var socket = io.connect();
// 显示消息
socket.on('server msg',function (data) {
    var ele = document.createElement('p');
    ele.innerHTML = data;
    msg.appendChild(ele);
    msg.scrollTop = msg.scrollHeight;
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
/**
* [erase 清除指定位置及大小的画布]
* @param  {[number]} x [x坐标]
* @param  {[number]} y [y坐标]
* @param  {[number]} w [宽]
* @param  {[number]} h [高]
*/
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
utils = {
    // 创建用户上场显示的标签及相应特性
    makeUserP : function (x) {
        var p = document.createElement('p'); p.id = 'p'+x.id;
        p.innerText = x.name;
        return p;
    }
}
