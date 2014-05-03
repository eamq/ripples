////////////
// Level //
///////////
function Level(border) {
	var default_border = [
		new Point(0, 0),          // top-left
		new Point(700, 0),      // top-right
		new Point(700, 500), // bottom-right
		new Point(0, 500)      // bottom-left
	];

	this.border = (typeof border === "undefined") ? default_border : border;
	this.borderSegments = createSegments(this.border);

	//this.obstacles = [];
	//this.obstacles = [new Obstacle([new Point(300, 300), new Point(250, 200)])]; // DIAGONAL LINE
	//this.obstacles = [   // TWO VERTICAL LINES
	//	new Obstacle([new Point(200, 200), new Point(200, 300)]), 
	//	new Obstacle([new Point(300, 200), new Point(300, 300)])
	//];
	this.obstacles = [new Obstacle([new Point(300, 300), new Point(400, 300), new Point (350, 200)])]; // TRIANGLE
	//this.obstacles = [
	//	new Obstacle([new Point(150, 100), new Point(150, 200)]), 
	//	new Obstacle([new Point(475, 150), new Point(575, 150)]),
	//	new Obstacle([new Point(125, 375), new Point(200, 300)]), 
	//	new Obstacle([new Point(475, 300), new Point(550, 375)]), 
	//];

	this.collidables = this.getCollidables();

	this.maxRipples = 60;
	this.maxDepth   = 1;
    this.maxTimer = 300; // TODO: make this independent of timeStep - can't?

	// TODO: background
	// TODO: foreground
	// TODO: goal
};

Level.prototype.getObstacleSegments = function() {
	var segments = [];
	for (var i=0; i<this.obstacles.length; i++) {
		segments = segments.concat(this.obstacles[i].segments);
	}
	return segments;
};

Level.prototype.getCollidables = function() {
	return this.borderSegments.concat(this.getObstacleSegments());
};

Level.prototype.loadLevel = function(filename) {
	// TODO: load level data from a file
};

//////////////
// Obstacle //
//////////////
function Obstacle(points) {
	this.points = (typeof points === "undefined") ? [] : points;
	this.segments = createSegments(this.points);
	// TODO: dx, dy, da
	// TODO: color?
};
