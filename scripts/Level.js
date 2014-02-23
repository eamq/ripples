///////////
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
	this.obstacles = [];
	//this.obstacles = [new Obstacle([new Point(300, 300), new Point(250, 200)])];
	//this.obstacles = [
	//	new Obstacle([new Point(200, 200), new Point(200, 300)]), 
	//	new Obstacle([new Point(300, 200), new Point(300, 300)])
	//];
	//this.obstacles = [new Obstacle([new Point(300, 300), new Point(400, 300), new Point (350, 200)])];
	//this.obstacles = [
	//	new Obstacle([new Point(150, 100), new Point(150, 200)]), 
	//	new Obstacle([new Point(475, 150), new Point(575, 150)]),
	//	new Obstacle([new Point(125, 375), new Point(200, 300)]), 
	//	new Obstacle([new Point(475, 300), new Point(550, 375)]), 
	//];

	this.collidables = this.getCollidables();

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

Level.prototype.drawLevel = function() {
	ctx.save();

    // TODO: draw background

	// draw edges
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	for (var i=0; i<this.border.length; i++) {
		ctx.lineTo(this.border[i].x, this.border[i].y);
	}
	ctx.closePath();
	ctx.stroke();
	// TODO: fill. use alpha to let fancy backgrounds shine through?
	// TODO: draw fancy border effect
	
	// TODO: draw foreground

	ctx.restore();
};

Level.prototype.drawObstacles = function() {
	ctx.save();
	ctx.strokeStyle = "#333333";
	for (var i=0; i<this.obstacles.length; i++) {
		this.obstacles[i].draw();
	}
	ctx.restore;
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

Obstacle.prototype.draw = function() {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 2;
		for (var i=0; i<this.points.length; i++) {
			ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
};
