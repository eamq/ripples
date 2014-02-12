function Level(border) {
	var default_border = [
		new Point(0, 0),          // top-left
		new Point(width, 0),      // top-right
		new Point(width, height), // bottom-right
		new Point(0, height)      // bottom-left
	];

	this.border = (typeof border === "undefined") ? default_border : border;
	this.obstacles = [];
	//this.obstacles = [new Obstacle([new Point(200, 200), new Point(300, 300)])];
};

Level.prototype.getBorderSegments = function() {
	return getSegments(this.border);
};

Level.prototype.getObstacleSegments = function() {
	var segments = [];
	for (var i=0; i<this.obstacles.length; i++) {
		segments = segments.concat(getSegments(this.obstacles[i].points));
	}
	return segments;
};

Level.prototype.getCollidables = function() {
	return this.getBorderSegments().concat(this.getObstacleSegments());
};

Level.prototype.loadLevel = function(filename) {
	// TODO: load level data from a file
};

Level.prototype.draw = function() {
	// draw edges
	ctx.save();
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	var last = this.border[this.border.length - 1];
	ctx.moveTo(last.x, last.y);
	for (var i=0; i<this.border.length; i++) {
		ctx.lineTo(this.border[i].x, this.border[i].y);
	}
	ctx.stroke();
	

	// draw obstacles
	ctx.strokeStyle = "#333333";
	for (var i=0; i<this.obstacles.length; i++) {
		ctx.save();
		var last = this.obstacles[i].points[this.obstacles[i].points.length - 1];
		ctx.beginPath();
		ctx.moveTo(last.x, last.y);
		for (var j=0; j<this.obstacles[i].points.length; j++) {
			ctx.lineTo(this.obstacles[i].points[j].x, this.obstacles[i].points[j].y);
		}
		ctx.stroke();
		ctx.restore();
	}
	ctx.restore();
};

function Obstacle(points) {
	this.points = (typeof points === "undefined") ? [] : points;
	// TODO: dx, dy, da
	// TODO: color?
};
