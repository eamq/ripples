// TODO: Turn me into a fully fledged OO runtime?

/////////////
// GLOBALS //
/////////////
// TODO: put me in a config file
var canvasID = 'ripples';
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext('2d');
var debug = false;

var width = canvas.width;
var height = canvas.height;

var ripples = [];

var maxRipples = 60;
var maxTimer = 300; // TODO: make this independent of timeStep

var maxArcs = 600;
var numArcs = 0;

var maxDepth = 4; // wow, such deep, many inception

var timeStep = 17; // in ms, equal to (1000/desired_fps)
var intervalId = null;

// TODO: load level from file
var level = null;
var paused = false;
var game_started = false;


///////////////////////////////////
// Utility classes and functions //
///////////////////////////////////

// TODO: maybe move the screens to a new file?
function MenuScreen() {
    // TODO
    this.bgFillStyle = "";
};

function WelcomeScreen() {
    this.timer = 4000;
};
WelcomeScreen.prototype = new MenuScreen;

function createRipple(x, y) {
    if (ripples.length < maxRipples && numArcs < maxArcs) {
        ripples.push(new Ripple(x, y));
    }
};

function resizeCanvas() {
    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;
}

// TODO: remove?
function clone(obj) {
    if (obj == null || typeof obj != "object") return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

////////////////////////////
// Game control functions //
////////////////////////////

function mouseoverHandler(evt) {
    // TODO: menu object highlight
};


function welcomeScreenMouseDownHandler(evt) {
    startGame();
    mouseDownHandler(evt);
}; 

function mouseDownHandler(evt) {
    if (evt.button == 0) {
        var x = evt.clientX - canvas.getBoundingClientRect().left;
        var y = evt.clientY - canvas.getBoundingClientRect().top;
        createRipple(x, y);
    }
};

function keydownHandler(evt) {
    if (evt.keyCode == 27) {
        pause();
    }
};

function pause() {
    if (paused) {
        paused = false;
        canvas.addEventListener('mousedown', mouseDownHandler, false);
        intervalId = setInterval(mainLoop, timeStep);
    } else {
        paused = true;
        canvas.removeEventListener('mousedown', mouseDownHandler);
        clearInterval(intervalId);
        updatePauseScreen();
    }
};


//////////////////////
// Update functions //
//////////////////////

function updateWelcomeScreen() {
    ctx.save();
    // TODO: use a WelcomeScreen object

    ctx.font = "3em Ubuntu";
    ctx.textAlign = 'left';
    ctx.fillStyle = "rgba(40, 120, 215, 0.4)";
    ctx.strokeStyle = "#000000";

    ctx.translate(width/2, height/2);
    ctx.fillText("ripples", -width/2, height/2);
    ctx.strokeText("ripples", -width/2, height/2);
    ctx.rotate(Math.PI);
    ctx.fillText("ripples", -width/2, height/2);
    ctx.strokeText("ripples", -width/2, height/2);
    ctx.restore();

    ctx.save();
    ctx.font = "0.8em Ubuntu";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.strokeStyle = "#DDDDDD";
    ctx.fillStyle = "#333333";
    ctx.strokeText("\u00A9 2014 eamq.net", width - 3, height);
    ctx.fillText("\u00A9 2014 eamq.net", width - 3, height);

    ctx.restore();
};

function updateWorld() {
    // Move all circles, removing them if necessary.
    for (var i=0; i<ripples.length; i++) {

        // remove ripple from list
        if (ripples[i].timer == 0) {
            numArcs -= ripples[i].arcs.length;
            ripples.splice(i, 1);
            continue;
        }

        // move ripple
        ripples[i].move();
    }
    // TODO: move all obstacles
};

function updateCanvas() {
    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // TODO: Draw background:

    // Draw midground:
    //   Ripples
    //   Obstacles
    for (var i=0; i<ripples.length; i++) {
        ripples[i].draw();
        if (debug) {
            ripples[i].drawCollisions();
        }
    }
    level.drawObstacles();

    // Draw foreground
    //   Level
    level.drawLevel();
    // Yeah, it's weird having the level in the foreground. This is to ensure
    // that the ripples don't show on top of the borders/obstacles they're
    // reflecting off of. 

    // TODO: put welcome screen/menu fade here
    //   maybe obscure area outside border? would prefer to 
    //   just not draw ripples outside the border :-/
    ctx.restore();
};

function updatePauseScreen() {
    ctx.save();

    // TODO: use a MenuScreen object

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, width, height);

    // TODO: shifting gradient fill?
    ctx.font = "3em Ubuntu";
    ctx.textAlign = 'left';
    //ctx.textBaseline = "bottom";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.fillText("paused", 0, height);
    ctx.strokeText("paused", 0, height);

    ctx.restore();
};


////////////////////////
// MAIN RUNTIME LOOPS //
////////////////////////
function welcomeScreenLoop(){
    updateWorld();
    updateCanvas();
    updateWelcomeScreen();
};

function mainLoop() {
    // TODO: use this layer for gameplay stuff (win/lose state)
    // TODO: win condition
    // TODO: lose condition?
    // TODO: pause
    updateWorld();
    updateCanvas();
};


//////////////////////////////
// Initialization functions //
//////////////////////////////
function initializeGame() {
    //resizeCanvas();
    level = new Level() // TODO: load level from file
    //window.addEventListener('resize', resizeCanvas, false);
    canvas.addEventListener('mousedown', welcomeScreenMouseDownHandler, false);
    clearInterval(intervalId);
    intervalId = setInterval(welcomeScreenLoop, timeStep);
};

function startGame() {    
    canvas.removeEventListener('mousedown', welcomeScreenMouseDownHandler);
    canvas.addEventListener('mousedown', mouseDownHandler, false);
    window.addEventListener('keydown', keydownHandler, true);
    game_started = true;
    clearInterval(intervalId);
    intervalId = setInterval(mainLoop, timeStep);
};


////////////////
// Game Start //
////////////////
initializeGame();
