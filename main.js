var slider_y;
var slider_level;
var slider_rot;
var slider_lenRand;
var slider_branchProb;
var slider_rotRand;
var slider_leafProb;

var button_newSeed;
var button_grow;

var label_y;
var label_level;
var label_rot;
var label_lenRand;
var label_branchProb;
var label_rotRand;
var label_leafProb;
var label_perf;

var y;
var maxLevel;
var rot;
var lenRand
var branchProb;
var rotRand;
var leafProb;

var prog = 1;
var randSeed = 80;

function setup()
{
	createCanvas(window.innerWidth, window.innerHeight);
	
	slider_y = createSlider(0, 200, 150, 1);
	slider_y.position(10, 10);
	slider_level = createSlider(1, 16, 11, 1);
	slider_level.position(10, 30);
	slider_rot = createSlider(0, PI/2, (PI/2)/4, (PI/2)/(2*3*4*6*8*10));
	slider_rot.position(10, 50);
	slider_lenRand = createSlider(0, 1, 1, 0.01);
	slider_lenRand.position(10, 70);
	slider_branchProb = createSlider(0, 1, 0.9, 0.01);
	slider_branchProb.position(10, 90);
	slider_rotRand = createSlider(0, 1, 0.1, 0.01);
	slider_rotRand.position(10, 110);
	slider_leafProb = createSlider(0, 1, 0.5, 0.01);
	slider_leafProb.position(10, 130);
	
	slider_y.input(function(){readInputs(true)});
	slider_level.input(function(){readInputs(true)});
	slider_rot.input(function(){readInputs(true)});
	slider_lenRand.input(function(){readInputs(true)});
	slider_branchProb.input(function(){readInputs(true)});
	slider_rotRand.input(function(){readInputs(true)});
	slider_leafProb.input(function(){readInputs(true)});
	
	button_newSeed = createButton("Generate new tree");
	button_newSeed.position(10, 160);
	button_newSeed.mousePressed(function(){randSeed = Math.floor(Math.random()*1000); loop()});
	button_grow = createButton("Grow!");
	button_grow.position(10, 190);
	button_grow.mousePressed(startGrow);
	
	label_y = createSpan('Branch length');
	label_y.position(150, 10);
	label_level = createSpan('Recursion level');
	label_level.position(150, 30);
	label_rot = createSpan('Split angle');
	label_rot.position(150, 50);
	label_lenRand = createSpan('Length variation');
	label_lenRand.position(150, 70);
	label_branchProb = createSpan('Split probability');
	label_branchProb.position(150, 90);
	label_rotRand = createSpan('Split rotation variation');
	label_rotRand.position(150, 110);
	label_leafProb = createSpan('Flower probability');
	label_leafProb.position(150, 130);
	
	label_perf = createSpan('Generated in #ms');
	label_perf.position(10, 220);
	
	mX = mouseX;
	mY = mouseY;
	panX = 0;
	panY = 0;
	
	readInputs(true);
}

function readInputs(updateTree)
{
	y = slider_y.value();
	maxLevel = slider_level.value();
	prog = maxLevel + 1;
	rot = slider_rot.value();
	lenRand = slider_lenRand.value();
	branchProb = slider_branchProb.value();
	rotRand = slider_rotRand.value();
	leafProb = slider_leafProb.value();
	
	if ( updateTree )
		loop();
}

function draw()
{
	var startTime = millis();

	stroke(255, 255, 255);
	
	background(0, 0, 0);
	translate(width/2, height);
	scale(1, -1);
	
	translate(0, 50);
	
	branch(1, randSeed);
	
	var endTime = millis();
	label_perf.html('Generated in ' + Math.floor((endTime-startTime)*10)/10 + 'ms');
	
	noLoop();
}

function branch(level, seed)
{
	if ( prog < level )
		return;
	
	randomSeed(seed);
	
	var seed1 = random(1000),
		seed2 = random(1000);
		
	var growthLevel = (prog - level > 1) || (prog >= maxLevel+1) ? 1 : (prog - level);
	
	strokeWeight(12 * Math.pow((maxLevel-level+1)/maxLevel, 2));

	var len = growthLevel * y * (1 + (2*(rand()-0.5) * lenRand));
	
	line(0, 0, 0, len/level);
	translate(0, len/level);
	
	
	var doBranch1 = rand() < branchProb;
	var doBranch2 = rand() < branchProb;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + 2*(rand()-0.5) * rotRand);
		var r2 = -rot * (1 + 2*(rand()-0.5) * rotRand);
		
		if ( doBranch1 )
		{
			push();
			rotate(r1);
			branch(level+1, seed1);
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(r2);
			branch(level+1, seed2);
			pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		var p = Math.min(1, Math.max(0, prog - level));
		
		var flowerSize = p*(1/6)*(len/level);

		strokeWeight(1);
		rotate(-PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			line(0, 0, 0, flowerSize);
			rotate(2*PI/8);
		}
	}	
}

function startGrow()
{
	prog = 1;
	grow();
	
}

function grow()
{
	if ( prog > (maxLevel + 3) )
	{
		prog = maxLevel + 3;
		loop();
		return;
	}
	
	var startTime = millis();
	loop();
	var diff = millis() - startTime;

	prog += maxLevel / 8 * Math.max(diff, 20) / 1000;
	setTimeout(grow, Math.max(1, 20-diff));
}


function rand()
{
	return random(1000)/1000;
}