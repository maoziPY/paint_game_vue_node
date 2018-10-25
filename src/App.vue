<template>
  <div id="example" class="container">
    <!-- <h1>你画我猜1</h1> -->
    <div class="row">
      <div style="float: left;width: 100%;">
        <div style="margin-left:10px;margin-right: 400px;">
          <div class="box-sh">
            <canvas height="600" @mousemove="canvasMousemove" @mouseup="canvasMouseup" @mousedown="canvasMousedown">
              Sorry, Your Browser don't support canvas of Html5.
            </canvas>
            <div style="background-color: gainsboro">
              <div class="ctl-row" id="colors">
                <span class="text-blue fl" style="padding:0 4px 0;">颜色</span>

                <div v-for="n in 20" @click="chooseColor(n)" :style="{ backgroundColor: colorArr[n]}" class="rect" :class="{active: selectedColorIndex === n}"></div>

                <!-- 直接用:style="{ backgroundColor: addColor()}"生成样式有bug，选择颜色或者改变宽度时会自动触发addColor() -->
                <!-- <div v-for="n in 20" @click="chooseColor(n)" :style="{ backgroundColor: addColor()}" class="rect" :class="{active: selectedColorIndex === n}"></div> -->
              </div>
              <div class="ctl-row">
                <span class="text-blue fl" style="padding:0 4px 0;">线宽</span>
                <input id="ranger" type="range" @change="changeLineWidth" style="width: 100px;" v-model="lineWidth" min="1" step="1" max="10"/>
                <span v-cloak>{{lineWidth}}</span>
                <div class="fr" id="btns">
                  <a class="btn btn-blue btn-active-able" :class="{active: paintToolsSelected === 1}" @click="choosePaintTools('brush')" href="javascript:void(0)">画笔</a>
                  <a class="btn btn-blue btn-active-able" :class="{active: paintToolsSelected === 2}" @click="choosePaintTools('eraser')" href="javascript:void(0)">橡皮擦</a>
                  <a class="btn btn-blue" @click="clearPaths" href="javascript:void(0)">清空</a>
                  <a class="btn btn-blue" onclick="this.href=canvas.toDataURL();" download="png.png">下载</a>
                </div>
                <div style="clear: both;"></div>
              </div>
            </div>
          </div>
          <main style="margin-top: 20px;">
            <div class="row">
              <div class="col-2">
                <div class="box-sh">
                  <h4>上场玩家</h4>
                  <div id="div-users" style="min-height:50px;max-height: 120px;overflow-y: scroll;">

                  </div>
                  <p class="fr" style="margin: 5px;">
                    <button class="btn btn-blue" id="btn-in" @click="getIn" title="上场后，队列第一位将会上场绘画">上场！</button>
                    <button class="btn btn-blue" :class="{ on: isAutoin }" id="btn-autoin" @click="autoin" title="自动上场">自动上场</button>
                  </p>
                  <p style="clear: both"></p>
                </div>
              </div>
              <div class="col-4">
                <div class="box-sh">
                  <h4>信息栏</h4>
                  <div id="info" style="padding: 10px;overflow: scroll">
                    <p style="white-space: nowrap;"><label>绘图玩家：</label><strong id="player"></strong></p>
                    <p style="white-space: nowrap;"><label>剩余时间：</label><strong id="time"></strong></p>
                    <p style="white-space: nowrap;"><label>关键词语：</label><strong id="word"></strong></p>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="box-sh">
                  <h4>排行榜</h4>
                  <div class="table-responsive">
                    <table id="tops">
                      <tr role="template">
                        <td><label></label></td>
                        <td><strong></strong></td>
                        <td><em></em></td>
                      </tr>
                      <!--<li style="white-space: nowrap;" role="template"><label style="margin-right: 40px;"></label><strong style="margin-right: 20px;"></strong><em style="margin-right: 20px;padding-right: 10px;"></em></li>-->
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>
      <div class="box-sh" style="margin-left: -380px;float: left;width:370px;">
        <h3>消息框</h3>
        <div id="msg">
        </div>
        <input type="text" id="input-msg" v-model="msg" @keyup.13="sendMessage()" placeholder="输入消息或者词语，回车键发送"/>
      </div>
    </div>
  </div>
</template>

<script>

  var canvas = {}, ctx = {}, btnIn = {}, btnAutoin = {}, info = {}, users = {};

  import utils from './common/utils.js'
  import io from 'vue-socket.io'
  import Vue from 'vue'

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
        canvas.pts.push({x:x,y:y});
      },
    // 清除绘制的所有点
    clearPos : function () {
      canvas.pts = []
    }
  };

// model

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

// Ctl = ctl

Vue.use(io, 'http://localhost:4000')

