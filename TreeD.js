var slider_size,
	slider_level,
	slider_rot,
	slider_lenRand,
	slider_branchProb,
	slider_rotRand,
	slider_flowerProb;

var button_seed,
	button_newSeed,
	button_randomParams,
	button_change;

var label_size,
	label_level,
	label_rot,
	label_lenRand,
	label_branchProb,
	label_rotRand,
	label_flowerProb,
	label_perf,
	label_seed,
	label_source,
	label_source2;

var input_seed,
	size,
	maxLevel,
	rot,
	lenRan,
	branchProb,
	rotRand,
	flowerProb;

var hide = false,
	prog = 1,
	growing = false,
	mutating = false,
	randSeed = 80,
	paramSeed = Math.floor(Math.random() * 1000),
	randBias = 0;
	
var mouseX_,
	mouseY_,
	rotateX_ = 0,
	rotateY_ = 0,
	zoom = 2;
	
function setup()
{	
	createCanvas(window.innerWidth, window.innerHeight, WEBGL);
	
	var fov = 60 / 180 * PI;
	var cameraZ = (height / 2) / tan(fov / 2);
	perspective(60 / 180 * PI, width / height, cameraZ * 0.1, cameraZ * 10);
	
	slider_size = createSlider(0, 1, 0.5, 0.01);
	slider_size.position(10, 10);
	slider_level = createSlider(1, 12, 10, 1);
	slider_level.position(10, 30);
	slider_rot = createSlider(0, 1, 0.125, 1 / (3 * 5 * 8));
	slider_rot.position(10, 50);
	slider_lenRand = createSlider(0, 1, 0.5, 0.01);
	slider_lenRand.position(10, 70);
	slider_branchProb = createSlider(0, 1, 0.98, 0.01);
	slider_branchProb.position(10, 90);
	slider_rotRand = createSlider(0, 1, 0.4, 0.01);
	slider_rotRand.position(10, 110);
	slider_flowerProb = createSlider(0, 1, 0.5, 0.01);
	slider_flowerProb.position(10, 130);
	
	slider_size.input(function(){readInputs(true)});
	slider_level.input(function(){readInputs(true)});
	slider_rot.input(function(){readInputs(true)});
	slider_lenRand.input(function(){readInputs(true)});
	slider_branchProb.input(function(){readInputs(true)});
	slider_rotRand.input(function(){readInputs(true)});
	slider_flowerProb.input(function(){readInputs(true)});

	
	label_size = createSpan('Size');
	label_size.position(150, 10);
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
	label_flowerProb = createSpan('Flower probability');
	label_flowerProb.position(150, 130);
	
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
	
	button_newSeed = createButton('Generate new tree');
	button_newSeed.position(10, 190);
	button_newSeed.mousePressed(function(){
		randSeed = Math.floor(Math.random() * 1000);
		prog = 100;
		input_seed.value(randSeed);
		startGrow();
	});
	
	button_randomParams = createButton('Randomise parameters');
	button_randomParams.position(10, 220);
	button_randomParams.mousePressed(function(){
		randomSeed(paramSeed);
		
		slider_level.value(1 * slider_level.value() + rand2() * slider_level.attribute('step'));
		slider_rot.value(1 * slider_rot.value() + 5 * rand2() * slider_rot.attribute('step'));
		slider_lenRand.value(1 * slider_lenRand.value() + 5 * rand2() * slider_lenRand.attribute('step'));
		slider_branchProb.value(1 * slider_branchProb.value() + 5 * rand2() * slider_branchProb.attribute('step'));
		slider_rotRand.value(1 * slider_rotRand.value() + 5 * rand2() * slider_rotRand.attribute('step'));
		slider_flowerProb.value(1 * slider_flowerProb.value() + 5 * rand2() * slider_flowerProb.attribute('step'));
		
		paramSeed = 1000 * random();
		randomSeed(randSeed);
		
		readInputs(true);
	});
	
	button_change = createButton('Enable wind');
	button_change.position(10, 250);
	button_change.mousePressed(function(){
		if ( !mutating )
		{
			button_change.html('Disable wind')
			mutateTime = millis();
			mutating = true;
			mutate();
		}
		else
		{
			button_change.html('Enable wind')
			mutating = false;
		}
	});
	
	button_hide = createButton('Hide UI (click anywhere to show again)');
	button_hide.position(10, 280);
	button_hide.mousePressed(hideUI);
	
	label_perf = createSpan('Generated in #ms');
	label_perf.position(10, 310);
	//label_perf.style('display', 'none');
	
	label_source = createA('https://github.com/someuser-321/TreeGenerator', 'Check it out on GitHub!');
	label_source.position(10, 330);
	label_source2 = createA('https://someuser-321.github.io/TreeGenerator/index.html', 'Original 2D Version');
	label_source2.position(10, 350);
	
	mouseX_ = mouseX;
	mouseY_ = mouseY;
	
	readInputs(false);
	startGrow();
}

