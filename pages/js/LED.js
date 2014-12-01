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
    frameRate = 30
    colorMode(RGB, 255)
    red = color(255,0,0);
    green = color(0,255,0);
    blue = color(125, 249, 255)
    white = color(255)
    createCanvas(600,300);
    //Set up points for LED
    Points.push(new Point(0,150,0),
		new Point(100,150,0),
		new Point(100,100,4),
		new Point(500,100,3),
		new Point(500,150,2),
		new Point(600,150,1),
		
		new Point(0,150,0),
		new Point(100,150,0),
		new Point(100,200,0),
		new Point(500,200,0),
		new Point(500,150,0),
		new Point(600,150,0)
	       );
    //Set up lines for LED
    Lines.push(new Line(Points[0],Points[1]),
 	       new Line(Points[1],Points[2]),
	       new Line(Points[2],Points[3]),
	       new Line(Points[3],Points[4]),
	       new Line(Points[4],Points[5]),
	       new Line(Points[6],Points[7]),
 	       new Line(Points[7],Points[8]),
	       new Line(Points[8],Points[9]),
	       new Line(Points[9],Points[10]),
	       new Line(Points[10],Points[11])
	      );
    
    //Add an electron emitter
    electronEmitter = new Emitter(495,150,blue,-voltage,-1);
    for(var i = 0;i<50;i++){
	electronEmitter.addParticle();
    }

    //Add a hole emitter
    holeEmitter = new Emitter(105,150,red,voltage,+1);
    for(var i = 0;i<50;i++){
	holeEmitter.addParticle();
    }


    //Fill the area with particles to start with
    for(var i = 0;i<50;i++){
	electronEmitter.particles[i].position = createVector(random(300,480),random(110,190))
	electronEmitter.particles[i].velocity = createVector(0,random(-0.5,0.5))
	holeEmitter.particles[i].position = createVector(random(120,300),random(110,190))
	holeEmitter.particles[i].velocity = createVector(0,random(-0.5,0.5))
    }

    //Button
    var polarity = createButton('Polarity')
    polarity.position(300,280)
    polarity.mousePressed(reversePolarity)
}

function draw(){
    
    background(50);
    
    //START TEXT//
    textSize(18);
    textAlign(CENTER)
    stroke(white)
    fill(white)
    //END TEXT//

    //Display the points
    for(var i = 0;i < Points.length;i++){
	Points[i].display(white);
    }
    //Display the lines
    for(var i = 0; i < Lines.length; i++){
	Lines[i].display(white);
    }
    
    electronEmitter.run();
    holeEmitter.run();

    //Deal with particle collisions
    destroy()

    //deal with light emiision
    for(var i = photons.length-1; i > 0; i--){
	photons[i].update()
	photons[i].display()
	if(photons[i].position.x < 0 || photons[i].position.x > 600  || photons[i].position.y > 300 || photons[i].position.y < 0){
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
    if(this.position.x > width || this.position.x < 0  || this.position.y > 200 || this.position.y < 100){
	isDead = true
    }
    return isDead
}

//Method to check possible collision
Particle.prototype.possCollision = function(){
    if(this.colour == green){
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
	    if(electronEmitter.particles[i].position.x < holeEmitter.particles[j].position.x + 10 &&
	       electronEmitter.particles[i].position.x > holeEmitter.particles[j].position.x - 10 &&
	       electronEmitter.particles[j].position.y < holeEmitter.particles[j].position.y + 10 &&
	       electronEmitter.particles[j].position.y > holeEmitter.particles[j].position.y - 10){
		photons.push(new Particle(electronEmitter.particles[i].position,green,0,0))
		photons[photons.length - 1].velocity.x=0;
		photons[photons.length - 1].velocity.y=10;
		if(photons.length % 2 == 0){
		    photons[photons.length - 1].velocity.y=-10;
		}
		photons[photons.length - 1].radius=1; 
		electronEmitter.particles.splice(i,1);
		holeEmitter.particles.splice(j,1);
		electronEmitter.addParticle();
		holeEmitter.addParticle();
	    }
	}
    }
}
function reversePolarity(){
    voltage = -voltage
}
