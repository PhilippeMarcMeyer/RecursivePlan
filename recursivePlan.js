
var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	baseY : 100, // half radius
	mode : "P2D",
	angleOffset : 0.2,
	soilAngle : Math.PI/4,
	plantColor : 255,
	backgroundColor : 0,
	soilColor:"#44aa66",
	soilPoints : [],
	baseTrunkSize : 32,
	treeLines : [],
	maxIter : 12,
	fr : 25,
	bg : null,
	drawDelay:50,
	nrPtsByDepth : [],
	weight : [
	  6,5,4,3,2,1,1,1,1,1,1,1,1,1,1,1,1
	],
	colors :[
		{r:116,g:73,b:73},
		{r:128,g:64,b:64},
		{r:154,g:78,b:78},
		{r:172,g:89,b:89},
		{r:187,g:106,b:102},
		{r:197,g:137,b:92},
		{r:197,g:137,b:92},
		{r:68,g:146,b:46},
		{r:68,g:146,b:46},
		{r:87,g:186,b:58},
		{r:255,g:108,b:108},
		{r:255,g:255,b:255},
		{r:255,g:255,b:255},
		{r:255,g:255,b:255},
		{r:255,g:255,b:255}
	],	
	fills :[
		"#aaa",
		"#aaa",
		"#bbb",
		"#bbb",
		"#ccc",
		"#ccc",
		"#ddd",
		"#ddd",
		"#eee",
		"#eee",
		"#fff",
		"#fff",
		"#fff",
		"#fff",
		"#fff",
	],
	stop:false
};

function setup() {
    var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
	var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
    calculateSoil();
	calculateTree(globals.maxIter);
	
	globals.bg = createGraphics(globals.mainWidth,globals.mainHeight);
	
	var r = 70;
	var g = 91;
	var b = 236;
	
	var r2 = 254;
	var g2 = 186;
	var b2 = 167;
	
	var diffr = r2 - r;	
	var diffg = g2 - g;	
	var diffb = b2 - b;
	
	var minDiff = min([abs(diffr),abs(diffg),abs(diffb)]);
	
	diffr = diffr / minDiff;	
	diffg = diffg / minDiff;
	diffb = diffb / minDiff;
	
	var diagonal = Math.floor(Math.sqrt(globals.mainWidth*globals.mainWidth+globals.mainHeight*globals.mainHeight));
	var weight  = Math.floor(diagonal / minDiff);
	
	for(var i = minDiff ;i > 0;i--){
	    
		size = i * weight;

		var r3 = Math.floor(r + diffr*i);
		var g3 = Math.floor(g + diffg*i);
		var b3 = Math.floor(b + diffb*i);
		
		globals.bg.stroke(r3,g3,b3);
		globals.bg.fill(r3,g3,b3);
		globals.bg.ellipse(0, 0, size, size);
	}
}


function drawSky(){
	var r2 = 10;
	var g2 = 0;
	var b2 = 120;
	
	var r = 120;
	var g = 0;
	var b = 70;
	
	var diffr = r2 - r;	
	var diffg = g2 - g;	
	var diffb = b2 - b;
	
	var minDiff = min([abs(diffr),abs(diffb)]) /2; //,abs(diffg)
	
	diffr = diffr / minDiff;	
	diffg = 0;
	diffb = diffb / minDiff;
	
	var diagonal = Math.floor(Math.sqrt(globals.mainWidth*globals.mainWidth+globals.mainHeight*globals.mainHeight));
	var weight  = Math.floor(diagonal / minDiff) *2.2;
	
	for(var i = minDiff ;i > 0;i--){
	    
		size = i * weight;

		var r3 = Math.floor(r + diffr*i);
		var g3 = Math.floor(g + diffg*i);
		var b3 = Math.floor(b + diffb*i);
		
		stroke(r3,g3,b3,100);
		fill(r3,g3,b3,100);
		ellipse(0, 0, size, size*1.5);
	}
}


	
	

