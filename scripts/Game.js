// TODO: Turn me into a fully fledged OO runtime?

/////////////
// GLOBALS //
/////////////
var canvasID = 'ripples';
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var ripples = [];

var maxRipples = 40;
var maxTimer = 500;

var timeStep = 17; // in ms, equal to (1000/desired_fps)
var intervalId = null;

var level = new Level();
var paused = false;


///////////////////////
// Utility functions //
///////////////////////
function drawRipple(x, y) {
    if (ripples.length < maxRipples) {
        ripples.push(new Ripple(x, y));
    }
};

// TODO: remove?
function clone(obj) {
    if (obj == null || typeof obj != "object") return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


////////////////////////////
// Game control functions //
////////////////////////////

function mouseDownHandler(evt) {
    var x = evt.clientX - canvas.getBoundingClientRect().left;
    var y = evt.clientY - canvas.getBoundingClientRect().top;
    drawRipple(x, y);
};

function keydownHandler(evt) {
    if (evt.keyCode == 27){
        pause();
    }
};

function pause() {
    if (paused) {
        paused = false;
        clearInterval(intervalId);
        intervalId = setInterval(mainLoop, timeStep);
    } else {
        paused = true;
        clearInterval(intervalId);
        intervalId = setInterval(pausedLoop, timeStep);
    }
};


//////////////////////
// Update functions //
//////////////////////

function updateWorld() {
    // TODO: should the level own the ripples?

    // Expand and redraw all circles, removing or splitting them if necessary.
    for (var i=0; i<ripples.length; i++) {

        // remove ripple from list
        if (ripples[i].timer == 0) {
            ripples.splice(i, 1);
            continue;
        }

        ripples[i].move();
    }

    // TODO: move all obstacles
};

function updateCanvas() {
    // TODO: add layer of abstraction between main runtime loop and updateCanvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Draw level
    level.draw();

    // Draw all ripples
    for (var i=0; i<ripples.length; i++) {
        ripples[i].draw();
    }

    // TODO: draw foreground
    //   maybe obscure area outside border? would prefer to 
    //   just not draw ripples outside the border :-/
    ctx.restore();
};

function updatePauseScreen() {
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, width, height);

    // TODO: shifting gradient fill?
    ctx.font = "2.5em Ubuntu";
    ctx.textAlign = 'left';
    //ctx.textBaseline = "bottom";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.fillText("paused", 0, height);
    ctx.strokeText("paused", 0, height);

    ctx.restore();
};


////////////////////////
// MAIN RUNTIME LOOPS //
////////////////////////
function mainLoop() {
    // TODO: use this layer for gameplay stuff (win/lose state)
    // TODO: win condition
    // TODO: lose condition?
    // TODO: pause
    updateWorld();
    updateCanvas();
};

function pausedLoop() {
    updateCanvas();
    updatePauseScreen();
};


//////////////////////////////
// Initialization functions //
//////////////////////////////
function initializeGame() {
    // TODO: Welcome screen
    canvas.addEventListener('mousedown', mouseDownHandler, false);
    window.addEventListener('keydown', keydownHandler, true);
    intervalId = setInterval(mainLoop, timeStep);
};


////////////////
// Game Start //
////////////////
initializeGame();