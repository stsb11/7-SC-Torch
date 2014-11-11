var system;

function setup() {
  createCanvas(820, 400);
    system = new ParticleSystem(createVector(50,200));
    mainWire = new HorizontalWire(20,100,200,100,100,50);
}

function draw() {
    background(51);
    pipe()
    mainWire.draw()
    system.addParticle();
    system.run();
}

var HorizontalWire = function(startX,startY,endX,endY,widthStart,widthEnd){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.widthStart = widthStart;
    this.widthEnd = widthEnd;
}


HorizontalWire.prototype.draw = function(){
    stroke(255);
    line(this.startX,this.startY-this.widthStart/2,this.endX,this.endY-this.widthEnd/2);
    line(this.startX,this.startY+this.widthStart/2,this.endX,this.endY+this.widthEnd/2);
}

function sameSide(electron,wire,c){
    (


function pipe(){
    stroke(255)
    strokeWeight(6)
    line(50,176,700,176)
    line(50,224,700,224)
}
// A simple Particle class
var Particle = function(position) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(5, 5), random(-1, 0));
    this.position = position.get();
    //give the praticle a random y position on creation
    this.position.y += random(-20,20)
    this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position and handle collisions
Particle.prototype.update = function(){
    this.velocity.add(this.acceleration);

    if(this.position.y > 220 || this.position.y < 180){
	this.velocity.y = this.velocity.y * -1
    }
    this.position.add(this.velocity);
    this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
    stroke(255,255-this.lifespan,255- this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 6, 6);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

//set the origin of the generator and intitiate the particle list
var ParticleSystem = function(position) {
  this.origin = position.get();
  this.particles = [];
};

//Add a particle to the array of paricles
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};