function mouseDragged()
{
	rotateX_ += (mouseY - mouseY_) / 500;
	rotateY_ += (mouseX - mouseX_) / 500;
	
	mouseX_ = mouseX;
	mouseY_ = mouseY;
	
	loop();
	
	//return false;
}

function mouseMoved()
{
	mouseX_ = mouseX;
	mouseY_ = mouseY;
	
	return false;
}

function mouseWheel(event)
{
	zoom *= (event.delta > 0 ? 1.1 : 1 / 1.1);
	loop();
	
	return false;
}

function mouseReleased()
{
	if ( hide )
		showUI();
	hide = !hide;
}

function touchEnded()
{
	if ( hide )
		showUI();
	hide = !hide;
}

function showUI()
{
	slider_size.style('visibility', 'initial');
	slider_level.style('visibility', 'initial');
	slider_rot.style('visibility', 'initial');
	slider_lenRand.style('visibility', 'initial');
	slider_branchProb.style('visibility', 'initial');
	slider_rotRand.style('visibility', 'initial');
	slider_flowerProb.style('visibility', 'initial');

	button_seed.style('visibility', 'initial');
	button_newSeed.style('visibility', 'initial');
	button_randomParams.style('visibility', 'initial');
	button_change.style('visibility', 'initial');
	button_hide.style('visibility', 'initial');

	label_size.style('visibility', 'initial');
	label_level.style('visibility', 'initial');
	label_rot.style('visibility', 'initial');
	label_lenRand.style('visibility', 'initial');
	label_branchProb.style('visibility', 'initial');
	label_rotRand.style('visibility', 'initial');
	label_flowerProb.style('visibility', 'initial');
	label_perf.style('visibility', 'initial');
	label_seed.style('visibility', 'initial');
	label_source.style('visibility', 'initial');
	label_source2.style('visibility', 'initial');

	input_seed.style('visibility', 'initial');
}

function hideUI()
{
	slider_size.style('visibility', 'hidden');
	slider_level.style('visibility', 'hidden');
	slider_rot.style('visibility', 'hidden');
	slider_lenRand.style('visibility', 'hidden');
	slider_branchProb.style('visibility', 'hidden');
	slider_rotRand.style('visibility', 'hidden');
	slider_flowerProb.style('visibility', 'hidden');

	button_seed.style('visibility', 'hidden');
	button_newSeed.style('visibility', 'hidden');
	button_randomParams.style('visibility', 'hidden');
	button_change.style('visibility', 'hidden');
	button_hide.style('visibility', 'hidden');

	label_size.style('visibility', 'hidden');
	label_level.style('visibility', 'hidden');
	label_rot.style('visibility', 'hidden');
	label_lenRand.style('visibility', 'hidden');
	label_branchProb.style('visibility', 'hidden');
	label_rotRand.style('visibility', 'hidden');
	label_flowerProb.style('visibility', 'hidden');
	label_perf.style('visibility', 'hidden');
	label_seed.style('visibility', 'hidden');
	label_source.style('visibility', 'hidden');
	label_source2.style('visibility', 'hidden');

	input_seed.style('visibility', 'hidden');
}

