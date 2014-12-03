var Points = [];
var Lines = [];
var Current;
var voltage = 0.1;
var Resistance = 2;
var count = 0;
var hold = 1;
var Thickness = 100;
photons = []

function setup(){
    frameRate = 30;
    colorMode(RGB, 255)
    red = color(255,0,0);
    green = color(0,255,0);
    blue = color(125, 249, 255)
    yellow = color(255,255,0);
    white = color(255)
    createCanvas(800,500);
    //Set up points for LED
    Points.push(new Point(width/2-150,height/2-50,0),
		new Point(width/2+150,height/2-50,0),
		new Point(width/2+150,height/2+50,0),
		new Point(width/2-150,height/2+50,0)
	       );
    //Set up lines for LED
    Lines.push(new Line(Points[0],Points[1]),
 	       new Line(Points[1],Points[2]),
	       new Line(Points[2],Points[3]),
	       new Line(Points[3],Points[0])

 	      );
    
    //Add an electron emitter
    electronEmitter = new Emitter(Points[1].position.x-5,height/2,blue,-voltage,-1);
    for(var i = 0;i<50;i++){
	electronEmitter.addParticle();
    }

    //Add a hole emitter
    holeEmitter = new Emitter(Points[0].position.x+5,height/2,red,voltage,+1);
    for(var i = 0;i<50;i++){
	holeEmitter.addParticle();
    }


    //Fill the area with particles to start with
    for(var i = 0;i<50;i++){
	electronEmitter.particles[i].position = createVector(random(Points[1].position.x-5,width/2),random(Points[0].position.y+10,Points[2].position.y-10));
	electronEmitter.particles[i].velocity = createVector(0,random(-0.5,0.5));
	holeEmitter.particles[i].position = createVector(random(Points[0].position.x+5,width/2),random(Points[0].position.y+10,Points[2].position.y-10));
	holeEmitter.particles[i].velocity = createVector(0,random(-0.5,0.5));
    }

    //Button
    var polarity = createButton('Polarity')
    polarity.position(width/2-40,height-30)
    polarity.mousePressed(reversePolarity)
}

