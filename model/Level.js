////////////
// Level //
///////////
function Level(border) {
	var default_border = [
		new Point(0, 0),          // top-left
		new Point(width, 0),      // top-right
		new Point(width, height), // bottom-right
		new Point(0, height)      // bottom-left
	];

	this.border = (typeof border === "undefined") ? default_border : border;
	//this.obstacles = [];
	//this.obstacles = [new Obstacle([new Point(300, 300), new Point(250, 200)])];
	//this.obstacles = [
	//	new Obstacle([new Point(200, 200), new Point(200, 300)]), 
	//	new Obstacle([new Point(300, 200), new Point(300, 300)])
	//];
	this.obstacles = [new Obstacle([new Point(300, 300), new Point(400, 300), new Point (350, 200)])];
	//this.obstacles = [
	//	new Obstacle([new Point(150, 100), new Point(150, 200)]), 
	//	new Obstacle([new Point(475, 150), new Point(575, 150)]),
	//	new Obstacle([new Point(125, 375), new Point(200, 300)]), 
	//	new Obstacle([new Point(475, 300), new Point(550, 375)]), 
	//];

	this.collidables = this.getCollidables();

	this.maxRipples = 60;
	this.maxDepth   = 4;

	// TODO: background
	// TODO: foreground
	// TODO: goal
};

Level.prototype.getBorderSegments = function() {
	return createSegments(this.border);
};

Level.prototype.getAllObstacleSegments = function() {
	var segments = [];
	for (var i=0; i<this.obstacles.length; i++) {
		segments = segments.concat(this.obstacles[i].getObstacleSegments());
	}
	return segments;
};

Level.prototype.getCollidables = function() {
	return this.getBorderSegments().concat(this.getAllObstacleSegments());
};

Level.prototype.loadLevel = function(filename) {
	// TODO: load level data from a file
};

//////////////
// Obstacle //
//////////////
function Obstacle(points) {
	this.points = (typeof points === "undefined") ? [] : points;
	// TODO: dx, dy, da
	// TODO: color?
};

Obstacle.prototype.getObstacleSegments = function() {
	return createSegments(this.points);
};
