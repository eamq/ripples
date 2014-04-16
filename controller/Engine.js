////////////
// Engine //
////////////
// Main controller. Initializes the game engine, creates the view, and shows the welcome screen.
function Engine() {
    // TODO: Globals
    this.intervalId = null;

    // Game state
    // TODO: Model
    this.paused = false;
    this.world = new World();

    // View
    this.renderer = new Renderer();

    // Hack for scope issues with using 'this' in callbacks and handlers
    var self = this;

    // Input Handlers
    this.welcomeScreenMouseDownHandler = function(evt) {
        canvas.removeEventListener('mousedown', self.welcomeScreenMouseDownHandler);
        self.run();
        self.mouseDownHandler(evt);
    }

    this.mouseDownHandler = function(evt) {
        if (evt.button == 0) {
            var x = evt.clientX - canvas.getBoundingClientRect().left;
            var y = evt.clientY - canvas.getBoundingClientRect().top;
            self.world.createRipple(x, y);
        }
    };

    this.keydownHandler = function(evt) {
        if (evt.keyCode == 27) {
            self.pause();
        }
    };

    // Show welcome screen
    canvas.addEventListener('mousedown', self.welcomeScreenMouseDownHandler, false);
    this.render();
    this.renderer.welcome();
};

Engine.prototype.run = function() {
    var self = this;
    canvas.addEventListener('mousedown', self.mouseDownHandler, false);
    window.addEventListener('keydown', self.keydownHandler, true);
    clearInterval(this.intervalId);
    this.intervalId = setInterval(function() {
        // MAIN LOOP
        // TODO: use this layer for gameplay stuff (win/lose state)
        // TODO: win condition
        // TODO: lose condition?
        // TODO: pause
        self.update();
        self.render();
    }, timeStep);
};

Engine.prototype.pause = function() {
    if (this.paused) {
        this.paused = false;
        this.run();
    } else {
        this.paused = true;
        canvas.removeEventListener('mousedown', this.mouseDownHandler);
        clearInterval(this.intervalId);
        this.renderer.pause();
    }
};

Engine.prototype.update = function() {
    this.world.update();
};

Engine.prototype.render = function(world) {
    world = (typeof world === "undefined") ? this.world : world;
    this.renderer.render(world);
};