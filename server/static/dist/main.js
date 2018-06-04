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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

Ctl = _common_util_js__WEBPACK_IMPORTED_MODULE_0__["default"]
socket = io.connect();

// 监听窗口大小变化
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.paths = canvas.pts = [];
    socket.emit('repaint');
}
window.addEventListener('resize',resize);

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

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (Ctl);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3N0YXRpYy9tYWluLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9zdGF0aWMvY29tbW9uL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsNkJBQTZCO0FBQzdELHFCQUFxQixNQUFNO0FBQzNCO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0Isb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELHVDQUF1QztBQUNoRyxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2Qyx1Q0FBdUM7QUFDcEY7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0EsQ0FBQyxDOzs7Ozs7O0FDak5EO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFNBQVM7QUFDekIsZ0JBQWdCLGtCQUFrQjtBQUNsQyxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiaW1wb3J0IHV0aWwgZnJvbSAnLi9jb21tb24vdXRpbC5qcydcbkN0bCA9IHV0aWxcbnNvY2tldCA9IGlvLmNvbm5lY3QoKTtcblxuLy8g55uR5ZCs56qX5Y+j5aSn5bCP5Y+Y5YyWXG5mdW5jdGlvbiByZXNpemUoKSB7XG4gICAgY2FudmFzLndpZHRoID0gY2FudmFzLnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgY2FudmFzLnBhdGhzID0gY2FudmFzLnB0cyA9IFtdO1xuICAgIHNvY2tldC5lbWl0KCdyZXBhaW50Jyk7XG59XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyxyZXNpemUpO1xuXG52bSA9IG5ldyBWdWUoe1xuICAgIGVsOiAnI3BhaW50R2FtZScsXG4gICAgZGF0YToge1xuICAgICAgICAvLyDmtojmga/moYZcbiAgICAgICAgbXNnOiAnJyxcbiAgICAgICAgLy8g5b2T5YmN6YCJ5Lit55qE57uY5Yi25bel5YW377yMMD3msqHpgInvvIwxPeeUu+eslO+8jDI95qmh55qu5pOmXG4gICAgICAgIHBhaW50VG9vbHNTZWxlY3RlZDogMCxcbiAgICAgICAgLy8g5piv5ZCm6Ieq5Yqo5LiK5Zy6XG4gICAgICAgIGlzQXV0b2luOiBmYWxzZSxcbiAgICAgICAgLy8g6YCJ5Lit55qE6aKc6Imy5LiL5qCH77yMLTE95rKh6YCJ77yM55So6buY6K6k55qE6buR6ImyXG4gICAgICAgIHNlbGVjdGVkQ29sb3JJbmRleDogLTEsXG4gICAgICAgIC8vIOeUu+eslOeahOWuveW6plxuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGNvbG9yQXJyOiBbXVxuICAgIH0sXG4gICAgbW91bnRlZCAoKSB7XG4gICAgXHRsZXQgX3RoaXMgPSB0aGlzXG4gICAgICAgIF90aGlzLmluaXQoKTtcblxuICAgICAgICAvLyDliJ3lp4vljJbpopzoibLmlbDmja5cbiAgICAgICAgLy8gUFM65ZyoaHRtbOS4reebtOaOpeeUqDpzdHlsZT1cInsgYmFja2dyb3VuZENvbG9yOiBhZGRDb2xvcigpfVwi55Sf5oiQ5qC35byP5pyJYnVn77yM6YCJ5oup6aKc6Imy5oiW6ICF5pS55Y+Y5a695bqm5pe25Lya6Ieq5Yqo6Kem5Y+RYWRkQ29sb3IoKVxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MjA7IGkrKykge1xuICAgICAgICAgICAgY29sb3JBcnIucHVzaCh0aGlzLmFkZENvbG9yKCkpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2xvckFyciA9IGNvbG9yQXJyXG5cblxuICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF07XG4gICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBidG5JbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4taW4nKTtcblxuICAgICAgICAvLyDliJ3lp4vljJblt7LkuIrlnLrnirbmgIFcbiAgICAgICAgYnRuSW4uaW5BY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlubmVyVGV4dD0n5LiL5Zy6JztcbiAgICAgICAgICAgIHRoaXMuaW49dHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g5Yid5aeL5YyW5b6F5LiK5Zy654q25oCBXG4gICAgICAgIGJ0bkluLm91dEFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5uZXJUZXh0PSfkuIrlnLrvvIEnO1xuICAgICAgICAgICAgdGhpcy5pbj1mYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXNpemUoKTtcblxuICAgICAgICBtc2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXNnJyk7XG4gICAgXHRidG5BdXRvaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLWF1dG9pbicpO1xuICAgICAgICBpbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm8nKTtcbiAgICAgICAgdXNlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LXVzZXJzJyk7XG5cbiAgICAgICAgdG9wcy50ZW1wbGF0ZSA9IHRvcHMucXVlcnlTZWxlY3RvcignW3JvbGU9dGVtcGxhdGVdJykuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgIGluZm8udGltZSA9IGluZm8ucXVlcnlTZWxlY3RvcignI3RpbWUnKVxuICAgICAgICBpbmZvLnBsYXllciA9IGluZm8ucXVlcnlTZWxlY3RvcignI3BsYXllcicpXG4gICAgICAgIGluZm8ud29yZCA9IGluZm8ucXVlcnlTZWxlY3RvcignI3dvcmQnKVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICAvLyDliJ3lp4vljJZjYW52YXPnirbmgIFcbiAgICAgICAgaW5pdCAoKSB7XG4gICAgICAgICAgICBjYW52YXMucGF0aHM9W107XG4gICAgICAgICAgICBjYW52YXMucHRzPVtdO1xuICAgICAgICAgICAgY2FudmFzLmNvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGNhbnZhcy5sdyA9IHRoaXMubGluZVdpZHRoO1xuICAgICAgICB9LFxuICAgICAgICAvLyDmjInlm57ovablj5HpgIHmtojmga9cbiAgICAgICAgc2VuZE1lc3NhZ2UgKCkge1xuICAgICAgICBcdFxuICAgICAgICAgICAgbGV0IF90aGlzID0gdGhpc1xuICAgICAgICAgICAgaWYoX3RoaXMubXNnICE9PSAnJyl7XG4gICAgICAgICAgICAgICAgaWYoY2FudmFzLmlzTWUpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn57uY5Zu+6ICF5LiN6IO95aSf5Y+R6YCB5raI5oGv77yBJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2NsaWVudCBtc2cnLF90aGlzLm1zZyk7XG4gICAgICAgICAgICAgICAgX3RoaXMubXNnID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbY2hvb3NlUGFpbnRUb29scyDpgInmi6nnu5jliLblt6XlhbddXG4gICAgICAgICAqIEBwYXJhbSAge1tzdHJpbmddfSB0eXBlIFvlj6/og73nmoTlgLzvvJpicnVzaD3nlLvnrJTvvIxlcmFzZXI95qmh55qu5pOmXVxuICAgICAgICAgKi9cbiAgICAgICAgY2hvb3NlUGFpbnRUb29scyAodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdicnVzaCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaW50VG9vbHNTZWxlY3RlZCA9IDFcbiAgICAgICAgICAgICAgICBkZWxldGUgY2FudmFzLmVyYXNlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdlcmFzZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWludFRvb2xzU2VsZWN0ZWQgPSAyXG4gICAgICAgICAgICAgICAgY2FudmFzLmVyYXNlPXRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbY2hvb3NlQ29sb3Ig6YCJ5oup55S756yU6aKc6ImyXVxuICAgICAgICAgKiBAcGFyYW0gIHtbbnVtYmVyXX0gaW5kZXggW+minOiJsuaVsOe7hOeahOS4i+agh11cbiAgICAgICAgICovXG4gICAgICAgIGNob29zZUNvbG9yIChpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENvbG9ySW5kZXggPSBpbmRleFxuICAgICAgICAgICAgQ3RsLnNldENvbG9yKGNvbG9yQXJyW2luZGV4XSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOmAieaLqeeUu+eslOWuveW6piBcbiAgICAgICAgY2hhbmdlTGluZVdpZHRoICgpIHtcbiAgICAgICAgXHRDdGwuc2V0THcodGhpcy5saW5lV2lkdGgpO1xuICAgICAgICB9LFxuICAgICAgICAvLyDkuIrlnLpcbiAgICAgICAgZ2V0SW4gKCkge1xuICAgICAgICAgICAgdmFyIHQgPSBidG5Jbi5pbjtcbiAgICAgICAgICAgIGlmKGJ0bkluLnQpIGNsZWFyVGltZW91dChidG5Jbi50KTtcbiAgICAgICAgICAgIC8vIOiHquWKqOS4iuS4i+WculxuICAgICAgICAgICAgYnRuSW4udCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCF0Pydpbic6J291dCcpO1xuICAgICAgICAgICAgfSw0MDApO1xuICAgICAgICB9LFxuICAgICAgICAvLyDoh6rliqjkuIrlnLpcbiAgICAgICAgYXV0b2luICgpIHtcbiAgICAgICAgICAgIHZhciBidG5pbiA9IGJ0bkluO1xuICAgICAgICAgICAgaWYoYnRuaW4uYXV0b0luID09IG51bGwpe1xuICAgICAgICAgICAgICAgIGlmKCFidG5pbi5pbikgc29ja2V0LmVtaXQoJ2luJyk7XG4gICAgICAgICAgICAgICAgLy8gNeWwkei9ruW+qu+8jOajgOafpeiHquWKqOS4iuWculxuICAgICAgICAgICAgICAgIGJ0bmluLmF1dG9JbiA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiK5Zy65ZCO77yMaXNNZT10cnVl77yMYnRuaW4uaW49dHJ1ZVxuICAgICAgICAgICAgICAgICAgICBpZihjYW52YXMuaXNNZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBpZighYnRuaW4uaW4pIHNvY2tldC5lbWl0KCdpbicpO1xuICAgICAgICAgICAgICAgIH0sNTAwMCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGJ0bmluLmF1dG9Jbik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGJ0bmluLmF1dG9JbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRvZ2dsZeWFs+S6jm9u55qEY2xhc3NcbiAgICAgICAgICAgIHRoaXMuaXNBdXRvaW4gPSAhdGhpcy5pc0F1dG9pblxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogW3JhbmRvbSDnlJ/miJDpmo/mnLrmlbDvvIzkuLvopoHnlKjkuo7pmo/mnLrnlJ/miJDpopzoibJdXG4gICAgICAgICAqIEBwYXJhbSAge1tudW1iZXJdfSBiIFvmnIDlpKfnmoTmlbDlh48xXVxuICAgICAgICAgKiBAcmV0dXJuIHtbbnVtYmVyXX0gICBbMH5iLTHnmoTmlbBdXG4gICAgICAgICAqL1xuICAgICAgICByYW5kb20gKGIpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYilcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6L+U5Zue6ZqP5py655qE6aKc6ImyXG4gICAgICAgIGFkZENvbG9yICgpIHtcbiAgICAgICAgICAgIGxldCByID0gdGhpcy5yYW5kb21cbiAgICAgICAgICAgIGxldCBjb2xvciA9ICdyZ2IoJytbcigyNTYpLHIoMjU2KSxyKDI1NildLmpvaW4oJywnKSsnKSdcbiAgICAgICAgICAgIGNvbG9yQXJyLnB1c2goY29sb3IpXG4gICAgICAgICAgICByZXR1cm4gY29sb3JcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5byA5aeL57uY5Yi2XG4gICAgICAgIGNhbnZhc01vdXNlZG93biAoZSkge1xuICAgICAgICBcdGlmKCFjYW52YXMuaXNNZSkgcmV0dXJuO1xuICAgICAgICBcdGlmKGNhbnZhcy5lcmFzZSl7XG4gICAgICAgIFx0ICAgIHZhciB3PTIwLGg9MjA7XG4gICAgICAgIFx0ICAgIC8vIHc+Pj4x55u45b2T5LqOTWF0aC5jZWlsKHcvMinvvIzooajnpLrlkJHkuIrlj5bmlbRcbiAgICAgICAgXHQgICAgdmFyIHJlY3QgPSBuZXcgUmVjdCh4LSh3Pj4+MSkseS0oaD4+PjEpLHcsaCk7XG4gICAgICAgIFx0ICAgIHJlY3QuY2xlYXJPbihjdHgpO1xuICAgICAgICBcdCAgICBzb2NrZXQuZW1pdCgnZXJhc2UnLHJlY3QueCxyZWN0LnkscmVjdC53LHJlY3QuaCk7XG4gICAgICAgIFx0ICAgIHJldHVybjtcbiAgICAgICAgXHR9XG4gICAgICAgIFx0dmFyIHggPSBlLm9mZnNldFgseSA9IGUub2Zmc2V0WTtcbiAgICAgICAgXHRDdGwuY2xlYXJQb3MoKTtcbiAgICAgICAgXHRDdGwuYWRkUG9zKHgseSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOe7mOWItuS4rVxuICAgICAgICBjYW52YXNNb3VzZW1vdmUgKGUpIHtcbiAgICAgICAgXHR2YXIgdz0yMCxoPTIwO1xuICAgICAgICBcdGlmKGNhbnZhcy5pc01lKXtcbiAgICAgICAgXHQgICAgdmFyIHggPSBlLm9mZnNldFgsIHkgPSBlLm9mZnNldFk7XG4gICAgICAgIFx0ICAgIC8vIGUuYnV0dG9ucyA9PT0gMe+8jOihqOekuum8oOagh+W3pumUruaMieS4i+aXtuW5tuWIkuWKqFxuICAgICAgICBcdCAgICBpZihlLmJ1dHRvbnMgPT09IDEpIHtcbiAgICAgICAgXHQgICAgICAgIGlmKCFjYW52YXMuZXJhc2Upe1xuICAgICAgICBcdCAgICAgICAgICAgIEN0bC5hZGRQb3MoeCx5KTtcbiAgICAgICAgXHQgICAgICAgICAgICBDdGwuZHJhd1B0cyhjdHgsIGNhbnZhcy5wdHMpO1xuICAgICAgICBcdCAgICAgICAgICAgIHNvY2tldC5lbWl0KCdwYWludCcsSlNPTi5zdHJpbmdpZnkoe2RhdGE6bmV3IFBhdGgoY2FudmFzLnB0cyksc3RhdHVzOidpbmcnfSkpXG4gICAgICAgIFx0ICAgICAgICB9ZWxzZXtcbiAgICAgICAgXHQgICAgICAgICAgICB2YXIgcmVjdCA9IG5ldyBSZWN0KHgtKHc+Pj4xKSx5LShoPj4+MSksdyxoKTtcbiAgICAgICAgXHQgICAgICAgICAgICByZWN0LmNsZWFyT24oY3R4KTtcbiAgICAgICAgXHQgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZXJhc2UnLHJlY3QueCxyZWN0LnkscmVjdC53LHJlY3QuaCk7XG4gICAgICAgIFx0ICAgICAgICB9XG4gICAgICAgIFx0ICAgIH1cbiAgICAgICAgXHR9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOe7mOWItue7k+adn1xuICAgICAgICBjYW52YXNNb3VzZXVwIChlKSB7XG4gICAgICAgIFx0aWYoIWNhbnZhcy5pc01lIHx8IGNhbnZhcy5lcmFzZSkgcmV0dXJuO1xuICAgICAgICBcdHZhciB4ID0gZS5vZmZzZXRYLHkgPSBlLm9mZnNldFk7XG4gICAgICAgIFx0Q3RsLmFkZFBvcyh4LHkpO1xuICAgICAgICBcdEN0bC5hZGRQYXRoKGNhbnZhcy5wdHMpO1xuICAgICAgICBcdHNvY2tldC5lbWl0KCdwYWludCcsSlNPTi5zdHJpbmdpZnkoe2RhdGE6bmV3IFBhdGgoY2FudmFzLnB0cyksc3RhdHVzOidlbmQnfSkpO1xuICAgICAgICBcdEN0bC5jbGVhclBvcygpO1xuICAgICAgICB9LFxuICAgICAgICAvLyDmtojmga/moYZcbiAgICAgICAgc2VydmVyTXNnIChkYXRhKSB7XG4gICAgICAgIFx0dmFyIGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgXHRlbGUuaW5uZXJIVE1MID0gZGF0YTtcbiAgICAgICAgXHRtc2cuYXBwZW5kQ2hpbGQoZWxlKTtcbiAgICAgICAgXHRtc2cuc2Nyb2xsVG9wID0gbXNnLnNjcm9sbEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBjb21wdXRlZDoge31cbn0pIiwiLyoqXHJcbiAqIFtDdGwgQ29udHJvbGxlcl1cclxuICpcclxuICogcHRzPXBvaW50c++8jOacieWvueW6lOeahHjjgIF55bGe5oCnXHJcbiAqXHJcbiAqIGNhbnZhc+ebuOWFs++8mlxyXG4gKiBjdHguc2F2ZSgpID09PiDkv53lrZjlvZPliY3njq/looPnmoTnirbmgIHvvIxzYXZl5LmL5ZCO77yM5Y+v5Lul6LCD55SoQ2FudmFz55qE5bmz56e744CB5pS+57yp44CB5peL6L2s44CB6ZSZ5YiH44CB6KOB5Ymq562J5pON5L2cXHJcbiAqIGN0eC5iZWdpblBhdGgoKSA9PT4g6LW35aeL5LiA5p2h6Lev5b6E77yM5oiW6YeN572u5b2T5YmN6Lev5b6EXHJcbiAqIGN0eC5tb3ZlVG8oKSA9PT4g5oqK6Lev5b6E56e75Yqo5Yiw55S75biD5Lit55qE5oyH5a6a54K577yM5LiN5Yib5bu657q/5p2hXHJcbiAqIGN0eC5saW5lVG8oKSA9PT4g5re75Yqg5LiA5Liq5paw54K577yM54S25ZCO5Zyo55S75biD5Lit5Yib5bu65LuO6K+l54K55Yiw5pyA5ZCO5oyH5a6a54K555qE57q/5p2hXHJcbiAqIGN0eC5saW5lV2lkdGggPT0+IOiuvue9ruW9k+WJjeeahOe6v+adoeWuveW6plxyXG4gKiBjdHguc3Ryb2tlU3R5bGUgPT0+IOiuvue9rueUqOS6jueslOinpueahOminOiJsuOAgea4kOWPmOaIluaooeW8j1xyXG4gKiBjdHguc3Ryb2tlKCkgPT0+IOe7mOWItuW3suWumuS5ieeahOi3r+W+hFxyXG4gKiBjdHgucmVzdG9yZSgpID09PiDov5Tlm57kuYvliY3kv53lrZjov4fnmoTot6/lvoTnirbmgIHlkozlsZ7mgKdcclxuICovXHJcbnZhciBDdGwgPSB7XHJcbiAgICAvKipcclxuICAgICAqIFtkcmF3UHRzIOe7mOWItui3r+W+hF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBjdHggWzJk5LiK5LiL5paHXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdCBvciBhcnJheV19IHB0cyBb5Z2Q5qCH54K56ZuG5ZCI77yM5oiW6ICF5YyF5ous5Z2Q5qCH54K56ZuG5ZCI5Y+K5YW25LuW57uY5Yi25bGe5oCn55qE5a+56LGhXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICBbY3R4LnJlc3RvcmUoKV1cclxuICAgICAqL1xyXG4gICAgZHJhd1B0czogZnVuY3Rpb24gKGN0eCxwdHMpIHtcclxuICAgICAgICBpZihwdHMgaW5zdGFuY2VvZiBQYXRoIHx8IHB0cy5wdHMpe1xyXG4gICAgICAgICAgICB2YXIgY29sb3IgPSBwdHMuY29sb3IsbHcgPSBwdHMubHc7XHJcbiAgICAgICAgICAgIHB0cyA9IHB0cy5wdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwMSA9IHB0c1swXTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHAxLngsIHAxLnkpO1xyXG4gICAgICAgIHB0cy5zbGljZSgxKS5mb3JFYWNoKHY9PntcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh2Lngsdi55KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gbHcgfHwgY2FudmFzLmx3XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3IgfHwgY2FudmFzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfSxcclxuICAgIC8vIOiuvue9rueUu+eslOWuveW6plxyXG4gICAgc2V0THcobHcpe1xyXG4gICAgICAgIGNhbnZhcy5sdyA9IGx3O1xyXG4gICAgfSxcclxuICAgIC8vIOiuvue9rueUu+eslOminOiJslxyXG4gICAgc2V0Q29sb3IoYyl7XHJcbiAgICAgICAgY2FudmFzLmNvbG9yID0gYztcclxuICAgIH0sXHJcbiAgICAvLyDmiorot6/lvoTmt7vliqDliLBjYW52YXMucGF0aHPkuK1cclxuICAgIGFkZFBhdGggOiBmdW5jdGlvbiAocHRzKSB7XHJcbiAgICAgICAgY2FudmFzLnBhdGhzLnB1c2gobmV3IFBhdGgocHRzLGNhbnZhcy5sdyxjYW52YXMuY29sb3IpKTtcclxuICAgIH0sXHJcbiAgICAvLyDmt7vliqDmraPlnKjnu5jliLbov4fnqIvkuK3nmoTmiYDmnInngrlcclxuICAgIGFkZFBvcyA6IGZ1bmN0aW9uICh4LHkpIHtcclxuICAgICAgICAvLyBjYW52YXMucHRzLnjvvIxjYW52YXMucHRzLnnov5Tlm57ov5nnp43nu5PmnpxcclxuICAgICAgICBjYW52YXMucHRzLnB1c2gobmV3IFBvcyh4LHkpKTtcclxuICAgIH0sXHJcbiAgICAvLyDmuIXpmaTnu5jliLbnmoTmiYDmnInngrlcclxuICAgIGNsZWFyUG9zIDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNhbnZhcy5wdHMgPSBbXVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ3RsIl0sInNvdXJjZVJvb3QiOiIifQ==