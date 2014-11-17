var Points = [];
var Lines = [];
var white = (255,255,255);

function setup(){
    colorMode(RGB, 255)
    red = color(255,0,0);
    green = color(0,255,0);
    blue = color(0,0,255)
    createCanvas(800,300);
    A = new Point(150,150,5);
    Points.push(A);
    B = new Point(150,300,5);
    Points.push(B);
    AB = new Line(A,B)
    Lines.push(AB);
    C = new Point(200,300,5);
    Points.push(C)
    D = new Point(200,150,5);
    Points.push(D);
    CD = new Line(C,D);
    Lines.push(CD);
    firstEmitter = new Emitter(600,100);
}

function draw(){
    background(50);
    for(var i = 0;i < Points.length;i++){
	Points[i].display(white);
    }
    AB.display(white);
    CD.display(white)
    firstEmitter.addParticle();
    firstEmitter.run();
    
}

//Class for points
var Point = function(x_position,y_position,radius){
    this.position = createVector(x_position,y_position);
    this.radius = radius;
    this.moveable = false;
}

//display the point
Point.prototype.display = function(colour){
    fill(colour);
    ellipse(this.position.x,this.position.y,this.radius*2,this.radius*2);
}

//Class for lines
var Line = function(start,end){
    this.start = start;
    this.end = end;
    this.asVector = p5.Vector.sub(this.end.position,this.start.position);
    this.Normalised = this.asVector.normalize();
    //Get the bounding box for the line
    this.UpperLeft = createVector(Math.min(this.start.position.x, this.end.position.x), Math.min(this.start.position.y,this.end.position.y));
    this.LowerRight = createVector(Math.max(this.start.position.x, this.end.position.x), Math.max(this.start.position.y,this.end.position.y));
}

//Update the line to give a new vector and the normalised vector
Line.prototype.update = function(){
    this.asVector = p5.Vector.sub(this.end.position,this.start.position);
    this.Normalised = this.asVector.normalize();
    this.UpperLeft = createVector(Math.min(this.start.position.x, this.end.position.x), Math.min(this.start.position.y,this.end.position.y));
    this.LowerRight = createVector(Math.max(this.start.position.x, this.end.position.x), Math.max(this.start.position.y,this.end.position.y));
}

//Display the line
Line.prototype.display = function(colour){
    stroke(colour)
    line(this.start.position.x,this.start.position.y,this.end.position.x,this.end.position.y)
}

//Class for emitter
    var Emitter = function(x_position, y_position){
    this.origin = createVector(x_position,y_position)
    this.particles = []
}

//Method to add particles
Emitter.prototype.addParticle = function(){
    this.particles.push(new Particle(this.origin))
}
//Method to start emitter
Emitter.prototype.run = function(){
    for(var i = this.particles.length -1; i>=0; i--){
	var p = this.particles[i];
	p.run();
	if(p.isDead()==true){
	    this.particles.splice(i,1);
	}
    }
}

//Class for particles
var Particle = function(position){
    this.acceleration = createVector(0,0);
    this.velocity = createVector(random(-0.5,-3),random(-0.5,0.5));
    this.width = createVector(0,random(-20,20));
    this.position = p5.Vector.add(position,this.width);
    this.lifespan = 100;
    this.radius = 5
    this.colour = red;
}

//Method to run each frame for the particle
Particle.prototype.run = function(){
    this.update();
    this.display();
}

//Method to update particles each frame
Particle.prototype.update = function(){
    this.lifespan--;
    this.possCollision()
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
}

//Method to draw particles
Particle.prototype.display = function(){
    fill(this.colour);
    ellipse(this.position.x, this.position.y,this.radius*2,this.radius*2)
}

//Method to kill particles
Particle.prototype.isDead = function(){
    var isDead;
    if(this.position.x > width-50 || this.position.x < 0 + 50 || this.position.y > height -50 || this.position.y < 0+50){
	isDead = true
    }
    return isDead
}

//Method to check possible collision
Particle.prototype.possCollision = function(){
    this.colour = red;
    for(var i = 0; i < Lines.length; i++){
	    if(this.position.x > Lines[i].UpperLeft.x && this.position.x < Lines[i].LowerRight.x){
	if(this.position.y > Lines[i].UpperLeft.y && this.position.y < Lines[i].LowerRight.y){
	    this.collision(Lines[i]);
	    this.colour = green;
	    return Lines[i]
	}
	   }
    }
}

//Function to determine whether a collision has occured. Turn it into a prototype and add in the changes in velocity
Particle.prototype.collision = function(lineSegment){
    var collision;
    var Projection = calcProjection(lineSegment.Normalised,p5.Vector.sub(this.position,lineSegment.start.position))
    var closest = closestPoint(lineSegment,Projection)
    fill(255,0,0)
//    ellipse(closest.x,closest.y,5,5)
    var shortestDistance = p5.Vector.sub(this.position,closest)
    if((this.radius*this.radius) > (p5.Vector.dot(shortestDistance,shortestDistance))){
	console.log('Hit')
	VelocityLine = p5.Vector.mult(lineSegment.Normalised,(p5.Vector.dot(lineSegment.Normalised,this.velocity)));
	VelocityNorm = p5.Vector.mult(shortestDistance.normalize(),(p5.Vector.dot(shortestDistance.normalize(),this.velocity)));
	VelocityNorm.mult(-1)
	this.velocity = p5.Vector.add(VelocityLine,VelocityNorm)
	this.position.add(this.velocity)
	collision = true;
    }
    else{
	collision = false;
    }
    return collision
}

//Calculate projection of A onto B (A needs to be normalised)
function calcProjection(AVector,BVector){
    var projection = p5.Vector.mult(AVector,(p5.Vector.dot(AVector,BVector)))
    return projection
}

//Calculate closest point on linesegment to particle
function closestPoint(lineVector,projection){
    var q = p5.Vector.add(lineVector.start.position,projection);
    if(q.x < lineVector.UpperLeft.x){
	q.x = lineVector.UpperLeft.x
    }
    else if(q.x > lineVector.LowerRight.x){
	q.x = lineVector.LowerRight.x
    }
    if(q.y < lineVector.UpperLeft.y){
	q.y = lineVector.UpperLeft.y
    }
    else if(q.y > lineVector.LowerRight.y){
	q.y = lineVector.LowerRight.y
    }
    return q
}
	
//Move Points elements to mouse x,y
function mouseDragged(){
    for (var i = 0; i < Points.length; i++){
	if(Points[i].moveable == true){
	    Points[i].position.x = mouseX;
	    Points[i].position.y = mouseY;
	}
    }
    for (var i = 0; i < Lines.length; i++){
	Lines[i].update();
    }
}

//Check if a point has been clicked on and allow the point to move
function mousePressed(){
    for (var i = 0; i < Points.length; i++){
	var point = Points[i];
	if(mouseX > (point.position.x - point.radius) && mouseX < (point.position.x + point.radius) && mouseY < (point.position.y +point.radius) && mouseY > (point.position.y - point.radius)){
	    point.moveable = true;
	}
    }
}

//Stop all points being moved when mouse is released
function mouseReleased(){
   for (var i = 0; i < Points.length; i++){
       Points[i].moveable = false;
   }
}
