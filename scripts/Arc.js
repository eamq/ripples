/////////
// Arc //
/////////
function Arc(center, radius, start, end) {
	this.center = center;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? TWO_PI : end;
};

Arc.prototype.equals = function(other) {
	return (this.center.x === other.center.x && 
			this.center.y === other.center.y && 
			this.radius === other.radius && 
			this.start === other.start && 
			this.end === other.end);
};

Arc.prototype.sortPointsByDistance = function(p1, p2) {
	var d1 = Math.sqrt(Math.pow(p1.x-this.center.x, 2) + Math.pow(p1.y-this.center.y, 2));
	var d2 = Math.sqrt(Math.pow(p2.x-this.center.x, 2) + Math.pow(p2.y-this.center.y, 2));
	if (d1 > d2) {
		return [p2, p1];
	} else {
		return [p1, p2];
	}
};

// Returns points of intersection with the given line segment ([] if none exist)
Arc.prototype.getCollisionPoints = function(p1, p2) {

	var points = [];

	if (this.radius == 0) {
		return [];
	}

	// Rhoad's circle-line intersection algorithm 
	// http://mathworld.wolfram.com/Circle-LineIntersection.html
	// Requires center = (0, 0), so we'll pretend that's true :)
	var x1 = p1.x - this.center.x;
	var x2 = p2.x - this.center.x;
	var y1 = p1.y - this.center.y;
	var y2 = p2.y - this.center.y;

	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr = Math.sqrt((dx*dx) + (dy*dy));
	var bigD = (x1*y2) - (x2*y1);
	var discriminant = (this.radius*this.radius)*(dr*dr) - (bigD*bigD);

	// if discriminant < 0, no intersection
	if (discriminant < 0) {
		return [];
	} 

	// will arc miss segment?
	// TODO: this will probably need to be revised in order to properly expand arcs
	var angle1 = (Math.atan((p1.y-this.center.y)/(p1.x-this.center.x)) + TWO_PI) % TWO_PI;
	var	angle2 = (Math.atan((p2.y-this.center.y)/(p2.x-this.center.x)) + TWO_PI) % TWO_PI;
	if ((angle1 < this.start || angle1 > this.end) &&
			(angle2 < this.start || angle2 > this.end)) {
		// TODO: cull this segment from future collision detection?
		return [];
	}

	var center = new Point(this.center.x, this.center.y);
	var foot = center.getPerpendicularFoot(p1, p2);
	// if disc. == 0, 1 intersection (tangent line at perp. foot)
	if (discriminant == 0) {
		if (foot.isPerpendicularFootOnSegment(p1, p2)) {
			return [foot];
		} else {
			return [];
		}
	} else {
		// if disc. > 0, 2 (possible) intersection points
		var segment = this.sortPointsByDistance(p1, p2);
		var closest = segment[0];
		var farthest = segment[1];

		if (center.getDistance(closest) <= this.radius) {
			if (center.getDistance(farthest) <= this.radius) {
				// both points are inside arc
				// TODO: cull this segment from future collision detection?
				return [];
			} 
		} else if (!foot.isPerpendicularFootOnSegment(p1, p2)) {
			// no insersection with segment
			return [];
		}
		// TODO: implement the rest of Rhoad's algorithm
		// TODO find both intersection points, see if each is on segment
		points.push(foot); // push the perp. foot for now
	}
	return points;
};

Arc.prototype.getReflectionPoints = function(points) {
	// TODO: actually get all reflection points, not just modified perp feet
	var ref_points = [];
	for (var i=0; i<points.length; i++) {
		ref_points.push(new Point(Number((2*points[i].x-this.center.x).toFixed(1)), 
								Number((2*points[i].y-this.center.y).toFixed(1))));
	}
	return ref_points;
};

// Returns a list of all points of collision
Arc.prototype.getAllCollisionPoints = function() {
	var points = []
	// TODO: can we cull the list of collidables?
	var collidables = level.collidables;
    // TODO: is ripple intersecting with another ripple?
    // TODO: is ripple intersecting with an object?
	for (var i=0; i<collidables.length; i++) {
		points = points.concat(this.getCollisionPoints(collidables[i][0], collidables[i][1]));
	}
	return points;
};

// Requires stroke/fill style to be set prior to calling
Arc.prototype.draw = function() {
	ctx.save();
	ctx.beginPath();
	ctx.arc(this.center.x, 
			this.center.y, 
			this.radius, 
			this.start, 
			this.end);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
};
