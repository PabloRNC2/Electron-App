function Trail(x, y, color1, color2) {
	this.x = x
	this.y = y
	this.color1 = color1
	this.color2 = color2
}


Trail.prototype.draw = function() {
	if(this.y < -canvas.height*90/100) {
		this.y = canvas.height+Math.round(Math.random()*2000)
		this.x =  Math.round(Math.random()*canvas.width)
	}
	this.y -= 20
	var grd = ctx.createLinearGradient(this.x,this.y,0+this.x,canvas.height*90/100+this.y)
	grd.addColorStop(0, this.color1)
	grd.addColorStop(0.5, this.color2)
	grd.addColorStop(1, this.color1)
	ctx.fillStyle = grd
	ctx.fillRect(this.x, this.y, 5, canvas.height*90/100)
}

function Rect(x, width, color) {
	this.x = x
	this.initPos = x
	this.width = width
	this.color = color
}

Rect.prototype.draw = function(ctx) {
	ctx.fillStyle = this.color
	this.x = this.randomShift()
	ctx.fillRect(this.x, 0, this.width, canvas.height)
}

Rect.prototype.randomShift = function() {
	let rdm = Math.random()*4-2
	if(this.x + rdm > this.initPos + 10 || this.x + rdm < this.initPos - 10) {
		return this.x - rdm
	}
	return this.x + rdm
}

function drawFrame () {
	window.requestAnimationFrame(drawFrame, canvas)
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = '#58C7FE'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	rect1.draw(ctx)
	rect2.draw(ctx)
	rect3.draw(ctx)
	for(let i=0; i<backTrail.length; i++) {
		backTrail[i].draw(ctx)
	}
	for(let i=0; i<frontTrail.length; i++) {
		frontTrail[i].draw(ctx)
	}
}

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	rect1 = new Rect(canvas.width*11/100, canvas.width*75/100, '#58CEFE')
	rect2 = new Rect(canvas.width*18/100, canvas.width*22/100, '#6CD6FE')
	rect3 = new Rect(canvas.width*59/100, canvas.width*13/100, '#6CD6FE')
}

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d') 
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var rect1 = new Rect(canvas.width*11/100, canvas.width*75/100, '#58CEFE')
var rect2 = new Rect(canvas.width*18/100, canvas.width*22/100, '#6CD6FE')
var rect3 = new Rect(canvas.width*59/100, canvas.width*13/100, '#6CD6FE')
var frontTrail = []
for(let i=0; i<2; i++) {
	frontTrail.push(new Trail(0, -canvas.height, 'rgba(217,255,255,0)', 'rgba(217,255,255,1)'))
}
var backTrail = []
for(let i=0; i<10; i++) {
	backTrail.push(new Trail(0, -canvas.height, 'rgba(217,255,255,0)', 'rgba(217,255,255,0.3)'))
}

window.addEventListener('resize', resizeCanvas)
drawFrame()