var I = '?';
var R = '?';
var V = '?';
var showV = true;
var showR = true;
var showI = true;
var resistors = [10,12,15,18,22,27,33,39,47,56,68,82]
var multiplier = [1,10,100,1000]


function setup(){
    frameRate = 60
    createCanvas(600,350);
    var btn = createButton('Get Values')
    btn.position(260,175)
    btn.mousePressed(getValues)
}

function draw(){
    background(50);
    textSize(24);
    stroke(255)
    noFill()
    strokeWeight(4)
    line(305,60,305,90)
    strokeWeight(2)
    line(295,50,295,100)
    line(305,75,500,75)
    line(500,75,500,275)
    line(500,275,350,275)
    rect(250,260,100,30)
    line(250,275,100,275)
    line(100,275,100,75)
    line(100,75,295,75)
    text('+',280,115)
    text('-',305,115)
    fill(255)
    textAlign(CENTER)
    if(showV == true){
	text(V,300,35)
    }
    if(showR == true){
	text(R,300,282)
    }
    textAlign(LEFT)
    if(showI == true){
	text(I,510,175)
    }
   
}

function getValues(){
    showV = true;
    showR = true;
    showI = true;
    var Current = 0
    var choice = floor(random(3))
    if(choice == 0){
	showV = false;
    }
    else if(choice == 1){
	showR = false;
    }
    else{
	showI = false;
    }
    if(showI == true){
	while(Current<0.01){
	    var Resistance = resistors[floor(random(resistors.length))]*multiplier[floor(random(multiplier.length))]
	    var Voltage = floor(random(2,24))
	    Current = Voltage/Resistance
	}
    }
    else{
	var Resistance = resistors[floor(random(resistors.length))]*multiplier[floor(random(multiplier.length))]
	var Voltage = floor(random(2,24))
	Current = Voltage/Resistance
    }
    if(Resistance >= 1000){
	R = Resistance/1000 + ' k\u03A9'
    }
    else{
	R = Resistance + ' \u03A9'
    }
    V = Voltage + ' V'
    I = Current.toFixed(3) + ' A'
}
