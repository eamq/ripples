////////////
// Engine //
////////////
// Main controller. Initializes the game engine, creates the view, and shows the welcome screen.
function Engine(canvas) {
    // Globals
    this.intervalId = null;
    this.timeStep = 17; // in ms, equal to (1000/desired_fps)

    // Game state
    this.paused = false;
    this.world = new World();

    // TODO: an actual View
    this.renderer = new Renderer(canvas);

    // Hack for scope issues with using 'this' in callbacks and handlers
    var self = this;

    // "Press Start"
    this.welcomeScreenMouseDownHandler = function(evt) {
        if (evt.button == 0) {
            self.renderer.removeEventListener('mousedown', self.welcomeScreenMouseDownHandler);
            self.renderer.addEventListener('keydown', self.keydownHandler, true);
            self.run();
            self.mouseDownHandler(evt);
        }
    }

    // Click to create a ripple
    this.mouseDownHandler = function(evt) {
        if (evt.button == 0) {
            // TODO: move canvas math to View (abstract pixels from in-game units)
            var x = evt.clientX - self.renderer.canvas.getBoundingClientRect().left;
            var y = evt.clientY - self.renderer.canvas.getBoundingClientRect().top;
            self.world.createRipple(x, y);
        }
    };

    // ESC to pause
    this.keydownHandler = function(evt) {
        if (evt.keyCode == 27) {
            self.togglePause();
        }
    };

    // Show welcome screen
    this.renderer.addEventListener('mousedown', self.welcomeScreenMouseDownHandler, false);
    this.renderer.render(this.world);
    this.renderer.welcome();
};

// Runs the game by initalizing the main loop
Engine.prototype.run = function() {
    this.renderer.addEventListener('mousedown', this.mouseDownHandler, false);
    clearInterval(this.intervalId);
    var self = this; // Hack for scope issue inside setInterval
    this.intervalId = setInterval(function() {
        // MAIN LOOP
        // TODO: win condition
        // TODO: lose condition?
        // TODO: pause
        self.world.update();
        self.renderer.render(self.world);
    }, this.timeStep);
};


// Pauses/unpauses the game
Engine.prototype.togglePause = function() {
    if (this.paused) {
        this.paused = false;
        this.run();
    } else {
        this.paused = true;
        this.renderer.removeEventListener('mousedown', this.mouseDownHandler);
        clearInterval(this.intervalId);
        this.renderer.pause();
    }
};
