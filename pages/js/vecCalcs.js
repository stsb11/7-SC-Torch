var myPoint;
var dotProductText;
var moveA, moveB, moveC
var D;
function setup(){
    createCanvas(800,400);
    A = new Point(150,150);
    B = new Point(300,300);
    C = new Particle(300,150)
    
};

function draw(){
    background(50);
    fill(255);
    A.display();
    B.display();
    C.display()
    stroke(255)
    line(A.position.x,A.position.y,B.position.x,B.position.y)
    stroke(255,100,100)
    line(A.position.x,A.position.y,C.position.x,C.position.y)
    calcProjection(A.position,B.position,C.position)
};

var Point = function(x,y){
    this.position = createVector(x,y);
    this.r = 3;
}

Point.prototype.display = function(){
    fill(255);
    ellipse(this.position.x,this.position.y,this.r*2,this.r*2);
}

var Particle=function(x,y){
    this.position = createVector(x,y);
    this.r = 10;
}
Particle.prototype.display = function(){
    fill(200,50,50)
    ellipse(this.position.x,this.position.y,this.r*2,this.r*2)
}

function calcProjection(APos,BPos,CPos){
    var vectorAB = p5.Vector.sub(BPos,APos).normalize()
    var vectorAC = p5.Vector.sub(CPos,APos)
    var projection = p5.Vector.mult(vectorAB,(p5.Vector.dot(vectorAB,vectorAC)))
    writeLabels(vectorAB,vectorAC,projection)
    stroke(100,255,100)
    strokeWeight(3)
    var D = p5.Vector.add(APos,projection)
    line(APos.x,APos.y,D.x,D.y)


}

function writeLabels(AB,AC,projection){
    fill(255)
    stroke(255)
    text('A: ' + A.position.x + ',' + A.position.y,500,50)
    text('B: ' + B.position.x + ',' + B.position.y,500,70)
    text('C: ' + C.position.x + ',' + C.position.y,500,90)
    text('vectorAB: ' + AB.x.toFixed(3) + ',' + AB.y.toFixed(3),500,110)
    text('vectorAC: ' + AC.x.toFixed(3) + ',' + AC.y.toFixed(3),500,130)
    text('projection: ' + projection.x.toFixed(3) + ',' + projection.y.toFixed(3),500,150)
    text(moveA,500,160)
}

function mouseDragged() {
    if(moveA == true){
	A.position.x = mouseX;
	A.position.y = mouseY;
    }
    else if(moveB == true){
	B.position.x = mouseX;
	B.position.y = mouseY;
     }
     else if(moveC == true){
	C.position.x = mouseX;
	C.position.y = mouseY;
    }
    return false;
}

function mousePressed(){
    if(mouseX > (A.position.x -A.r) && mouseX < (A.position.x + A.r) && mouseY < (A.position.y +A.r) && mouseY > (A.position.y - A.r)){
	moveA = true;
    }
    else if(mouseX > (B.position.x -B.r) && mouseX < (B.position.x + B.r) && mouseY < (B.position.y +B.r) && mouseY > (B.position.y - B.r)){
	moveB = true;
    }
    else if(mouseX > (C.position.x -C.r) && mouseX < (C.position.x + C.r) && mouseY < (C.position.y +C.r) && mouseY > (C.position.y - C.r)){
	moveC = true;
    }
}

function mouseReleased(){
    moveA = false;
    moveB = false;
    moveC = false
}