function draw() {
	if(!globals.stop){
		background(0);	
	
			translate(0,0);

			drawSky();
			translate(globals.mainWidth/2,globals.mainHeight/2 + globals.baseY);
		   
		
	if(frameCount>globals.drawDelay){
			drawSoil();
			drawTree(frameCount-globals.drawDelay);
		}
	}
}

function calculateSoil(){
	var xoff = 0;
	var yoff = 0;
	globals.soilPoints = [];
	var nrPoints = Math.floor(globals.mainWidth*1.5 / 10);
	for(var i = 0 ; i < nrPoints; i++){
		globals.soilPoints.push({
			x : -240 + i * 10 + map(noise(xoff), 0, 1, -6, 6),
			y : map(noise(yoff), 0, 1, -4, 4)
		});
		  xoff += 0.15;
		  yoff += 0.4;
	}
	globals.soilPoints.push({
			x : 480,
			y : 0
	});
}

function drawSoil(){
	stroke(255,255,255,96);
	for(var i = 0 ; i < globals.soilPoints.length-1; i++){
		if(globals.soilPoints[i+1].x < -15 || globals.soilPoints[i].x > 10){
		line(globals.soilPoints[i].x, globals.soilPoints[i].y,globals.soilPoints[i+1].x, globals.soilPoints[i+1].y);
		}
	}
}

function calculateTree(maxRounds){
	globals.treeLines.length = 0;
	var round = 0;
	var start = {x:0,y:30};
	calculateBranch(0,maxRounds,start,PI/2);
}

function calculateBranch(round,maxRounds,start,angle){
	var branch = {round : round,start : start};
	var len = globals.baseTrunkSize;
	var ratio = Math.pow(0.9,round+1);
	var end = {};
	len = Math.floor(ratio * len * random(0.8,1.3) +0.5);
	end.x = start.x+cos(angle)*len;
	end.y = start.y-sin(angle)*len;
	branch.end = end;
	branch.len = len;
	globals.treeLines.push(branch);
	round ++;
	if(round < maxRounds){
		calculateBranch(round,maxRounds,end,angle+0.2);
		calculateBranch(round,maxRounds,end,angle-0.2);
	}
}


function drawTree(fcount){
	stroke(255);
	depth = Math.round(fcount / 10);
		if(depth > globals.maxIter) {
			depth = globals.maxIter;
			globals.stop = true;
		}
	var round = 0;
	while(round <= depth){
		var tree = globals.treeLines.filter(function(x){
			return x.round == round;
		});
		var diff = depth - round;
		var weight = globals.weight[round];
		
		if(weight > depth) weight = depth+1;
		fill(globals.colors[round].r,globals.colors[round].g,globals.colors[round].b,100);
		stroke(globals.colors[round].r,globals.colors[round].g,globals.colors[round].b,95);
		
		tree.forEach(function(dash,i){
			if(diff > 4)
			 perlinLine(dash,weight,globals.colors[round]);
		 else
			 line(dash.start.x,dash.start.y,dash.end.x,dash.end.y);

		});
		round++;
	}
}

function perlinLine(dash,weight,rgb){
	
	var xoff = 0; 
	
	var nrPoints = dash.len;

	var xDiff = dash.end.x - dash.start.x ;
	var yDiff = dash.end.y - dash.start.y ;
	var len = Math.floor(Math.sqrt(xDiff*xDiff + yDiff*yDiff));
	xDiff = xDiff/len;
	yDiff =  yDiff/len;
	
	var x = dash.start.x;
	var y = dash.start.y;
	var extra = dash.round == 0 ? weight : 0;
	
	for(var i = 0; i < nrPoints;i++){
		 y+= yDiff;
		if(i%3==57){
		   x+= map(noise(xoff), 0, 1, xDiff-extra, xDiff+extra);
		}else{
			x+= xDiff;
		}
		ellipse(x,y,weight+extra+1,weight+extra);
		xoff += 0.04;
		if(extra > 0 && i% 3 == 0) extra--;
	}
	ellipse(dash.end.x,dash.end.y,weight,weight);
}

