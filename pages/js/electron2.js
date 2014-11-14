var system;
var resistance;

function setup() {
    frameRate = 60;
  createCanvas(820, 400);
    system = new ParticleSystem(createVector(51,125));
    //Create the pipe
    A = createVector(-50,50);
    B = createVector(200,50);
    C = createVector(300,100);
    D = createVector(500,100);
    E = createVector(600,50);
    F = createVector(700,50);
    G = createVector(-50,200);
    H = createVector(200,200);
    I = createVector(300,150);
    J = createVector(500,150);
    K = createVector(600,200);
    L = createVector(700,200);
    resistance = createSlider(51,125,100)
    resistance.position(30,30)
}

function draw() {
    background(51);
    stroke(255)
    strokeWeight(5)
    C.y = resistance.value();
    D.y = resistance.value();
    I.y = 250 - resistance.value();
    J.y = 250 - resistance.value();
    line(A.x,A.y,B.x,B.y);
    line(B.x,B.y,C.x,C.y);
    line(C.x,C.y,D.x,D.y);
    line(D.x,D.y,E.x,E.y);
    line(E.x,E.y,F.x,F.y);
    line(G.x,G.y,H.x,H.y);
    line(H.x,H.y,I.x,I.y);
    line(I.x,I.y,J.x,J.y);
    line(J.x,J.y,K.x,K.y);
    line(K.x,K.y,L.x,L.y);
    for(var i = 0; i<5; i++){
	system.addParticle();
    }
    system.run();


}

// A simple Particle class
var Particle = function(position) {
    this.acceleration = createVector(0.2, 0);
    this.velocity = createVector(random(0,1), random(-1, 0));
    this.position = position.get();
    //give the praticle a random y position on creation
    this.position.y += random(-74,74)
    this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position and handle collisions
Particle.prototype.update = function(){

    if(this.position.x > B.x && this.position.x < C.x){//in first Trap
	if(inTrapezium(this.position,B,C,I,H) == false){
	    /* this.velocity.x = random(-5,-10)
	       this.velocity.y = - this.velocity.y
	       this.lifespan -= 10;*/
	    //console.log(this.velocity)
	    this.velocity = calcReflection(this.velocity,B,C).mult(-1)
	    if(this.position.y > 125){
		this.position.x -= 2
		this.position.y -= 2
		this.velocity = this.velocity.mult(-1)
	    }

	}
    }
    else if(this.position.x > D.x && this.position.x < E.x){//in first Trap
	if(inTrapezium(this.position,D,E,K,J) == false){
	    this.velocity = calcReflection(this.velocity,B,C).mult(-1)
	    if(this.position.y > 125){
		this.position.x += 2
		this.position.y -= 2
	    }

	}
    }
    else if(this.position.x > A.x && this.position.x < B.x){//in first Rect
	if(inRect(this.position,A,B,H,G) == false){
	    this.velocity.y = - this.velocity.y;
	    this.lifespan -= 10;
	}
    }

    else if(this.position.x > C.x && this.position.x < D.x){//in second Rect
	if(inRect(this.position,C,D,J,I) == false){
	    this.velocity.y = - this.velocity.y;
	    this.lifespan -= 10;
	}
    }
    else if(this.position.x > E.x && this.position.x < F.x){//in second Rect
	if(inRect(this.position,E,F,L,K) == false){
	    this.velocity.y = - this.velocity.y;
	    this.energy = this.energy - 1;
	}
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

};

// Method to display
Particle.prototype.display = function() {
    stroke(255,255-this.lifespan,255- this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 6, 6);
};

/* Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};
*/
//Kill the particle on exit of the wire
Particle.prototype.isDead = function(){
    if(this.position.x > 700 || this.position.y<A.y || this.position.y>G.y){
	return true;
    }
    else{
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


function calculateNormal(a,b){
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    magnitude = Math.sqrt(dx * dx + dy * dy)
    var reflection = [dy/magnitude,-dx/magnitude];
    return reflection
}

function calcReflection(p,a,b){
    var normArray = calculateNormal(a,b);
    var dotProduct = (p.x*normArray[0]+p.y*normArray[1])
    var result = [2*dotProduct*normArray[0],2*dotProduct*normArray[1]]
    p.x = result[0] - p.x
    p.y = result[1] -p.y
    return p
}


//    R = 2 * (V dot N)* N - V
//r = a - 2<a, n> n
    
