/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// import util from './common/util.js'
// import store from './common/store.js'
// console.log(test)
var socket = io.connect();

let [colorArr, Ctl, canvas, ctx, btnIn, msg, btnAutoin, info, users] = [[], {}, {}, {}, {}, {}, {}, {}, {}]

// 监听窗口大小变化
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.paths = canvas.pts = [];
    socket.emit('repaint');
}
window.addEventListener('resize',resize);


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

let vm = new Vue({
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
        Ctl = {
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
        	//-------------------- 可爱的分隔线------------------
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

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

// socket
// var socket = io.connect();
// import store from './store.js'
// let [colorArr, Ctl, canvas, ctx, btnIn, msg, btnAutoin, info, users] = [store.colorArr, store.Ctl, store.canvas, store.ctx, store.btnIn, store.msg, store.btnAutoin, store.info, store.users]

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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3N0YXRpYy9tYWluLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zdGF0aWMvY29tbW9uL3NvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOEVBQThFLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7O0FBRTFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxTQUFTLFNBQVM7QUFDL0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLDZCQUE2QjtBQUM3RCxxQkFBcUIsTUFBTTtBQUMzQjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsU0FBUztBQUNqQyx3QkFBd0Isa0JBQWtCO0FBQzFDLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELHVDQUF1QztBQUNoRyxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2Qyx1Q0FBdUM7QUFDcEY7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0EsQ0FBQyxDOzs7Ozs7OztBQ3pTRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsU0FBUztBQUNwQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8vIGltcG9ydCB1dGlsIGZyb20gJy4vY29tbW9uL3V0aWwuanMnXG4vLyBpbXBvcnQgc3RvcmUgZnJvbSAnLi9jb21tb24vc3RvcmUuanMnXG4vLyBjb25zb2xlLmxvZyh0ZXN0KVxudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcblxubGV0IFtjb2xvckFyciwgQ3RsLCBjYW52YXMsIGN0eCwgYnRuSW4sIG1zZywgYnRuQXV0b2luLCBpbmZvLCB1c2Vyc10gPSBbW10sIHt9LCB7fSwge30sIHt9LCB7fSwge30sIHt9LCB7fV1cblxuLy8g55uR5ZCs56qX5Y+j5aSn5bCP5Y+Y5YyWXG5mdW5jdGlvbiByZXNpemUoKSB7XG4gICAgY2FudmFzLndpZHRoID0gY2FudmFzLnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgY2FudmFzLnBhdGhzID0gY2FudmFzLnB0cyA9IFtdO1xuICAgIHNvY2tldC5lbWl0KCdyZXBhaW50Jyk7XG59XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyxyZXNpemUpO1xuXG5cbi8vIG1vZGVsXG5cbmZ1bmN0aW9uIFBvcyh4LHkpIHtcbiAgICB0aGlzLng9eDt0aGlzLnk9eTtcbn1cblxuZnVuY3Rpb24gUGF0aChwdHMsbHcsY29sb3IpIHtcbiAgICB0aGlzLnB0cyA9IHB0cztcbiAgICB0aGlzLmx3ID0gbHcgfHwgY2FudmFzLmx3O1xuICAgIHRoaXMuY29sb3IgPSBjb2xvciB8fCBjYW52YXMuY29sb3I7XG59XG5cbmZ1bmN0aW9uIFJlY3QoeCx5LHcsaCkge1xuICAgIHRoaXMueD14O3RoaXMueT15O3RoaXMudz13O3RoaXMuaD1oO1xufVxuXG5SZWN0LnByb3RvdHlwZS5jbGVhck9uID0gZnVuY3Rpb24gKGN0eCkge1xuICAgIGN0eC5jbGVhclJlY3QodGhpcy54LHRoaXMueSx0aGlzLncsdGhpcy5oKTtcbn1cblxubGV0IHZtID0gbmV3IFZ1ZSh7XG4gICAgZWw6ICcjcGFpbnRHYW1lJyxcbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIOa2iOaBr+ahhlxuICAgICAgICBtc2c6ICcnLFxuICAgICAgICAvLyDlvZPliY3pgInkuK3nmoTnu5jliLblt6XlhbfvvIwwPeayoemAie+8jDE955S756yU77yMMj3mqaHnmq7mk6ZcbiAgICAgICAgcGFpbnRUb29sc1NlbGVjdGVkOiAwLFxuICAgICAgICAvLyDmmK/lkKboh6rliqjkuIrlnLpcbiAgICAgICAgaXNBdXRvaW46IGZhbHNlLFxuICAgICAgICAvLyDpgInkuK3nmoTpopzoibLkuIvmoIfvvIwtMT3msqHpgInvvIznlKjpu5jorqTnmoTpu5HoibJcbiAgICAgICAgc2VsZWN0ZWRDb2xvckluZGV4OiAtMSxcbiAgICAgICAgLy8g55S756yU55qE5a695bqmXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgY29sb3JBcnI6IFtdXG4gICAgfSxcbiAgICBtb3VudGVkICgpIHtcbiAgICBcdGxldCBfdGhpcyA9IHRoaXNcbiAgICAgICAgX3RoaXMuaW5pdCgpO1xuXG4gICAgICAgIC8vIOWIneWni+WMluminOiJsuaVsOaNrlxuICAgICAgICAvLyBQUzrlnKhodG1s5Lit55u05o6l55SoOnN0eWxlPVwieyBiYWNrZ3JvdW5kQ29sb3I6IGFkZENvbG9yKCl9XCLnlJ/miJDmoLflvI/mnIlidWfvvIzpgInmi6npopzoibLmiJbogIXmlLnlj5jlrr3luqbml7bkvJroh6rliqjop6blj5FhZGRDb2xvcigpXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgICAgICBjb2xvckFyci5wdXNoKHRoaXMuYWRkQ29sb3IoKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbG9yQXJyID0gY29sb3JBcnJcblxuXG4gICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgICAgICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGJ0bkluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1pbicpO1xuXG4gICAgICAgIC8vIOWIneWni+WMluW3suS4iuWcuueKtuaAgVxuICAgICAgICBidG5Jbi5pbkFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5uZXJUZXh0PSfkuIvlnLonO1xuICAgICAgICAgICAgdGhpcy5pbj10cnVlO1xuICAgICAgICB9O1xuICAgICAgICAvLyDliJ3lp4vljJblvoXkuIrlnLrnirbmgIFcbiAgICAgICAgYnRuSW4ub3V0QWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pbm5lclRleHQ9J+S4iuWcuu+8gSc7XG4gICAgICAgICAgICB0aGlzLmluPWZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNpemUoKTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbQ3RsIENvbnRyb2xsZXJdXG4gICAgICAgICAqXG4gICAgICAgICAqIHB0cz1wb2ludHPvvIzmnInlr7nlupTnmoR444CBeeWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBjYW52YXPnm7jlhbPvvJpcbiAgICAgICAgICogY3R4LnNhdmUoKSA9PT4g5L+d5a2Y5b2T5YmN546v5aKD55qE54q25oCB77yMc2F2ZeS5i+WQju+8jOWPr+S7peiwg+eUqENhbnZhc+eahOW5s+enu+OAgeaUvue8qeOAgeaXi+i9rOOAgemUmeWIh+OAgeijgeWJquetieaTjeS9nFxuICAgICAgICAgKiBjdHguYmVnaW5QYXRoKCkgPT0+IOi1t+Wni+S4gOadoei3r+W+hO+8jOaIlumHjee9ruW9k+WJjei3r+W+hFxuICAgICAgICAgKiBjdHgubW92ZVRvKCkgPT0+IOaKiui3r+W+hOenu+WKqOWIsOeUu+W4g+S4reeahOaMh+WumueCue+8jOS4jeWIm+W7uue6v+adoVxuICAgICAgICAgKiBjdHgubGluZVRvKCkgPT0+IOa3u+WKoOS4gOS4quaWsOeCue+8jOeEtuWQjuWcqOeUu+W4g+S4reWIm+W7uuS7juivpeeCueWIsOacgOWQjuaMh+WumueCueeahOe6v+adoVxuICAgICAgICAgKiBjdHgubGluZVdpZHRoID09PiDorr7nva7lvZPliY3nmoTnur/mnaHlrr3luqZcbiAgICAgICAgICogY3R4LnN0cm9rZVN0eWxlID09PiDorr7nva7nlKjkuo7nrJTop6bnmoTpopzoibLjgIHmuJDlj5jmiJbmqKHlvI9cbiAgICAgICAgICogY3R4LnN0cm9rZSgpID09PiDnu5jliLblt7LlrprkuYnnmoTot6/lvoRcbiAgICAgICAgICogY3R4LnJlc3RvcmUoKSA9PT4g6L+U5Zue5LmL5YmN5L+d5a2Y6L+H55qE6Lev5b6E54q25oCB5ZKM5bGe5oCnXG4gICAgICAgICAqL1xuICAgICAgICBDdGwgPSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFtkcmF3UHRzIOe7mOWItui3r+W+hF1cbiAgICAgICAgICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBjdHggWzJk5LiK5LiL5paHXVxuICAgICAgICAgICAgICogQHBhcmFtICB7W29iamVjdCBvciBhcnJheV19IHB0cyBb5Z2Q5qCH54K56ZuG5ZCI77yM5oiW6ICF5YyF5ous5Z2Q5qCH54K56ZuG5ZCI5Y+K5YW25LuW57uY5Yi25bGe5oCn55qE5a+56LGhXVxuICAgICAgICAgICAgICogQHJldHVybiB7W29iamVjdF19ICAgICBbY3R4LnJlc3RvcmUoKV1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZHJhd1B0czogZnVuY3Rpb24gKGN0eCxwdHMpIHtcbiAgICAgICAgICAgICAgICBpZihwdHMgaW5zdGFuY2VvZiBQYXRoIHx8IHB0cy5wdHMpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSBwdHMuY29sb3IsbHcgPSBwdHMubHc7XG4gICAgICAgICAgICAgICAgICAgIHB0cyA9IHB0cy5wdHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBwMSA9IHB0c1swXTtcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHAxLngsIHAxLnkpO1xuICAgICAgICAgICAgICAgIHB0cy5zbGljZSgxKS5mb3JFYWNoKHY9PntcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh2Lngsdi55KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gbHcgfHwgY2FudmFzLmx3XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3IgfHwgY2FudmFzLmNvbG9yO1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOiuvue9rueUu+eslOWuveW6plxuICAgICAgICAgICAgc2V0THcobHcpe1xuICAgICAgICAgICAgICAgIGNhbnZhcy5sdyA9IGx3O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOiuvue9rueUu+eslOminOiJslxuICAgICAgICAgICAgc2V0Q29sb3IoYyl7XG4gICAgICAgICAgICAgICAgY2FudmFzLmNvbG9yID0gYztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDmiorot6/lvoTmt7vliqDliLBjYW52YXMucGF0aHPkuK1cbiAgICAgICAgICAgIGFkZFBhdGggOiBmdW5jdGlvbiAocHRzKSB7XG4gICAgICAgICAgICAgICAgY2FudmFzLnBhdGhzLnB1c2gobmV3IFBhdGgocHRzLGNhbnZhcy5sdyxjYW52YXMuY29sb3IpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDmt7vliqDmraPlnKjnu5jliLbov4fnqIvkuK3nmoTmiYDmnInngrlcbiAgICAgICAgICAgIGFkZFBvcyA6IGZ1bmN0aW9uICh4LHkpIHtcbiAgICAgICAgICAgICAgICAvLyBjYW52YXMucHRzLnjvvIxjYW52YXMucHRzLnnov5Tlm57ov5nnp43nu5PmnpxcbiAgICAgICAgICAgICAgICBjYW52YXMucHRzLnB1c2gobmV3IFBvcyh4LHkpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDmuIXpmaTnu5jliLbnmoTmiYDmnInngrlcbiAgICAgICAgICAgIGNsZWFyUG9zIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhbnZhcy5wdHMgPSBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG1zZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtc2cnKTtcbiAgICBcdGJ0bkF1dG9pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4tYXV0b2luJyk7XG4gICAgICAgIGluZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mbycpO1xuICAgICAgICB1c2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtdXNlcnMnKTtcblxuICAgICAgICB0b3BzLnRlbXBsYXRlID0gdG9wcy5xdWVyeVNlbGVjdG9yKCdbcm9sZT10ZW1wbGF0ZV0nKS5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgaW5mby50aW1lID0gaW5mby5xdWVyeVNlbGVjdG9yKCcjdGltZScpXG4gICAgICAgIGluZm8ucGxheWVyID0gaW5mby5xdWVyeVNlbGVjdG9yKCcjcGxheWVyJylcbiAgICAgICAgaW5mby53b3JkID0gaW5mby5xdWVyeVNlbGVjdG9yKCcjd29yZCcpXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIC8vIOWIneWni+WMlmNhbnZhc+eKtuaAgVxuICAgICAgICBpbml0ICgpIHtcbiAgICAgICAgICAgIGNhbnZhcy5wYXRocz1bXTtcbiAgICAgICAgICAgIGNhbnZhcy5wdHM9W107XG4gICAgICAgICAgICBjYW52YXMuY29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAgY2FudmFzLmx3ID0gdGhpcy5saW5lV2lkdGg7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOaMieWbnui9puWPkemAgea2iOaBr1xuICAgICAgICBzZW5kTWVzc2FnZSAoKSB7XG4gICAgICAgIFx0XG4gICAgICAgICAgICBsZXQgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICBpZihfdGhpcy5tc2cgIT09ICcnKXtcbiAgICAgICAgICAgICAgICBpZihjYW52YXMuaXNNZSl7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfnu5jlm77ogIXkuI3og73lpJ/lj5HpgIHmtojmga/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnY2xpZW50IG1zZycsX3RoaXMubXNnKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5tc2cgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtjaG9vc2VQYWludFRvb2xzIOmAieaLqee7mOWItuW3peWFt11cbiAgICAgICAgICogQHBhcmFtICB7W3N0cmluZ119IHR5cGUgW+WPr+iDveeahOWAvO+8mmJydXNoPeeUu+eslO+8jGVyYXNlcj3mqaHnmq7mk6ZdXG4gICAgICAgICAqL1xuICAgICAgICBjaG9vc2VQYWludFRvb2xzICh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2JydXNoJykge1xuICAgICAgICAgICAgICAgIHRoaXMucGFpbnRUb29sc1NlbGVjdGVkID0gMVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjYW52YXMuZXJhc2VcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2VyYXNlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaW50VG9vbHNTZWxlY3RlZCA9IDJcbiAgICAgICAgICAgICAgICBjYW52YXMuZXJhc2U9dHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtjaG9vc2VDb2xvciDpgInmi6nnlLvnrJTpopzoibJdXG4gICAgICAgICAqIEBwYXJhbSAge1tudW1iZXJdfSBpbmRleCBb6aKc6Imy5pWw57uE55qE5LiL5qCHXVxuICAgICAgICAgKi9cbiAgICAgICAgY2hvb3NlQ29sb3IgKGluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ29sb3JJbmRleCA9IGluZGV4XG4gICAgICAgICAgICBDdGwuc2V0Q29sb3IoY29sb3JBcnJbaW5kZXhdKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6YCJ5oup55S756yU5a695bqmIFxuICAgICAgICBjaGFuZ2VMaW5lV2lkdGggKCkge1xuICAgICAgICBcdEN0bC5zZXRMdyh0aGlzLmxpbmVXaWR0aCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOS4iuWculxuICAgICAgICBnZXRJbiAoKSB7XG4gICAgICAgICAgICB2YXIgdCA9IGJ0bkluLmluO1xuICAgICAgICAgICAgaWYoYnRuSW4udCkgY2xlYXJUaW1lb3V0KGJ0bkluLnQpO1xuICAgICAgICAgICAgLy8g6Ieq5Yqo5LiK5LiL5Zy6XG4gICAgICAgICAgICBidG5Jbi50ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoIXQ/J2luJzonb3V0Jyk7XG4gICAgICAgICAgICB9LDQwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOiHquWKqOS4iuWculxuICAgICAgICBhdXRvaW4gKCkge1xuICAgICAgICAgICAgdmFyIGJ0bmluID0gYnRuSW47XG4gICAgICAgICAgICBpZihidG5pbi5hdXRvSW4gPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgaWYoIWJ0bmluLmluKSBzb2NrZXQuZW1pdCgnaW4nKTtcbiAgICAgICAgICAgICAgICAvLyA15bCR6L2u5b6q77yM5qOA5p+l6Ieq5Yqo5LiK5Zy6XG4gICAgICAgICAgICAgICAgYnRuaW4uYXV0b0luID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDkuIrlnLrlkI7vvIxpc01lPXRydWXvvIxidG5pbi5pbj10cnVlXG4gICAgICAgICAgICAgICAgICAgIGlmKGNhbnZhcy5pc01lKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlmKCFidG5pbi5pbikgc29ja2V0LmVtaXQoJ2luJyk7XG4gICAgICAgICAgICAgICAgfSw1MDAwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYnRuaW4uYXV0b0luKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgYnRuaW4uYXV0b0luO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdG9nZ2xl5YWz5LqOb27nmoRjbGFzc1xuICAgICAgICAgICAgdGhpcy5pc0F1dG9pbiA9ICF0aGlzLmlzQXV0b2luXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbcmFuZG9tIOeUn+aIkOmaj+acuuaVsO+8jOS4u+imgeeUqOS6jumaj+acuueUn+aIkOminOiJsl1cbiAgICAgICAgICogQHBhcmFtICB7W251bWJlcl19IGIgW+acgOWkp+eahOaVsOWHjzFdXG4gICAgICAgICAqIEByZXR1cm4ge1tudW1iZXJdfSAgIFswfmItMeeahOaVsF1cbiAgICAgICAgICovXG4gICAgICAgIHJhbmRvbSAoYikge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpiKVxuICAgICAgICB9LFxuICAgICAgICAvLyDov5Tlm57pmo/mnLrnmoTpopzoibJcbiAgICAgICAgYWRkQ29sb3IgKCkge1xuICAgICAgICAgICAgbGV0IHIgPSB0aGlzLnJhbmRvbVxuICAgICAgICAgICAgbGV0IGNvbG9yID0gJ3JnYignK1tyKDI1NikscigyNTYpLHIoMjU2KV0uam9pbignLCcpKycpJ1xuICAgICAgICAgICAgY29sb3JBcnIucHVzaChjb2xvcilcbiAgICAgICAgICAgIHJldHVybiBjb2xvclxuICAgICAgICB9LFxuICAgICAgICAvLyDlvIDlp4vnu5jliLZcbiAgICAgICAgY2FudmFzTW91c2Vkb3duIChlKSB7XG4gICAgICAgIFx0aWYoIWNhbnZhcy5pc01lKSByZXR1cm47XG4gICAgICAgIFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLSDlj6/niLHnmoTliIbpmpTnur8tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgXHRpZihjYW52YXMuZXJhc2Upe1xuICAgICAgICBcdCAgICB2YXIgdz0yMCxoPTIwO1xuICAgICAgICBcdCAgICAvLyB3Pj4+MeebuOW9k+S6jk1hdGguY2VpbCh3LzIp77yM6KGo56S65ZCR5LiK5Y+W5pW0XG4gICAgICAgIFx0ICAgIHZhciByZWN0ID0gbmV3IFJlY3QoeC0odz4+PjEpLHktKGg+Pj4xKSx3LGgpO1xuICAgICAgICBcdCAgICByZWN0LmNsZWFyT24oY3R4KTtcbiAgICAgICAgXHQgICAgc29ja2V0LmVtaXQoJ2VyYXNlJyxyZWN0LngscmVjdC55LHJlY3QudyxyZWN0LmgpO1xuICAgICAgICBcdCAgICByZXR1cm47XG4gICAgICAgIFx0fVxuICAgICAgICBcdHZhciB4ID0gZS5vZmZzZXRYLHkgPSBlLm9mZnNldFk7XG4gICAgICAgIFx0Q3RsLmNsZWFyUG9zKCk7XG4gICAgICAgIFx0Q3RsLmFkZFBvcyh4LHkpO1xuICAgICAgICB9LFxuICAgICAgICAvLyDnu5jliLbkuK1cbiAgICAgICAgY2FudmFzTW91c2Vtb3ZlIChlKSB7XG4gICAgICAgIFx0dmFyIHc9MjAsaD0yMDtcbiAgICAgICAgXHRpZihjYW52YXMuaXNNZSl7XG4gICAgICAgIFx0ICAgIHZhciB4ID0gZS5vZmZzZXRYLCB5ID0gZS5vZmZzZXRZO1xuICAgICAgICBcdCAgICAvLyBlLmJ1dHRvbnMgPT09IDHvvIzooajnpLrpvKDmoIflt6bplK7mjInkuIvml7blubbliJLliqhcbiAgICAgICAgXHQgICAgaWYoZS5idXR0b25zID09PSAxKSB7XG4gICAgICAgIFx0ICAgICAgICBpZighY2FudmFzLmVyYXNlKXtcbiAgICAgICAgXHQgICAgICAgICAgICBDdGwuYWRkUG9zKHgseSk7XG4gICAgICAgIFx0ICAgICAgICAgICAgQ3RsLmRyYXdQdHMoY3R4LCBjYW52YXMucHRzKTtcbiAgICAgICAgXHQgICAgICAgICAgICBzb2NrZXQuZW1pdCgncGFpbnQnLEpTT04uc3RyaW5naWZ5KHtkYXRhOm5ldyBQYXRoKGNhbnZhcy5wdHMpLHN0YXR1czonaW5nJ30pKVxuICAgICAgICBcdCAgICAgICAgfWVsc2V7XG4gICAgICAgIFx0ICAgICAgICAgICAgdmFyIHJlY3QgPSBuZXcgUmVjdCh4LSh3Pj4+MSkseS0oaD4+PjEpLHcsaCk7XG4gICAgICAgIFx0ICAgICAgICAgICAgcmVjdC5jbGVhck9uKGN0eCk7XG4gICAgICAgIFx0ICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2VyYXNlJyxyZWN0LngscmVjdC55LHJlY3QudyxyZWN0LmgpO1xuICAgICAgICBcdCAgICAgICAgfVxuICAgICAgICBcdCAgICB9XG4gICAgICAgIFx0fVxuICAgICAgICB9LFxuICAgICAgICAvLyDnu5jliLbnu5PmnZ9cbiAgICAgICAgY2FudmFzTW91c2V1cCAoZSkge1xuICAgICAgICBcdGlmKCFjYW52YXMuaXNNZSB8fCBjYW52YXMuZXJhc2UpIHJldHVybjtcbiAgICAgICAgXHR2YXIgeCA9IGUub2Zmc2V0WCx5ID0gZS5vZmZzZXRZO1xuICAgICAgICBcdEN0bC5hZGRQb3MoeCx5KTtcbiAgICAgICAgXHRDdGwuYWRkUGF0aChjYW52YXMucHRzKTtcbiAgICAgICAgXHRzb2NrZXQuZW1pdCgncGFpbnQnLEpTT04uc3RyaW5naWZ5KHtkYXRhOm5ldyBQYXRoKGNhbnZhcy5wdHMpLHN0YXR1czonZW5kJ30pKTtcbiAgICAgICAgXHRDdGwuY2xlYXJQb3MoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5raI5oGv5qGGXG4gICAgICAgIHNlcnZlck1zZyAoZGF0YSkge1xuICAgICAgICBcdHZhciBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIFx0ZWxlLmlubmVySFRNTCA9IGRhdGE7XG4gICAgICAgIFx0bXNnLmFwcGVuZENoaWxkKGVsZSk7XG4gICAgICAgIFx0bXNnLnNjcm9sbFRvcCA9IG1zZy5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHt9XG59KSIsIi8vIHNvY2tldFxyXG4vLyB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgpO1xyXG4vLyBpbXBvcnQgc3RvcmUgZnJvbSAnLi9zdG9yZS5qcydcclxuLy8gbGV0IFtjb2xvckFyciwgQ3RsLCBjYW52YXMsIGN0eCwgYnRuSW4sIG1zZywgYnRuQXV0b2luLCBpbmZvLCB1c2Vyc10gPSBbc3RvcmUuY29sb3JBcnIsIHN0b3JlLkN0bCwgc3RvcmUuY2FudmFzLCBzdG9yZS5jdHgsIHN0b3JlLmJ0bkluLCBzdG9yZS5tc2csIHN0b3JlLmJ0bkF1dG9pbiwgc3RvcmUuaW5mbywgc3RvcmUudXNlcnNdXHJcblxyXG4vLyDmmL7npLrmtojmga9cclxuc29ja2V0Lm9uKCdzZXJ2ZXIgbXNnJyxmdW5jdGlvbiAoZGF0YSkge1xyXG5cdHZtLnNlcnZlck1zZyhkYXRhKVxyXG59KVxyXG4vLyDlhaXlj6PvvIzliJ3lp4vljJbnirbmgIFcclxuc29ja2V0Lm9uKCdsb2dpbicsZnVuY3Rpb24gKCkge1xyXG4gICAgaWYoIXByb21wdClcclxuICAgIC8vIGlmKHByb21wdClcclxuICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLHByb21wdCgn6L6T5YWl5L2g55qE5aeT5ZCNJykpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHNvY2tldC5lbWl0KCdsb2dpbicsJ+aJi+acuueUqOaItycpO1xyXG4gICAgYnRuSW4ub3V0QWN0KCk7XHJcbiAgICBjYW52YXMuaXNNZSA9IGZhbHNlO1xyXG4gICAgYnRuQXV0b2luLmRpc2FsYmVkID0gZmFsc2U7XHJcbn0pO1xyXG4vLyDmoLnmja5SQU3kuK3nmoRwYXRoc+WPmOmHj++8jOiLpeWtmOWcqHRhZz09PSdwdHMn5qCH6K+G77yM5YiZ57uY5Yi277yM5ZCm5YiZ5riF6ZmkXHJcbnNvY2tldC5vbigncGFpbnQgcGF0aHMnLGZ1bmN0aW9uIChwYXRocykge1xyXG4gICAgcGF0aHMgPSBKU09OLnBhcnNlKHBhdGhzKTtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcclxuICAgIGZvcih2YXIgayBpbiBwYXRocykge1xyXG4gICAgICAgIGlmKHBhdGhzW2tdLnRhZz09PSdwdHMnKVxyXG4gICAgICAgICAgICBDdGwuZHJhd1B0cyhjdHgsIHBhdGhzW2tdKTtcclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBuZXcgUmVjdChwYXRoc1trXS54LHBhdGhzW2tdLnkscGF0aHNba10udyxwYXRoc1trXS5oKS5jbGVhck9uKGN0eCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8g5qC55o2u6Lev5b6E5Y+C5pWw6L+b6KGM57uY5Yi2XHJcbnNvY2tldC5vbigncGFpbnQgcHRzJyxmdW5jdGlvbiAocHRzKSB7XHJcbiAgICAvL2NhbnZhcy5wYXRocyA9IHBhdGhzO1xyXG4gICAgcHRzID0gSlNPTi5wYXJzZShwdHMpXHJcbiAgICBpZighcHRzKSByZXR1cm47XHJcbiAgICBDdGwuZHJhd1B0cyhjdHgsIHB0cyk7XHJcbn0pO1xyXG5zb2NrZXQub24oJ2NtZCcsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKEpTT04ucGFyc2UoZGF0YSkpO1xyXG59KTtcclxuLy8g5LiK5Zy655qE55So5oi3XHJcbnNvY2tldC5vbigncmVzZXQgaW4gdXNlcnMnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIC8qXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7bmFtZTogJycsIGluOnRydWV9XHJcbiAgICAgICAgXVxyXG4gICAgICovXHJcbiAgICB1c2Vycy5pbm5lckhUTUwgPSAnJztcclxuICAgIGRhdGEuZm9yRWFjaCh4PT57XHJcbiAgICAgICAgdXNlcnMuYXBwZW5kQ2hpbGQodXRpbHMubWFrZVVzZXJQKHgpKTtcclxuICAgIH0pO1xyXG59KVxyXG4vKipcclxuKiBbZXJhc2Ug5riF6Zmk5oyH5a6a5L2N572u5Y+K5aSn5bCP55qE55S75biDXVxyXG4qIEBwYXJhbSAge1tudW1iZXJdfSB4IFt45Z2Q5qCHXVxyXG4qIEBwYXJhbSAge1tudW1iZXJdfSB5IFt55Z2Q5qCHXVxyXG4qIEBwYXJhbSAge1tudW1iZXJdfSB3IFvlrr1dXHJcbiogQHBhcmFtICB7W251bWJlcl19IGggW+mrmF1cclxuKi9cclxuc29ja2V0Lm9uKCdlcmFzZScsZnVuY3Rpb24gKHgseSx3LGgpIHtcclxuICAgIG5ldyBSZWN0KHgseSx3LGgpLmNsZWFyT24oY3R4KTtcclxufSlcclxuLy8g5bm/5pKt6YCa55+l5pyJ55So5oi35LiK5Zy6XHJcbnNvY2tldC5vbignbmV3IGluIHVzZXInLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB1c2Vycy5hcHBlbmRDaGlsZCh1dGlscy5tYWtlVXNlclAoSlNPTi5wYXJzZShkYXRhKSkpO1xyXG59KTtcclxuc29ja2V0Lm9uKCdvdXQgdXNlcicsZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB2YXIgeCA9IHVzZXJzLnF1ZXJ5U2VsZWN0b3IoJyNwJytpZCk7XHJcbiAgICBpZih4KSB4Lm91dGVySFRNTD0nJztcclxufSlcclxuLy8g5LiK5Zy6XHJcbnNvY2tldC5vbignaW4nLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB1c2Vycy5hcHBlbmRDaGlsZCh1dGlscy5tYWtlVXNlclAoSlNPTi5wYXJzZShkYXRhKSkpO1xyXG4gICAgdXNlcnMuc2Nyb2xsVG9wID0gdXNlcnMuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgYnRuSW4uaW5BY3QoKTtcclxufSk7XHJcbi8vIOS4i+WculxyXG5zb2NrZXQub24oJ291dCcsZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB2YXIgeCA9IHVzZXJzLnF1ZXJ5U2VsZWN0b3IoJyNwJytpZCk7XHJcbiAgICBpZih4KXtcclxuICAgICAgICB4Lm91dGVySFRNTD0nJztcclxuICAgICAgICBidG5Jbi5vdXRBY3QoKTtcclxuICAgIH1cclxufSk7XHJcbi8vIOS/oeaBr+agj1xyXG5zb2NrZXQub24oJ215dGltZScsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpOy8vIG5hbWUsd29yZDosdGltZVxyXG4gICAgYnRuSW4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgaW5mby5wbGF5ZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lICsgJyjoh6rlt7EpJztcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSBkYXRhLnRpbWUgKydzJztcclxuICAgIGluZm8ud29yZC5pbm5lclRleHQgPSBkYXRhLndvcmQ7XHJcbiAgICBjYW52YXMuaXNNZSA9IHRydWU7XHJcbn0pO1xyXG4vLyDlub/mkq3kv6Hmga/moI9cclxuc29ja2V0Lm9uKCdvdGhlcnRpbWUnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTsvLyBuYW1lLHdvcmQ6LHRpbWVcclxuICAgIGluZm8ucGxheWVyLmlubmVyVGV4dCA9IGRhdGEubmFtZTtcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSBkYXRhLnRpbWUgKydzJztcclxuICAgIGNhbnZhcy5pc01lID0gZmFsc2U7XHJcbn0pO1xyXG4vLyDlub/mkq3lgJLorqHml7blj4rmm7TmlrDmj5DnpLrkv6Hmga9cclxuc29ja2V0Lm9uKCd1cGRhdGUgdGltZScsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgaW5mby5wbGF5ZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9IGRhdGEudGltZSArJ3MnO1xyXG4gICAgaW5mby53b3JkLmlubmVyVGV4dCA9IGRhdGEud29yZDtcclxufSk7XHJcbi8vIOWAkuiuoeaXtlxyXG5zb2NrZXQub24oJ3VwZGF0ZSBteSB0aW1lJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gZGF0YS50aW1lICsncyc7XHJcbn0pO1xyXG4vLyDml7bpl7TliLBcclxuc29ja2V0Lm9uKCdteXRpbWVvdXQnLGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdmFyIHQgPSB1c2Vycy5xdWVyeVNlbGVjdG9yKCcjcCcraWQpO1xyXG4gICAgaWYodCkgdC5vdXRlckhUTUw9Jyc7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gJ+aXtumXtOWIsOS6hu+8gSc7XHJcbiAgICBjYW52YXMuaXNNZSA9IGZhbHNlO1xyXG4gICAgYnRuSW4ub3V0QWN0KCk7XHJcbn0pO1xyXG4vLyDlub/mkq3ml7bpl7TliLDvvIzlhazluIPnrZTmoYhcclxuc29ja2V0Lm9uKCd0aW1lb3V0JyxmdW5jdGlvbiAoZCkge1xyXG4gICAgZCA9IEpTT04ucGFyc2UoZCk7XHJcbiAgICB2YXIgdCA9IHVzZXJzLnF1ZXJ5U2VsZWN0b3IoJyNwJytkLmlkKTtcclxuICAgIGlmKHQpIHQub3V0ZXJIVE1MPScnO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9ICfml7bpl7TliLDkuobvvIEnO1xyXG4gICAgaW5mby53b3JkLmlubmVyVGV4dCA9ICfmraPnoa7nrZTmoYjkuLrvvJonK2Qud29yZDtcclxufSk7XHJcbi8vIOa4heepuueUu+W4g1xyXG5zb2NrZXQub24oJ2NsZWFyIHBhaW50JyxmdW5jdGlvbiAoKSB7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsMCxjdHguY2FudmFzLndpZHRoLGN0eC5jYW52YXMuaGVpZ2h0KTtcclxufSk7XHJcbi8vIOaOkuihjOamnFxyXG5zb2NrZXQub24oJ3RvcHMnLGZ1bmN0aW9uIChkKSB7XHJcbiAgICBkID0gSlNPTi5wYXJzZShkKTtcclxuICAgIHRvcHMuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB2YXIgdGVtcCA9IHRvcHMudGVtcGxhdGU7XHJcbiAgICBkLmZvckVhY2goKHgsaSk9PntcclxuICAgICAgICB0ZW1wLmlkID0geC5pZDtcclxuICAgICAgICB0ZW1wLmNoaWxkcmVuWzBdLmZpcnN0RWxlbWVudENoaWxkLmlubmVyVGV4dCA9ICdObycrKGkrMSk7XHJcbiAgICAgICAgdGVtcC5jaGlsZHJlblsxXS5maXJzdEVsZW1lbnRDaGlsZC5pbm5lclRleHQgPSB4Lm5hbWU7XHJcbiAgICAgICAgdGVtcC5jaGlsZHJlblsyXS5maXJzdEVsZW1lbnRDaGlsZC5pbm5lclRleHQgPSB4LnYrJ+asoSc7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gdG9wcy50ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKTtcclxuICAgICAgICB0b3BzLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgfSk7XHJcbn0pXHJcbnV0aWxzID0ge1xyXG4gICAgLy8g5Yib5bu655So5oi35LiK5Zy65pi+56S655qE5qCH562+5Y+K55u45bqU54m55oCnXHJcbiAgICBtYWtlVXNlclAgOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpOyBwLmlkID0gJ3AnK3guaWQ7XHJcbiAgICAgICAgcC5pbm5lclRleHQgPSB4Lm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9