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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL3N0YXRpYy9jb21tb24vc29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcbiIsIi8vIOaYvuekuua2iOaBr1xyXG5zb2NrZXQub24oJ3NlcnZlciBtc2cnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB2bS5zZXJ2ZXJNc2coZGF0YSlcclxufSlcclxuLy8g5YWl5Y+j77yM5Yid5aeL5YyW54q25oCBXHJcbnNvY2tldC5vbignbG9naW4nLGZ1bmN0aW9uICgpIHtcclxuICAgIGlmKCFwcm9tcHQpXHJcbiAgICAvLyBpZihwcm9tcHQpXHJcbiAgICAgICAgc29ja2V0LmVtaXQoJ2xvZ2luJyxwcm9tcHQoJ+i+k+WFpeS9oOeahOWnk+WQjScpKTtcclxuICAgIGVsc2VcclxuICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCfmiYvmnLrnlKjmiLcnKTtcclxuICAgIGJ0bkluLm91dEFjdCgpO1xyXG4gICAgY2FudmFzLmlzTWUgPSBmYWxzZTtcclxuICAgIGJ0bkF1dG9pbi5kaXNhbGJlZCA9IGZhbHNlO1xyXG59KTtcclxuLy8g5qC55o2uUkFN5Lit55qEcGF0aHPlj5jph4/vvIzoi6XlrZjlnKh0YWc9PT0ncHRzJ+agh+ivhu+8jOWImee7mOWItu+8jOWQpuWImea4hemZpFxyXG5zb2NrZXQub24oJ3BhaW50IHBhdGhzJyxmdW5jdGlvbiAocGF0aHMpIHtcclxuICAgIHBhdGhzID0gSlNPTi5wYXJzZShwYXRocyk7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XHJcbiAgICBmb3IodmFyIGsgaW4gcGF0aHMpIHtcclxuICAgICAgICBpZihwYXRoc1trXS50YWc9PT0ncHRzJylcclxuICAgICAgICAgICAgQ3RsLmRyYXdQdHMoY3R4LCBwYXRoc1trXSk7XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgbmV3IFJlY3QocGF0aHNba10ueCxwYXRoc1trXS55LHBhdGhzW2tdLncscGF0aHNba10uaCkuY2xlYXJPbihjdHgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbi8vIOagueaNrui3r+W+hOWPguaVsOi/m+ihjOe7mOWItlxyXG5zb2NrZXQub24oJ3BhaW50IHB0cycsZnVuY3Rpb24gKHB0cykge1xyXG4gICAgLy9jYW52YXMucGF0aHMgPSBwYXRocztcclxuICAgIHB0cyA9IEpTT04ucGFyc2UocHRzKVxyXG4gICAgaWYoIXB0cykgcmV0dXJuO1xyXG4gICAgQ3RsLmRyYXdQdHMoY3R4LCBwdHMpO1xyXG59KTtcclxuc29ja2V0Lm9uKCdjbWQnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnBhcnNlKGRhdGEpKTtcclxufSk7XHJcbi8vIOS4iuWcuueahOeUqOaIt1xyXG5zb2NrZXQub24oJ3Jlc2V0IGluIHVzZXJzJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAvKlxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAge25hbWU6ICcnLCBpbjp0cnVlfVxyXG4gICAgICAgIF1cclxuICAgICAqL1xyXG4gICAgdXNlcnMuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBkYXRhLmZvckVhY2goeD0+e1xyXG4gICAgICAgIHVzZXJzLmFwcGVuZENoaWxkKHV0aWxzLm1ha2VVc2VyUCh4KSk7XHJcbiAgICB9KTtcclxufSlcclxuLy8g5pOm6ZmkXHJcbnNvY2tldC5vbignZXJhc2UnLGZ1bmN0aW9uICh4LHksdyxoKSB7XHJcbiAgICBuZXcgUmVjdCh4LHksdyxoKS5jbGVhck9uKGN0eCk7XHJcbn0pXHJcbi8vIOW5v+aSremAmuefpeacieeUqOaIt+S4iuWculxyXG5zb2NrZXQub24oJ25ldyBpbiB1c2VyJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdXNlcnMuYXBwZW5kQ2hpbGQodXRpbHMubWFrZVVzZXJQKEpTT04ucGFyc2UoZGF0YSkpKTtcclxufSk7XHJcbnNvY2tldC5vbignb3V0IHVzZXInLGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdmFyIHggPSB1c2Vycy5xdWVyeVNlbGVjdG9yKCcjcCcraWQpO1xyXG4gICAgaWYoeCkgeC5vdXRlckhUTUw9Jyc7XHJcbn0pXHJcbi8vIOS4iuWculxyXG5zb2NrZXQub24oJ2luJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdXNlcnMuYXBwZW5kQ2hpbGQodXRpbHMubWFrZVVzZXJQKEpTT04ucGFyc2UoZGF0YSkpKTtcclxuICAgIHVzZXJzLnNjcm9sbFRvcCA9IHVzZXJzLnNjcm9sbEhlaWdodDtcclxuICAgIGJ0bkluLmluQWN0KCk7XHJcbn0pO1xyXG4vLyDkuIvlnLpcclxuc29ja2V0Lm9uKCdvdXQnLGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdmFyIHggPSB1c2Vycy5xdWVyeVNlbGVjdG9yKCcjcCcraWQpO1xyXG4gICAgaWYoeCl7XHJcbiAgICAgICAgeC5vdXRlckhUTUw9Jyc7XHJcbiAgICAgICAgYnRuSW4ub3V0QWN0KCk7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyDkv6Hmga/moI9cclxuc29ja2V0Lm9uKCdteXRpbWUnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTsvLyBuYW1lLHdvcmQ6LHRpbWVcclxuICAgIGJ0bkluLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGluZm8ucGxheWVyLmlubmVyVGV4dCA9IGRhdGEubmFtZSArICco6Ieq5bexKSc7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gZGF0YS50aW1lICsncyc7XHJcbiAgICBpbmZvLndvcmQuaW5uZXJUZXh0ID0gZGF0YS53b3JkO1xyXG4gICAgY2FudmFzLmlzTWUgPSB0cnVlO1xyXG59KTtcclxuLy8g5bm/5pKt5L+h5oGv5qCPXHJcbnNvY2tldC5vbignb3RoZXJ0aW1lJyxmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7Ly8gbmFtZSx3b3JkOix0aW1lXHJcbiAgICBpbmZvLnBsYXllci5pbm5lclRleHQgPSBkYXRhLm5hbWU7XHJcbiAgICBpbmZvLnRpbWUuaW5uZXJUZXh0ID0gZGF0YS50aW1lICsncyc7XHJcbiAgICBjYW52YXMuaXNNZSA9IGZhbHNlO1xyXG59KTtcclxuLy8g5bm/5pKt5YCS6K6h5pe25Y+K5pu05paw5o+Q56S65L+h5oGvXHJcbnNvY2tldC5vbigndXBkYXRlIHRpbWUnLGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIGluZm8ucGxheWVyLmlubmVyVGV4dCA9IGRhdGEubmFtZTtcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSBkYXRhLnRpbWUgKydzJztcclxuICAgIGluZm8ud29yZC5pbm5lclRleHQgPSBkYXRhLndvcmQ7XHJcbn0pO1xyXG4vLyDlgJLorqHml7Zcclxuc29ja2V0Lm9uKCd1cGRhdGUgbXkgdGltZScsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9IGRhdGEudGltZSArJ3MnO1xyXG59KTtcclxuLy8g5pe26Ze05YiwXHJcbnNvY2tldC5vbignbXl0aW1lb3V0JyxmdW5jdGlvbiAoaWQpIHtcclxuICAgIHZhciB0ID0gdXNlcnMucXVlcnlTZWxlY3RvcignI3AnK2lkKTtcclxuICAgIGlmKHQpIHQub3V0ZXJIVE1MPScnO1xyXG4gICAgaW5mby50aW1lLmlubmVyVGV4dCA9ICfml7bpl7TliLDkuobvvIEnO1xyXG4gICAgY2FudmFzLmlzTWUgPSBmYWxzZTtcclxuICAgIGJ0bkluLm91dEFjdCgpO1xyXG59KTtcclxuLy8g5bm/5pKt5pe26Ze05Yiw77yM5YWs5biD562U5qGIXHJcbnNvY2tldC5vbigndGltZW91dCcsZnVuY3Rpb24gKGQpIHtcclxuICAgIGQgPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgdmFyIHQgPSB1c2Vycy5xdWVyeVNlbGVjdG9yKCcjcCcrZC5pZCk7XHJcbiAgICBpZih0KSB0Lm91dGVySFRNTD0nJztcclxuICAgIGluZm8udGltZS5pbm5lclRleHQgPSAn5pe26Ze05Yiw5LqG77yBJztcclxuICAgIGluZm8ud29yZC5pbm5lclRleHQgPSAn5q2j56Gu562U5qGI5Li677yaJytkLndvcmQ7XHJcbn0pO1xyXG4vLyDmuIXnqbrnlLvluINcclxuc29ja2V0Lm9uKCdjbGVhciBwYWludCcsZnVuY3Rpb24gKCkge1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLDAsY3R4LmNhbnZhcy53aWR0aCxjdHguY2FudmFzLmhlaWdodCk7XHJcbn0pO1xyXG4vLyDmjpLooYzmppxcclxuc29ja2V0Lm9uKCd0b3BzJyxmdW5jdGlvbiAoZCkge1xyXG4gICAgZCA9IEpTT04ucGFyc2UoZCk7XHJcbiAgICB0b3BzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdmFyIHRlbXAgPSB0b3BzLnRlbXBsYXRlO1xyXG4gICAgZC5mb3JFYWNoKCh4LGkpPT57XHJcbiAgICAgICAgdGVtcC5pZCA9IHguaWQ7XHJcbiAgICAgICAgdGVtcC5jaGlsZHJlblswXS5maXJzdEVsZW1lbnRDaGlsZC5pbm5lclRleHQgPSAnTm8nKyhpKzEpO1xyXG4gICAgICAgIHRlbXAuY2hpbGRyZW5bMV0uZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJUZXh0ID0geC5uYW1lO1xyXG4gICAgICAgIHRlbXAuY2hpbGRyZW5bMl0uZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJUZXh0ID0geC52KyfmrKEnO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IHRvcHMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdyb2xlJyk7XHJcbiAgICAgICAgdG9wcy5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH0pO1xyXG59KVxyXG52YXIgdXRpbHMgPSB7XHJcbiAgICAvLyDliJvlu7rnlKjmiLfkuIrlnLrmmL7npLrnmoTmoIfnrb7lj4rnm7jlupTnibnmgKdcclxuICAgIG1ha2VVc2VyUCA6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7IHAuaWQgPSAncCcreC5pZDtcclxuICAgICAgICBwLmlubmVyVGV4dCA9IHgubmFtZTtcclxuICAgICAgICByZXR1cm4gcDtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0=