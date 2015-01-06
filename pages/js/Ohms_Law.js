var IANIMATION1 = false;
var IANIMATION2 = false;
var RANIMATION1 = false;
var RANIMATION2 = false;

function setup(){

    frameRate = 60
    colorMode(RGB, 255)
    red = color(255,0,0);
    green = color(0,255,0);
    blue = color(125, 249, 255)
    white = color(255)
    createCanvas(500,300);
    V1 = new symbol('V',100,100,255)
    equals = new symbol('=',150,100,255)
    I1 = new symbol('I',210,100,255)
    I2 = new symbol('I',253,150,255)
    I3 = new symbol('I',106,150,255)
    multiplied = new symbol('x',250,100,255)
    R1 = new symbol('R',300,100,255)
    R2 = new symbol('R',247,150,55)
    R3 = new symbol('R',100,150,255)
    divisor1 = new mathLine(90,110,135,110,255,3)
    divisor2 = new mathLine(200,110,325,110,255,3)
    cancel1 = new mathLine(325,75,325,75,255,3)
    cancel2 = new mathLine(272,125,272,125,255,3)
    cancel3 = new mathLine(230,75,230,75,255,3)
    resetMaths()
    
    reset = createButton('Reset')
    reset.position(180,180)
    reset.mousePressed(resetMaths)

    Isub = createButton('Make R the subject')
    Isub.position(260,180)
    Isub.mousePressed(ItheSubject)

    Rsub = createButton('Make I the subject')
    Rsub.position(25,180)
    Rsub.mousePressed(RtheSubject)


}

function draw(){
    background(50);
    textSize(32);
    R1.display();
    R2.display();
    R3.display();
    V1.display();
    I1.display();
    I2.display();
    I3.display();
    equals.display();
    multiplied.display();
    divisor1.display();
    divisor2.display();
    cancel1.display();
    cancel2.display();
    cancel3.display()
    if(IANIMATION1 == true){
	animIpart1()
    }
    if(IANIMATION2 == true){
	animIpart2()
    }
    if(RANIMATION1 == true){
	animRpart1()
    }
    if(RANIMATION2 == true){
	animRpart2()
    }

}

var symbol = function(character,x,y, transparency){
    this.character = character
    this.position = createVector(x,y)
    this.transparency = transparency
    this.colour = (255,255,255)
}

symbol.prototype.display = function(){
    noStroke();
    fill(this.colour,this.transparency);
    text(this.character,this.position.x,this.position.y)
}

var mathLine = function(startX,startY,endX,endY,transparency,thickness){
    this.start = createVector(startX,startY);
    this.end = createVector(endX,endY);
    this.transparency = transparency;
    this.thickness = thickness;
}

mathLine.prototype.display = function(){
    stroke(255,this.transparency);
    strokeWeight(this.thickness);
    line(this.start.x,this.start.y,this.end.x,this.end.y);
}

function resetMaths(){
    IANIMATION1 = false;
    IANIMATION2 = false;
    RANIMATION1 = false;
    RANIMATION2 = false;
    R2.transparency = 0;
    R3.transparency = 0;
    I2.transparency = 0;
    I3.transparency = 0;
    divisor1.transparency = 0;
    divisor2.transparency = 0;
    cancel1.transparency = 0;
    cancel2.transparency = 0;
    cancel3.transparency = 0;
    multiplied.transparency = 255;
    R1.transparency = 255;
    I1.transparency = 255;
    R1.position.x = 300;
    R1.position.y = 100;
    I1.position.y = 100;
    equals.position.y = 100;
    cancel1.end.x = cancel1.start.x
    cancel1.end.y = cancel1.start.y
    cancel2.end.x = cancel2.start.x
    cancel2.end.y = cancel2.start.y
    cancel3.end.x = cancel3.start.x
    cancel3.end.y = cancel3.start.y
    
}

function ItheSubject(){
    resetMaths();
    IANIMATION1 = true;
}

function RtheSubject(){
    resetMaths();
    RANIMATION1 = true;

}
    

function animIpart1(){
    equals.position.y += 0.3;
    I2.transparency += 10
    I3.transparency += 10
    divisor1.transparency += 10
    divisor2.transparency += 10
    if(I2.transparency > 255 && cancel3.end.x > (cancel3.start.x - 30)){
	cancel3.end.x --;
	cancel3.end.y ++;
	cancel2.end.x --;
	cancel2.end.y ++;
	cancel3.transparency = 255;
	cancel2.transparency = 255;
	if(cancel3.end.x == (cancel3.start.x - 30)){
	    IANIMATION1 = false
	    IANIMATION2 = true
	    I1.transparency = 255;
	    I2.transparency = 255;
	    divisor2.transparency = 255;
	}
    }
}

function animIpart2(){
    multiplied.transparency -= 10;
    divisor2.transparency -= 10;
    I1.transparency -= 10;
    I2.transparency -= 10;
    cancel3.transparency -= 10;
    cancel2.transparency -= 10;
    if(R1.position.x > 200){
	R1.position.x -=2;
	R1.position.y +=0.4;
    }
}
function animRpart1(){
    equals.position.y += 0.3;
    R2.transparency += 10
    R3.transparency += 10
    divisor1.transparency += 10
    divisor2.transparency += 10
    if(R3.transparency > 255 && cancel3.end.x > (cancel3.start.x - 30)){
	cancel2.end.x --;
	cancel2.end.y ++;
	cancel1.end.x --;
	cancel1.end.y ++;
	cancel2.transparency = 255;
	cancel1.transparency = 255;
	if(cancel2.end.x == (cancel2.start.x - 30)){
	    RANIMATION1 = false
	    RANIMATION2 = true
	    R2.transparency = 255;
	    R3.transparency = 255;
	    divisor2.transparency = 255;
	}
    }
}

function animRpart2(){
    multiplied.transparency -= 10;
    divisor2.transparency -= 10;
    R1.transparency -= 10;
    R2.transparency -= 10;
    cancel1.transparency -= 10;
    cancel2.transparency -= 10;
    if(I1.position.y < 120){
	I1.position.y +=0.4;
    }
}
