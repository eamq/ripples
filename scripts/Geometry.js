function Point(x, y) {
	this.x = x;
	this.y = y;

};function Arc(x, y, radius, start, end) {
	this.x = x;
	this.y = y;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? 2 * Math.PI : end;
};

Arc.prototype.getPerpendicularFoot = function(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	var k = (dy*(this.x-p1.x) - dx*(this.y-p1.y))/((dx*dx) + (dy*dy));

	return new Point(this.x - k * dy, this.y + k * dx);
};

// Returns points of intersection with the given line segment ([] if none exist)
Arc.prototype.getCollisionPoints = function(p1, p2) {
	// TODO: allow me to have multiple collision points with one segment
	points = [];

	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;

	// is perpendicular distance greater than the radius?
	var pd = Math.abs((dy*this.x) - (dx*this.y) + (p1.x*p2.y) - (p2.x*p1.y))/Math.sqrt((dx*dx) + (dy*dy));
	if (pd > this.radius) {
		return points;
	}

	// will arc miss segment?
	var angle1 = (Math.atan((p1.y-this.y)/(p1.x-this.x)) + 2*Math.PI) % 2*Math.PI;
	var	angle2 = (Math.atan((p2.y-this.y)/(p2.x-this.x)) + 2*Math.PI) % 2*Math.PI;
	if ((angle1 < this.start || angle1 > this.end) &&
			(angle2 < this.start || angle2 > this.end)) {
		return points;
	}

	// perpendicular foot on line segment?
	var foot = this.getPerpendicularFoot(p1, p2);
	if (foot.x >= Math.min(p1.x, p2.x) && foot.x <= Math.max(p1.x, p2.x) &&
			foot.y >= Math.min(p1.y, p2.y) && foot.y <= Math.max(p1.y, p2.y)) {
		// TODO: Figure out actual point(s) of intersection
		points.push(foot);
		return points;
	}
	
	// is distance from the closest endpoint less than the radius?
	var dist = Math.min(Math.sqrt(Math.pow(p1.x-this.x, 2) + Math.pow(p1.y-this.y, 2)),
		Math.sqrt(Math.pow(p2.x-this.x, 2) + Math.pow(p2.y-this.y, 2)));
	if (dist < this.radius) {
		// TODO: Figure out actual point(s) of intersection
		points.push(foot);
		return points;
	}
	return points;
};

Arc.prototype.getReflectionPoints = function(points) {
	// TODO: actually get all reflection points, not just modified perp feet
	var ref_points = [];
	for (var i=0; i<points.length; i++) {
		ref_points.push(new Point(2*points[i].x-this.x, 2*points[i].y-this.y));
	}
	return ref_points;
};

// Returns a list of all points of collision
Arc.prototype.getAllCollisionPoints = function() {
	var points = []
	// TODO: can we cull the list of collidables?
	var collidables = level.getCollidables();
    // TODO: is ripple intersecting with another ripple?
    // TODO: is ripple intersecting with an object?
	for (var i=0; i<collidables.length; i++) {
		points = points.concat(this.getCollisionPoints(collidables[i][0], collidables[i][1]));
	}
	return points;
};