function readInputs(updateTree)
{
	size = slider_size.value();
	maxLevel = slider_level.value();
	rot = slider_rot.value();
	lenRand = slider_lenRand.value();
	branchProb = slider_branchProb.value();
	rotRand = slider_rotRand.value();
	flowerProb = slider_flowerProb.value();
	
	if ( updateTree && !growing )
	{
		prog = maxLevel + 1;
		loop();
	}
}

function mutate()
{
	if ( !mutating )
		return;
	
	var startTime = millis();
	randomSeed(paramSeed);
	
	var n = noise(startTime / 20000) - 0.5;
	
	randBias = 2 * Math.abs(n) * n;
	
	paramSeed = 1000 * random();
	randomSeed(randSeed);
	readInputs(true);
	
	var diff = millis() - startTime;
	
	if ( diff < 20 )
		setTimeout(mutate, 20 - diff);
	else
		setTimeout(mutate, 1);
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
	var startTime = millis();
	
	background(0, 0, 0);	
	
	ambientLight(20);
	
	scale(1, -1);
	
	/*
	ambientMaterial(255, 0, 0);
	push();
	translate(100, 0, 0);
	box(200, 10, 10);
	pop();
		
	ambientMaterial(0, 255, 0);
	push();
	translate(0, 100, 0);
	box(10, 200, 10);
	pop();
	
	ambientMaterial(0, 0, 255);
	push();
	translate(0, 0, 100);
	box(10, 10, 200);
	pop();
	*/
	
	translate(0, -height * (size+0.25), -zoom * height * size);
	
	rotate(-rotateX_, [1, 0, 0]);
	rotate(rotateY_, [0, 1, 0]);
	
	/*
	ambientMaterial(255, 0, 0);
	push();
	translate(100, 0, 0);
	box(200, 5, 5);
	pop();
		
	ambientMaterial(0, 255, 0);
	push();
	translate(0, 100, 0);
	box(5, 200, 5);
	pop();
	
	ambientMaterial(0, 0, 255);
	push();
	translate(0, 0, 100);
	box(5, 5, 200);
	pop();
	*/
	
	branch(1, randSeed);
	pointLight(255, 255, 255, 1000, 1000, 1000);
	
	var endTime = millis();
	label_perf.html('Generated in ' + Math.floor((endTime - startTime) * 10) / 10 + 'ms');
	
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
	
	var width = 40 * size * Math.pow((maxLevel - level + 1) / maxLevel, 2);
	var len = growthLevel * size * height * (1 + rand2() * lenRand);
	
	translate(0, (len / level) / 2, 0);
	
	ambientMaterial(255, 255, 255);
	box(width, len / level, width);
	
	translate(0, (len / level) / 2, 0);
	
	var doBranch1 = rand() < branchProb;
	var doBranch2 = rand() < branchProb;
	
	var doFlowers = rand() < flowerProb && prog >= maxLevel && level >= maxLevel;
	
	if ( level < maxLevel )
	{
		var r11 = rot * PI * (1 + rand2() * rotRand + randWind());
		var r12 = rot * PI * (1 + rand2() * rotRand + randWind());
		var r21 = rot * PI * (1 + rand2() * rotRand + randWind());
		var r22 = rot * PI * (1 + rand2() * rotRand + randWind());
		
		if ( doBranch1 )
		{
			push();
			rotate(PI/2 + r11, [0, 1, 0]);
			rotate(r12, [1, 0, 0]);
			branch(level + 1, seed1);
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(PI/2 + r21, [0, 1, 0]);
			rotate(-r22, [1, 0, 0]);
			branch(level + 1, seed2);
			pop();
		}
	}
	
	if ( doFlowers )
	{
		ambientMaterial(255, 150, 150);
		var flowerSize = rand() * growthLevel * size * 50;
		for ( var i=0 ; i<4 ; i++ )
		{
			rotate(PI/4, [1, 0, 0]);
			rotate(2 * PI * i/4, [0, 0, 1])
			
			box(2, flowerSize, 2);
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

function randWind()
{
	return rand2() * randBias;
}