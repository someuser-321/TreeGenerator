var slider_y;
var slider_level;
var slider_rot;
var slider_lenRand;
var slider_branchProb;
var slider_rotRand;
var slider_leafProb;

var button_seed;
var button_newSeed;
var button_randomParams;

var label_y;
var label_level;
var label_rot;
var label_lenRand;
var label_branchProb;
var label_rotRand;
var label_leafProb;
var label_perf;
var label_seed;

var input_seed;

var y;
var maxLevel;
var rot;
var lenRand
var branchProb;
var rotRand;
var leafProb;

var prog = 1;
var growing = false;
var isFullScreen = false;

var randSeed = 80;
var paramSeed = Math.floor(Math.random()*1000);

function setup()
{	
	createCanvas(window.innerWidth, window.innerHeight);
	
	slider_y = createSlider(100, 200, /mobile/i.test(window.navigator.userAgent) ? 100 : 150, 1);
	slider_y.position(10, 10);
	slider_level = createSlider(1, 13, 11, 1);
	slider_level.position(10, 30);
	slider_rot = createSlider(0, PI/2, (PI/2) / 4, (PI/2) / (3 * 5 * 8));
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

	
	label_y = createSpan('Size');
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
	
	label_seed = createSpan('Seed:');
	label_seed.position(10, 162);
	
	input_seed = createInput(randSeed);
	input_seed.position(50, 160);
	input_seed.style('width', '50px')
	
	button_seed = createButton('Watch it grow!');
	button_seed.position(110, 160);
	button_seed.mousePressed(function() {
		randSeed = input_seed.value();
		startGrow();
	});
	
	button_newSeed = createButton("Generate new tree");
	button_newSeed.position(10, 190);
	button_newSeed.mousePressed(function(){
		randSeed = Math.floor(Math.random() * 1000);
		prog = 100;
		input_seed.value(randSeed);
		startGrow();
	});
	
	button_randomParams = createButton("Randomise parameters");
	button_randomParams.position(10, 220);
	button_randomParams.mousePressed(function(){
		randomSeed(paramSeed);
		
		slider_level.value(1 * slider_level.value() + 0.1 * rand2() * (slider_level.attribute('max') - slider_level.attribute('min')));
		slider_rot.value(1 * slider_rot.value() + 0.1 * rand2() * (slider_rot.attribute('max') - slider_rot.attribute('min')));
		slider_lenRand.value(1 * slider_lenRand.value() + 0.1 * rand2() * (slider_lenRand.attribute('max') - slider_lenRand.attribute('min')));
		slider_branchProb.value(1 * slider_branchProb.value() + 0.1 * rand2() * (slider_branchProb.attribute('max') - slider_branchProb.attribute('min')));
		slider_rotRand.value(1 * slider_rotRand.value() + 0.1 * rand2() * (slider_rotRand.attribute('max') - slider_rotRand.attribute('min')));
		slider_leafProb.value(1 * slider_leafProb.value() + 0.1 * rand2() * (slider_leafProb.attribute('max') - slider_leafProb.attribute('min')));
		
		paramSeed = 1000 * random();
		randomSeed(randSeed);
		
		readInputs(true);
	});
	
	label_perf = createSpan('Generated in #ms');
	label_perf.position(10, 250);
	label_perf.style('display', 'none');
	
	
	mX = mouseX;
	mY = mouseY;
	panX = 0;
	panY = 0;
	
	readInputs(false);
	startGrow();
}

function readInputs(updateTree)
{
	y = slider_y.value();
	maxLevel = slider_level.value();
	rot = slider_rot.value();
	lenRand = slider_lenRand.value();
	branchProb = slider_branchProb.value();
	rotRand = slider_rotRand.value();
	leafProb = slider_leafProb.value();
	
	if ( updateTree && !growing )
	{
		prog = maxLevel + 1;
		loop();
	}
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
	var startTime = millis();

	stroke(255, 255, 255);
	
	background(0, 0, 0);
	translate(width / 2, height);
	scale(1, -1);
	
	translate(0, 20);
	
	branch(1, randSeed);
	
	var endTime = millis();
	label_perf.html('Generated in ' + Math.floor((endTime-startTime) * 10) / 10 + 'ms');
	
	noLoop();
}

function branch(level, seed)
{
	if ( prog < level )
		return;
	
	randomSeed(seed);
	
	var seed1 = random(1000),
		seed2 = random(1000);
		
	var growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);
	
	strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

	var len = growthLevel * y * (1 + rand2() * lenRand);
	
	line(0, 0, 0, len / level);
	translate(0, len / level);
	
	
	var doBranch1 = rand() < branchProb;
	var doBranch2 = rand() < branchProb;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + rand2() * rotRand);
		var r2 = -rot * (1 + rand2() * rotRand);
		
		if ( doBranch1 )
		{
			push();
			rotate(r1);
			branch(level + 1, seed1);
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(r2);
			branch(level + 1, seed2);
			pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		var p = Math.min(1, Math.max(0, prog - level));
		
		var flowerSize = (y / 100) * p * (1 / 6) * (len / level);

		strokeWeight(1);
		stroke(240 + 15 * rand2(), 140 + 15 * rand2(), 140 + 15 * rand2());
		
		rotate(-PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
			rotate(2 * PI/8);
		}
	}	
}

function startGrow()
{
	growing = true;
	prog = 1;
	grow();
}

function grow()
{
	if ( prog > (maxLevel + 3) )
	{
		prog = maxLevel + 3;
		loop();
		growing = false;
		return;
	}
	
	var startTime = millis();
	loop();
	var diff = millis() - startTime;

	prog += maxLevel / 8 * Math.max(diff, 20) / 1000;
	setTimeout(grow, Math.max(1, 20 - diff));
}


function rand()
{
	return random(1000) / 1000;
}

function rand2()
{
	return random(2000) / 1000 - 1;
}