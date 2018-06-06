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
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ({

/***/ 52:
/***/ (function(module, exports) {

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
var utils = {
    // 创建用户上场显示的标签及相应特性
    makeUserP : function (x) {
        var p = document.createElement('p'); p.id = 'p'+x.id;
        p.innerText = x.name;
        return p;
    }
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3N0YXRpYy9jb21tb24vc29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1Mik7XG4iLCIvLyDmmL7npLrmtojmga9cclxuc29ja2V0Lm9uKCdzZXJ2ZXIgbXNnJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdm0uc2VydmVyTXNnKGRhdGEpXHJcbn0pXHJcbi8vIOWFpeWPo++8jOWIneWni+WMlueKtuaAgVxyXG5zb2NrZXQub24oJ2xvZ2luJyxmdW5jdGlvbiAoKSB7XHJcbiAgICBpZighcHJvbXB0KVxyXG4gICAgLy8gaWYocHJvbXB0KVxyXG4gICAgICAgIHNvY2tldC5lbWl0KCdsb2dpbicscHJvbXB0KCfovpPlhaXkvaDnmoTlp5PlkI0nKSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgc29ja2V0LmVtaXQoJ2xvZ2luJywn5omL5py655So5oi3Jyk7XHJcbiAgICBidG5Jbi5vdXRBY3QoKTtcclxuICAgIGNhbnZhcy5pc01lID0gZmFsc2U7XHJcbiAgICBidG5BdXRvaW4uZGlzYWxiZWQgPSBmYWxzZTtcclxufSk7XHJcbi8vIOagueaNrlJBTeS4reeahHBhdGhz5Y+Y6YeP77yM6Iul5a2Y5ZyodGFnPT09J3B0cyfmoIfor4bvvIzliJnnu5jliLbvvIzlkKbliJnmuIXpmaRcclxuc29ja2V0Lm9uKCdwYWludCBwYXRocycsZnVuY3Rpb24gKHBhdGhzKSB7XHJcbiAgICBwYXRocyA9IEpTT04ucGFyc2UocGF0aHMpO1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgZm9yKHZhciBrIGluIHBhdGhzKSB7XHJcbiAgICAgICAgaWYocGF0aHNba10udGFnPT09J3B0cycpXHJcbiAgICAgICAgICAgIEN0bC5kcmF3UHRzKGN0eCwgcGF0aHNba10pO1xyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIG5ldyBSZWN0KHBhdGhzW2tdLngscGF0aHNba10ueSxwYXRoc1trXS53LHBhdGhzW2tdLmgpLmNsZWFyT24oY3R4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4vLyDmoLnmja7ot6/lvoTlj4LmlbDov5vooYznu5jliLZcclxuc29ja2V0Lm9uKCdwYWludCBwdHMnLGZ1bmN0aW9uIChwdHMpIHtcclxuICAgIC8vY2FudmFzLnBhdGhzID0gcGF0aHM7XHJcbiAgICBwdHMgPSBKU09OLnBhcnNlKHB0cylcclxuICAgIGlmKCFwdHMpIHJldHVybjtcclxuICAgIEN0bC5kcmF3UHRzKGN0eCwgcHRzKTtcclxufSk7XHJcbnNvY2tldC5vbignY21kJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coSlNPTi5wYXJzZShkYXRhKSk7XHJcbn0pO1xyXG4vLyDkuIrlnLrnmoTnlKjmiLdcclxuc29ja2V0Lm9uKCdyZXNldCBpbiB1c2VycycsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgLypcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHtuYW1lOiAnJywgaW46dHJ1ZX1cclxuICAgICAgICBdXHJcbiAgICAgKi9cclxuICAgIHVzZXJzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgZGF0YS5mb3JFYWNoKHg9PntcclxuICAgICAgICB1c2Vycy5hcHBlbmRDaGlsZCh1dGlscy5tYWtlVXNlclAoeCkpO1xyXG4gICAgfSk7XHJcbn0pXHJcbi8vIOaTpumZpFxyXG5zb2NrZXQub24oJ2VyYXNlJyxmdW5jdGlvbiAoeCx5LHcsaCkge1xyXG4gICAgbmV3IFJlY3QoeCx5LHcsaCkuY2xlYXJPbihjdHgpO1xyXG59KVxyXG4vLyDlub/mkq3pgJrnn6XmnInnlKjmiLfkuIrlnLpcclxuc29ja2V0Lm9uKCduZXcgaW4gdXNlcicsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHVzZXJzLmFwcGVuZENoaWxkKHV0aWxzLm1ha2VVc2VyUChKU09OLnBhcnNlKGRhdGEpKSk7XHJcbn0pO1xyXG5zb2NrZXQub24oJ291dCB1c2VyJyxmdW5jdGlvbiAoaWQpIHtcclxuICAgIHZhciB4ID0gdXNlcnMucXVlcnlTZWxlY3RvcignI3AnK2lkKTtcclxuICAgIGlmKHgpIHgub3V0ZXJIVE1MPScnO1xyXG59KVxyXG4vLyDkuIrlnLpcclxuc29ja2V0Lm9uKCdpbicsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHVzZXJzLmFwcGVuZENoaWxkKHV0aWxzLm1ha2VVc2VyUChKU09OLnBhcnNlKGRhdGEpKSk7XHJcbiAgICB1c2Vycy5zY3JvbGxUb3AgPSB1c2Vycy5zY3JvbGxIZWlnaHQ7XHJcbiAgICBidG5Jbi5pbkFjdCgpO1xyXG59KTtcclxuLy8g5LiL5Zy6XHJcbnNvY2tldC5vbignb3V0JyxmdW5jdGlvbiAoaWQpIHtcclxuICAgIHZhciB4ID0gdXNlcnMucXVlcnlTZWxlY3RvcignI3AnK2lkKTtcclxuICAgIGlmKHgpe1xyXG4gICAgICAgIHgub3V0ZXJIVE1MPScnO1xyXG4gICAgICAgIGJ0bkluLm91dEFjdCgpO1xyXG4gICAgfVxyXG59KTtcclxuLy8g5L+h5oGv5qCPXHJcbnNvY2tldC5vbignbXl0aW1lJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7Ly8gbmFtZSx3b3JkOix0aW1lXHJcbiAgICBidG5Jbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBpbmZvLnBsYXllci5pbm5lclRleHQgPSBkYXRhLm5hbWUgKyAnKOiHquW3sSknO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9IGRhdGEudGltZSArJ3MnO1xyXG4gICAgaW5mby53b3JkLmlubmVyVGV4dCA9IGRhdGEud29yZDtcclxuICAgIGNhbnZhcy5pc01lID0gdHJ1ZTtcclxufSk7XHJcbi8vIOW5v+aSreS/oeaBr+agj1xyXG5zb2NrZXQub24oJ290aGVydGltZScsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpOy8vIG5hbWUsd29yZDosdGltZVxyXG4gICAgaW5mby5wbGF5ZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9IGRhdGEudGltZSArJ3MnO1xyXG4gICAgY2FudmFzLmlzTWUgPSBmYWxzZTtcclxufSk7XHJcbi8vIOW5v+aSreWAkuiuoeaXtuWPiuabtOaWsOaPkOekuuS/oeaBr1xyXG5zb2NrZXQub24oJ3VwZGF0ZSB0aW1lJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICBpbmZvLnBsYXllci5pbm5lclRleHQgPSBkYXRhLm5hbWU7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gZGF0YS50aW1lICsncyc7XHJcbiAgICBpbmZvLndvcmQuaW5uZXJUZXh0ID0gZGF0YS53b3JkO1xyXG59KTtcclxuLy8g5YCS6K6h5pe2XHJcbnNvY2tldC5vbigndXBkYXRlIG15IHRpbWUnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSBkYXRhLnRpbWUgKydzJztcclxufSk7XHJcbi8vIOaXtumXtOWIsFxyXG5zb2NrZXQub24oJ215dGltZW91dCcsZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB2YXIgdCA9IHVzZXJzLnF1ZXJ5U2VsZWN0b3IoJyNwJytpZCk7XHJcbiAgICBpZih0KSB0Lm91dGVySFRNTD0nJztcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSAn5pe26Ze05Yiw5LqG77yBJztcclxuICAgIGNhbnZhcy5pc01lID0gZmFsc2U7XHJcbiAgICBidG5Jbi5vdXRBY3QoKTtcclxufSk7XHJcbi8vIOW5v+aSreaXtumXtOWIsO+8jOWFrOW4g+etlOahiFxyXG5zb2NrZXQub24oJ3RpbWVvdXQnLGZ1bmN0aW9uIChkKSB7XHJcbiAgICBkID0gSlNPTi5wYXJzZShkKTtcclxuICAgIHZhciB0ID0gdXNlcnMucXVlcnlTZWxlY3RvcignI3AnK2QuaWQpO1xyXG4gICAgaWYodCkgdC5vdXRlckhUTUw9Jyc7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gJ+aXtumXtOWIsOS6hu+8gSc7XHJcbiAgICBpbmZvLndvcmQuaW5uZXJUZXh0ID0gJ+ato+ehruetlOahiOS4uu+8micrZC53b3JkO1xyXG59KTtcclxuLy8g5riF56m655S75biDXHJcbnNvY2tldC5vbignY2xlYXIgcGFpbnQnLGZ1bmN0aW9uICgpIHtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwwLGN0eC5jYW52YXMud2lkdGgsY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG59KTtcclxuLy8g5o6S6KGM5qacXHJcbnNvY2tldC5vbigndG9wcycsZnVuY3Rpb24gKGQpIHtcclxuICAgIGQgPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgdG9wcy5pbm5lckhUTUwgPSAnJztcclxuICAgIHZhciB0ZW1wID0gdG9wcy50ZW1wbGF0ZTtcclxuICAgIGQuZm9yRWFjaCgoeCxpKT0+e1xyXG4gICAgICAgIHRlbXAuaWQgPSB4LmlkO1xyXG4gICAgICAgIHRlbXAuY2hpbGRyZW5bMF0uZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJUZXh0ID0gJ05vJysoaSsxKTtcclxuICAgICAgICB0ZW1wLmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmlubmVyVGV4dCA9IHgubmFtZTtcclxuICAgICAgICB0ZW1wLmNoaWxkcmVuWzJdLmZpcnN0RWxlbWVudENoaWxkLmlubmVyVGV4dCA9IHgudisn5qyhJztcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSB0b3BzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpO1xyXG4gICAgICAgIHRvcHMuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9KTtcclxufSlcclxudmFyIHV0aWxzID0ge1xyXG4gICAgLy8g5Yib5bu655So5oi35LiK5Zy65pi+56S655qE5qCH562+5Y+K55u45bqU54m55oCnXHJcbiAgICBtYWtlVXNlclAgOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpOyBwLmlkID0gJ3AnK3guaWQ7XHJcbiAgICAgICAgcC5pbm5lclRleHQgPSB4Lm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9