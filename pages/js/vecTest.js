var system;
var a,b,c,p

function setup() {
    frameRate = 1;
    createCanvas(820, 400);
    a = createVector(50,50);
    b = createVector(200,150);
    c = createVector(200,200);
    d = createVector(50,300)
    p = createVector(49,100);

}

function draw() {
    background(51);
    stroke(255)
    drawTrapezium(a,b,c,d)
    if(inTrapezium(p,a,b,c,d) === true){
	fill(255,0,0)
    }
    else{
	fill(0,0,255)
    }
    drawParticle(p)
}

//define the cross product of two p5 Vector
function crossProduct(u,v){
   return u.x * v.y - u.y * v.x
}

//Check if point p lies along the same side of line a,b as point c
function sameSide(p,a,b,c){
    var bSuba = p5.Vector.sub(b,a)
    var pSuba = p5.Vector.sub(p,a)
    var cSuba = p5.Vector.sub(c,a)
    var xProd1 = crossProduct(bSuba,pSuba)
    var xProd2 = crossProduct(bSuba,cSuba)
    return (xProd1 * xProd2 >= 0)
}

//Check if point p lies inside triangle a,b,c
function inTriangle(p,a,b,c){
    return sameSide(p,a,b,c) && sameSide(p,a,c,b) && sameSide(p,b,c,a)
}

//Check if point lies inside rectangle a,b,c,d
//a-----b
//|     |
//d-----c
function inRect(p,a,b,c,d){
    return p.x > a.x && p.x < b.x && p.y > a.y && p.y < d.y
}

//Check if point lies inside trapezium a,b,c,d
/* 
a
|\
| \
e  b
|  |
f  c
| /
|/
d
*/
function inTrapezium(p,a,b,c,d){
    var e = createVector(a.x,b.y);
    var f = createVector(d.x,c.y);
    var inUpperTriangle = inTriangle(p,a,b,e);
    var inLowerTriangle = inTriangle(p,c,d,f);
    var inRectangle = inRect(p,e,b,c,f)
    return inUpperTriangle || inLowerTriangle || inRectangle
}

function drawTrapezium(a,b,c,d){
    line(a.x,a.y,b.x,b.y)
    line(d.x,d.y,c.x,c.y)
}

function drawParticle(p){
    ellipse(p.x,p.y,10,10)
}
    
	

