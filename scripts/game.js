// GLOBALS
var canvasID = 'Ripples';
var canvas = document.getElementById('ripples');
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var ripples = [];
var maxRipples = 20;

var maxTimer = 200;

var mouse = {x: 0, y: 0};

var timeout;
var timeStep = 17; 

// Initialization functions

// Utility functions
function drawRipple(x, y) {
    ripples.push(new Ripple(x, y));
		/*r1 = new Ripple((2 * width) - mouse.x, mouse.y);
		ripples.push(r1);
		r2 = new Ripple(mouse.x, (2 * height) - mouse.y);
		ripples.push(r2);
		r3 = new Ripple(-mouse.x, mouse.y);
		ripples.push(r3);
		r4 = new Ripple(mouse.x, -mouse.y);
		ripples.push(r4);*/
};

// UI update functions

// Game control functions
function mouseDownHandler(evt) {
	if (ripples.length < maxRipples) {
	    drawRipple(mouse.x, mouse.y);
	}
};

function mouseMoveHandler(evt) {
    mouse.x = evt.clientX - canvas.getBoundingClientRect().left;
    mouse.y = evt.clientY - canvas.getBoundingClientRect().top;
};


// MAIN RUNTIME LOOP
function run() {
    // Move everything
    for (i = 0; i < ripples.length; i++) {
	    ripples[i].move();
    }
    // Erase everything
    ctx.clearRect(0, 0, width, height);
    // Redraw everything
    for (i = 0; i < ripples.length; i++) {
  	    ripples[i].draw();
    }
  
    // Do it all again in a little while
    clearTimeout(timeout);
    timeout = setTimeout(run, timeStep);  
}

// Game Start
canvas.addEventListener('mousedown', mouseDownHandler, false);
canvas.addEventListener('mousemove', mouseMoveHandler, false);
run();
