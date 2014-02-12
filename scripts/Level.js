///////////
// Level //
///////////
function Level(border) {
	var default_border = [
		//new Point(100, 0),   TODO: I BREAK WITH THE OBSTACLE
		new Point(0, 0),          // top-left
		new Point(width, 0),      // top-right
		new Point(width, height), // bottom-right
		new Point(0, height)      // bottom-left
	];

	this.border = (typeof border === "undefined") ? default_border : border;
	this.obstacles = [];
	//this.obstacles = [new Obstacle([new Point(200, 200), new Point(300, 300)])];

	// TODO: background
	// TODO: foreground
	// TODO: goal
};

Level.prototype.getBorderSegments = function() {
	return getSegments(this.border);
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

Level.prototype.draw = function() {
	ctx.save();

    // TODO: draw background

	// draw edges
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	//ctx.lineWidth = 2;
	var last = this.border[this.border.length - 1];
	ctx.moveTo(last.x, last.y);
	for (var i=0; i<this.border.length; i++) {
		ctx.lineTo(this.border[i].x, this.border[i].y);
	}
	ctx.stroke();
	// TODO: fill. use alpha to let fancy backgrounds shine through?
	// TODO: draw fancy border effect
	

	// draw obstacles
	ctx.strokeStyle = "#333333";
	for (var i=0; i<this.obstacles.length; i++) {
		// TODO: move me to Obstacle.draw
		var last = this.obstacles[i].points[this.obstacles[i].points.length - 1];
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(last.x, last.y);
		for (var j=0; j<this.obstacles[i].points.length; j++) {
			ctx.lineTo(this.obstacles[i].points[j].x, this.obstacles[i].points[j].y);
		}
		ctx.stroke();
	}

	// TODO: draw foreground

	ctx.restore();
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
	return getSegments(this.points);
}