export default {
  data () {
    return {
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
          }
        },
        sockets: {
        // 显示消息
        'server msg': function (data) {
          let [ele, msg] = [document.createElement('p'), this.MSG];
          ele.innerHTML = data;
          msg.appendChild(ele);
          msg.scrollTop = msg.scrollHeight;
        },
        // 入口，初始化状态
        login: function () {
          if(!prompt)
            // if(prompt)
          this.$socket.emit('login',encodeURIComponent(prompt('输入你的姓名')));
          else
            this.$socket.emit('login', encodeURIComponent('手机用户'));
          btnIn.outAct();
          canvas.isMe = false;
          btnAutoin.disalbed = false;
        },
        // 根据RAM中的paths变量，若存在tag==='pts'标识，则绘制，否则清除
        'paint paths': function (paths) {
          paths = JSON.parse(paths);
          ctx.clearRect(0,0,canvas.width,canvas.height);
          for(var k in paths) {
            if(paths[k].tag==='pts')
              Ctl.drawPts(ctx, paths[k]);
            else{
              new Rect(paths[k].x,paths[k].y,paths[k].w,paths[k].h).clearOn(ctx);
            }
          }
        },
        // 其他玩家同步绘画人的绘画
        'paint pts': function (pts) {
            //canvas.paths = paths;
            pts = JSON.parse(pts)
            if(!pts) return;
            Ctl.drawPts(ctx, pts);
          },
        // 指令操作
        cmd: function (data) {
          console.log(JSON.parse(data));
        },
        // 上场的用户
        'reset in users': function (data) {
          data = JSON.parse(data);
            // [
            //     {name: '', in:true}
            // ]
            users.innerHTML = '';
            data.forEach(x=>{
              users.appendChild(utils.makeUserP(x));
            });
          },
        // 擦除
        erase: function ({x,y,w,h}) {
          new Rect(x,y,w,h).clearOn(ctx);
        },
        // 广播通知有用户上场
        'new in user': function (data) {
          users.appendChild(utils.makeUserP(JSON.parse(data)));
        },
        'out user': function (id) {
          var x = users.querySelector('#p'+id);
          if(x) x.outerHTML='';
        },
        // 上场
        in: function (data) {
          users.appendChild(utils.makeUserP(JSON.parse(data)));
          users.scrollTop = users.scrollHeight;
          btnIn.inAct();
        },
        // 下场
        out: function (id) {
          var x = users.querySelector('#p'+id);
          if(x){
            x.outerHTML='';
            btnIn.outAct();
          }
        },
        // 信息栏
        mytime: function (data) {
            data = JSON.parse(data);// name,word:,time
            btnIn.disabled = true;
            info.player.innerText = data.name + '(自己)';
            info.time.innerText = data.time +'s';
            info.word.innerText = data.word;
            canvas.isMe = true;
          },
        // 广播信息栏
        othertime: function (data) {
            data = JSON.parse(data);// name,word:,time
            info.player.innerText = data.name;
            info.time.innerText = data.time +'s';
            canvas.isMe = false;
          },
        // 广播倒计时及更新提示信息
        'update time': function (data) {
          data = JSON.parse(data);
          info.player.innerText = data.name;
          info.time.innerText = data.time +'s';
          info.word.innerText = data.word;
        },
        // 倒计时
        'update my time': function (data) {
          data = JSON.parse(data);
          info.time.innerText = data.time +'s';
        },
        // 时间到
        mytimeout: function (id) {
          var t = users.querySelector('#p'+id);
          if(t) t.outerHTML='';
          info.time.innerText = '时间到了！';
          canvas.isMe = false;
          btnIn.outAct();
        },
        // 广播时间到，公布答案
        'timeout': function (d) {
          d = JSON.parse(d);
          var t = users.querySelector('#p'+d.id);
          if(t) t.outerHTML='';
          info.time.innerText = '时间到了！';
          info.word.innerText = '正确答案为：'+d.word;
        },
        // 清空画布
        'clear paths': function () {
          ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        },
        // 排行榜
        tops: function (d) {
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
        },
        connect: function () {
         console.log('socket connected')
       },
     },
     mounted () {
      let _this = this;
      _this.init();

        // 初始化颜色数据
        // PS:在html中直接用:style="{ backgroundColor: addColor()}"生成样式有bug，选择颜色或者改变宽度时会自动触发addColor()
        let colorTemp = []
        for (let i=0; i<20; i++) {
          colorTemp.push(this.addColor())
        }
        this.colorArr = colorTemp


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

        window.addEventListener('resize',this.resize);

        this.resize();

        this.MSG = document.getElementById('msg');
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
            this.$socket.emit('client msg',_this.msg);
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
        // 清空
        clearPaths () {
          this.$socket.emit('clear paths');
        },
        /**
         * [chooseColor 选择画笔颜色]
         * @param  {[number]} index [颜色数组的下标]
         */
         chooseColor (index) {
          this.selectedColorIndex = index
          Ctl.setColor(this.colorArr[index]);
        },
        // 选择画笔宽度 
        changeLineWidth () {
          Ctl.setLw(this.lineWidth);
        },
        // 上场
        getIn () {
          var t = btnIn.in,
          that = this;
          if(btnIn.t) clearTimeout(btnIn.t);
            // 自动上下场
            btnIn.t = setTimeout(function () {
              that.$socket.emit(!t?'in':'out');
            },400);
          },
        // 自动上场
        autoin () {
          var btnin = btnIn,
          $socket = this.$socket;
          if(btnin.autoIn == null){
            if(!btnin.in) $socket.emit('in');
                // 5少轮循，检查自动上场
                btnin.autoIn = setInterval(function () {
                    // 上场后，isMe=true，btnin.in=true
                    if(canvas.isMe) return;
                    if(!btnin.in) $socket.emit('in');
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
          this.colorArr.push(color)
          return color
        },
        // 开始绘制
        canvasMousedown (e) {
          if(!canvas.isMe) return;
          var x = e.offsetX,y = e.offsetY;
          if(canvas.erase){

            var w=20,h=20;
                // w>>>1相当于Math.ceil(w/2)，表示向上取整
                var rect = new Rect(x-(w>>>1),y-(h>>>1),w,h);
                rect.clearOn(ctx);
                this.$socket.emit('erase',rect.x,rect.y,rect.w,rect.h);
                return;
              }
              
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
                    this.$socket.emit('paint',JSON.stringify({data:new Path(canvas.pts),status:'ing'}))
                  }else{
                    var rect = new Rect(x-(w>>>1),y-(h>>>1),w,h);
                    rect.clearOn(ctx);
                    this.$socket.emit('erase',rect.x,rect.y,rect.w,rect.h);
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
          this.$socket.emit('paint',JSON.stringify({data:new Path(canvas.pts),status:'end'}));
          Ctl.clearPos();
        },
        // 监听窗口大小变化，进行重绘
        resize () {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.paths = canvas.pts = [];
          this.$socket.emit('repaint');
        }
      },
      computed: {}
    }
  </script>

  <style scoped>
  #example {
    　　color:#fff;
    height: 100vh;
  }
  [v-cloak] {
    display: none;
  }
  *{
    margin: 0;
    padding: 0;
    font-family: 微软雅黑Arial, Arial, sans-serif;
    box-sizing: border-box;
  }
  body{
    touch-action: none;
  }
  canvas{
    cursor: crosshair;
  }
  h1,h2,h3{
    text-align: center;
    margin: 10px 4px 20px;
  }
  h4,h5,h6{
    text-align: center;
    padding: 8px 0 8px;
    border-bottom: 1px solid #eee;
  }
  .container{
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  .margin-none{
    margin: 0;
  }
  .col-6{
    width: 60%;
  }
  .col-7{
    width: 70%;
  }
  .col-3{
    width: 30%;
  }
  .col-1{
    width: 10%;
  }
  .col-2{
    width: 20%;
  }
  .col-3{
    width: 30%;
  }
  .col-4{
    width: 40%;
  }
  .col-9{
    width: 90%;
  }
  .col-8{
    width: 80%;
  }
  .row{
    margin-right: -15px;
    margin-left: -15px;
  }
  .row:before,
  .row:after {
    content: " ";
    display: table;
  }
  .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9{
    padding-left: 15px;
    padding-right: 15px;
    float: left;
  }
  .row:after {
    clear: both;
  }
  .text-blue {
    color: cornflowerblue;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .mid{
    vertical-align: middle;
  }
  .active{
    border: 3px solid fuchsia !important;
  }
  .btn{
    display: inline-block;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin: 4px;
    border-radius: 3px;
  }
  .btn:hover{
    box-shadow: 0px 0px 3px 3px #bbb;
  }
  .btn-blue{
    background-color: cornflowerblue;
    color: azure;
  }

  .on{
    border: solid 2px hotpink;
    opacity: .6;
  }
  a{
    text-decoration: none;
    font-size: 14px;
  }
  .rect{
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid black;
    text-align: center;
    margin:0 2px 0;
    cursor: pointer;
  }
  .ctl-row{
    border: 1px solid darkgreen;
    background-color: beige;
    padding-top:5px;
    padding-bottom: 5px;
    border-radius: 6px;
    margin: 2px 0 2px;
  }

  .box-sh{
    box-shadow: 0px 0px 8px 3px #bbb;
  }

  .text-center{
    text-align: center;
  }

  #msg{
    overflow-y: scroll;
    padding: 0 10px 0;
    /*width: 100%;*/
    min-height: 400px;
    max-height: 600px;
  }
  #msg p{
    white-space:nowrap;
  }
  #info p{
    line-height: 30px;
  }
  #div-users p{
    margin-left: 2em;
  }
  input[type=range]{cursor: pointer;}
  input[type=text]{
    height: 20px;
    font-size: 16px;
    margin: 5px;
    width: 90%;
  }
  button[disabled]{
    opacity: .6;
    cursor: not-allowed;
  }
  table{
    margin-top: 10px;
    width: 100%;
    border-collapse:collapse;
  }

  table tr:nth-child(2n){
    background-color: gainsboro;
  }
  .table-responsive{
    overflow-x: auto;
    overflow-y: scroll;
    max-height: 150px;
  }
  td{
    padding: 4px 8px 4px;
    white-space: nowrap;
  }
  *[role=template]{
    display: none;
  }
</style>