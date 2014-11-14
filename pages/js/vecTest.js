var system;
var resistance

function setup(){
    frameRate = 60;
    createCanvas(820,400);
    emitter = new ParticleEmitter(createVector(50,125));
    //Arrays to hold all the point vectors
    pointsUpper = [];
    pointsLower = [];
    //Add in points to draw resistor and wire upper line
    pointsUpper.push(createVector(-50,50));
    pointsUpper.push(createVector(200,50));
    pointsUpper.push(createVector(300,100));
    pointsUpper.push(createVector(500,100));
    pointsUpper.push(createVector(600,50));
    pointsUpper.push(createVector(700,50));
    //Add in points to draw resistor and wire lower line
    pointsLower.push(createVector(-50,200));
    pointsLower.push(createVector(200,200));
    pointsLower.push(createVector(300,150));
    pointsLower.push(createVector(500,150));
    pointsLower.push(createVector(600,200));
    pointsLower.push(createVector(700,200));
    //Create a resistor slider
    resistance = createSlider(51,125,100);
    resistance.position(30,30)
};

function draw(){
    background(50);
    stroke(255)
    strokeWeight(5)
    //Set points to change with slider
    pointsUpper[2].y = resistance.value();
    pointsUpper[3].y = resistance.value();
    pointsLower[2].y = 250 - resistance.value();
    pointsLower[3].y = 250 - resistance.value();
    for(i=0;i<pointsUpper.length-1;i++){
	line(pointsUpper[i].x,pointsUpper[i].y,pointsUpper[i+1].x,pointsUpper[i+1].y)
	line(pointsLower[i].x,pointsLower[i].y,pointsLower[i+1].x,pointsLower[i+1].y)
    };
    emitter.addParticle();
    emitter.run();
};

var ParticleEmitter = function(position){
    this.origin = position.get()
    this.particles = [];
};

var Particle = function(position){
    this.acceleration = createVector(0.2,0);
    this.velocity = createVector(1,0);
    this.position = position.get();
    this.position.y = random(190,60);
    this.energy = 255.0;
};

Particle.prototype.run = function(){
    this.update();
    this.display();
    this.energy --;
};

Particle.prototype.update = function(){
    if(checkCollision(this.position) == true){
	this.energy = 0
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
};

Particle.prototype.display = function(){
    this.radius = 3
    noStroke();
    fill(255,255-this.energy,255-this.energy);
    ellipse(this.position.x,this.position.y,6,6);
};

Particle.prototype.isDead = function(){
    if (this.energy < 0){
	return true;
    }
    else{
	return false;
    }
};

ParticleEmitter.prototype.addParticle = function(){
    this.particles.push(new Particle(this.origin));
};

ParticleEmitter.prototype.run = function(){
    for (var i = this.particles.length -1; i >=0; i--){
	this.particles[i].run()
	if (this.particles[i].isDead()){
	    this.particles.splice(i,1);
	}
    }
};

function checkCollision(p){
    var bounce = false;
    var P1C = createVector(p.x - pointsUpper[1].x,p.y - pointsUpper[1].y);
    var normal = createVector((pointsUpper[2].y - pointsUpper[1].y),(pointsUpper[2].x - pointsUpper[1].x))
    var distance = P1C.x * normal.x + P1C.y * normal.y
    if(distance < 3){
	console.log(distance)
	bounce = true
    }
}
