var equation;
var Tran = 0
var iTran = 0
var length = 0


function setup(){

    frameRate = 60
    colorMode(RGB, 255)
    red = color(255,0,0);
    green = color(0,255,0);
    blue = color(125, 249, 255)
    white = color(255)
    createCanvas(450,200);
    var V = new operand('V',100,100)
    var equals = new operator('=',150,100)
    var I = new operand('I',200,100)
    var multiplied = new operator('x',250,100)
    var R = new operand('R',300,100)
    R2 = new operand('R',247,150)
    R2.tran = 0
    R3 = new operand('R',100,150)
    R3.tran = 0
    otherI = new operand('I',230,150)
    otherI.tran = 0
    equation = [V,equals,I,multiplied,R]
}

function draw(){
    background(50);
    textSize(32)
    for(var i = 0;i < equation.length;i++){
	equation[i].display()
    }
    R2.display()
    R3.display()
    divideByR()
    
}

var operand = function(symbol,x,y){
    this.symbol = symbol
    this.position = createVector(x,y)
    this.colour = (255,255,255,255)
}

var operator = function(symbol,x,y){
    this.symbol = symbol
    this.position = createVector(x,y)
    this.colour = (255,255,255,255)
}

operand.prototype.display = function(){
    fill(this.colour);
    text(this.symbol,this.position.x,this.position.y)
}

operator.prototype.display = function(){
    fill(this.colour);
    text(this.symbol,this.position.x,this.position.y)
}

function divideByR(){
    R2.colour=color(255,255,255,Tran);
    R3.colour=color(255,255,255,Tran);
    fill(255,255,255,Tran)
    rect(90,110,40,3)
    rect(200,110,125,3)
    if(Tran <255){
	Tran = Tran +10}
    if(Tran > 255){
	strokeWeight(3)
	stroke(255,255,255,Tran)
	line(325,75,325-length,75+length)
	line(272,125,272-length,125+length)
	if(length < 30){
	    length++}
    }
    console.log(length)
    if(length == 30){
	stroke(255,255,255,Tran)
	fill(255,255,255,Tran)
	Tran = Tran - 10}
    
}


