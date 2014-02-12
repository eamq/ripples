function Level() {
	this.edges = [
		[new Point(0, 0), new Point(width, 0)], // top
		[new Point(width, 0), new Point(width, height)],  // right
		[new Point(0, height), new Point(width, height)], // bottom
		[new Point(0, 0), new Point(0, height)]           // left
	];

	this.obstacles = [];

	// TODO: load level data from a file
};

Level.prototype.getCollidables = function() {
	return this.edges.concat(this.obstacles);
};