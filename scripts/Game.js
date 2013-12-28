// GLOBALS
var canvasID = 'ripples';
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var ripples = [];
var maxRipples = 40;

var maxTimer = 300;

var timeStep = 17; // in ms, equal to (1000/desired_fps)

// Initialization functions

// Utility functions
function drawRipple(x, y) {
    ripples.push(new Ripple(x, y));
};

function clone(obj) {
    if (obj == null || typeof obj != "object") return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

// UI update functions

// Game control functions
function mouseDownHandler(evt) {
	if (Object.keys(ripples).length < maxRipples) {
        var x = evt.clientX - canvas.getBoundingClientRect().left;
        var y = evt.clientY - canvas.getBoundingClientRect().top;
	    drawRipple(x, y);
	}
};

// MAIN RUNTIME LOOP
function updateCanvas() {

    // Expand and redraw all circles, removing or splitting them if necessary.
    for (var i=0; i<ripples.length; i++) {

        // remove ripple from list
        if (ripples[i].timer == 0) {
            ripples.splice(i, 1);
            continue;
        }

        ripples[i].move();


        // is ripple intersecting with edge of canvas?
        if (ripples[i].isIntersectingCanvas()) {
            // TODO: split ripple?
            // TODO: remove current
            //ripples.splice(i, 1);
            //continue;
        }
        // TODO: is ripple intersecting with another ripple?
        // TODO: is ripple intersecting with an object?

    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw all ripples
    for (var i=0; i<ripples.length; i++) {
        ripples[i].draw();
    }
}

// Game Start
canvas.addEventListener('mousedown', mouseDownHandler, false);
intervalId = setInterval(updateCanvas, timeStep);