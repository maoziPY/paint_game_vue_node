var colorArr = [], Ctl = {}, canvas = {}, ctx = {}, btnIn = {}, msg = {}, btnAutoin = {}, info = {}, users = {}, vm = {}, socket = {};
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