function draw(){
    
    background(50);
    //Non Interactive Elements
    
    fill(255,0,0,photons.length*5)
    arc(width/2, height/2, 410, 410, QUARTER_PI/2, PI+HALF_PI+QUARTER_PI+QUARTER_PI/2, CHORD);
   // ellipse(width/2,height/2,410,410)
    fill(125,125,125)
    rect(Points[0].position.x,height/2+10,-200,-10)
    rect(Points[1].position.x,height/2+10,+150,-10)
    fill(50,255,0,100);
    rect(Points[0].position.x,Points[0].position.y,150,100);
    fill(50,0,255,100);
    rect(Points[1].position.x,Points[1].position.y,-150,100);
    //START TEXT//
    textSize(18);
    textAlign(CENTER)
    stroke(white)
    fill(white)
    text('ANODE (+ve)',100,height/2)
    text('CATHODE (-ve)',width-100,height/2)
    //END TEXT//

    //Display the points
    for(var i = 0;i < Points.length;i++){
	Points[i].display(white);
    }
    //Display the lines for collision
    strokeWeight(3)
    for(var i = 0; i < Lines.length; i++){
	Lines[i].display(white);
    }
    strokeWeight(1)
    electronEmitter.run();
    holeEmitter.run();

    //Deal with particle collisions
    destroy()

    //deal with light emiision
    for(var i = photons.length-1; i > 0; i--){
	photons[i].update()
	photons[i].display()
	if(photons[i].position.x < 0 || photons[i].position.x > width  || photons[i].position.y > height || photons[i].position.y < 0){
	    photons.splice(i,1);
	}
    }
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
var Emitter = function(x_position, y_position,colour,voltage,charge){
    this.origin = createVector(x_position,y_position);
    this.colour = colour;
    this.particles = [];
    this.voltage = voltage;
    this.charge = charge;
}

//Method to add particles
Emitter.prototype.addParticle = function(){
    this.particles.push(new Particle(this.origin,this.colour,this.voltage,this.charge))
}

//Method to start emitter
Emitter.prototype.run = function(){
    for(var i = this.particles.length -1; i>=0; i--){
	var p = this.particles[i];
	p.run();
	if(p.isDead()==true){
	    this.particles.splice(i,1);
	    this.addParticle();
	}
    }
}

//Class for particles
var Particle = function(position,colour,voltage,charge){
    this.acceleration = createVector(voltage,random(-voltage,voltage));
    this.velocity = createVector(random(0,0),random(-3,3));
    this.width = createVector(0,random(-45,45));
    this.position = p5.Vector.add(position,this.width);
    this.lifespan = 100;
    this.radius = 5
    this.colour = colour;
    this.charge = charge;
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
    this.acceleration = voltage * this.charge;
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
    if(this.position.x > Points[1].position.x || this.position.x < Points[0].position.x  || this.position.y > Points[3].position.y || this.position.y < Points[0].position.y){
	isDead = true	
    }
    return isDead
}

//Method to check possible collision
Particle.prototype.possCollision = function(){
    if(this.colour == yellow){
	return;
    }
    for(var i = 0; i < Lines.length; i++){
	if(this.position.x > (Lines[i].UpperLeft.x - this.radius) && this.position.x < (Lines[i].LowerRight.x + this.radius)){
	    if(this.position.y > (Lines[i].UpperLeft.y -this.radius) && this.position.y < Lines[i].LowerRight.y + this.radius){
	    this.collision(Lines[i]);
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
    var shortestDistance = p5.Vector.sub(this.position,closest)
    if((this.radius*this.radius) > (p5.Vector.dot(shortestDistance,shortestDistance))){
	VelocityLine = p5.Vector.mult(lineSegment.Normalised,(p5.Vector.dot(lineSegment.Normalised,this.velocity)));
	VelocityNorm = p5.Vector.mult(shortestDistance.normalize(),(p5.Vector.dot(shortestDistance.normalize(),this.velocity)));
	
	//Inelastic Collision
	VelocityNorm.mult(-0.5)
	//VelocityLine.mult(0.5)
	
	this.velocity = p5.Vector.add(VelocityLine,VelocityNorm)
	this.position.add(this.velocity)
    }
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

//MOUSE EVENTS//

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
	if(mouseX > (point.position.x - point.radius) && mouseX < (point.position.x + point.radius) && mouseY < (point.position.y + point.radius) && mouseY > (point.position.y - point.radius)){
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

//Collision of particles
function destroy(){
    for(var i = electronEmitter.particles.length -1; i >= 0; i--){
	for(var j = holeEmitter.particles.length -1; j >= 0; j--){
	    if(electronEmitter.particles[i].position.x < holeEmitter.particles[j].position.x + 15 &&
	       electronEmitter.particles[i].position.x > holeEmitter.particles[j].position.x - 15 &&
	       electronEmitter.particles[j].position.y < holeEmitter.particles[j].position.y + 15 &&
	       electronEmitter.particles[j].position.y > holeEmitter.particles[j].position.y - 15){
		photons.push(new Particle(electronEmitter.particles[i].position,yellow,0,0))
		photons[photons.length - 1].velocity.x=0;
		photons[photons.length - 1].velocity.y=10;
		if(photons.length % 2 == 0){
		    photons[photons.length - 1].velocity.y=-10;
		}
		photons[photons.length - 1].radius=2; 
		electronEmitter.particles.splice(i,1);
		holeEmitter.particles.splice(j,1);
		electronEmitter.addParticle();
		holeEmitter.addParticle();
		fill(255,255,0)
		star(electronEmitter.particles[i].position.x,electronEmitter.particles[i].position.y, 5, 10, 5); 
//		ellipse(electronEmitter.particles[i].position.x,electronEmitter.particles[i].position.y,30,30)
	    }
	}
    }
}
function reversePolarity(){
    voltage = -voltage
}
function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
    endShape(CLOSE);
}
