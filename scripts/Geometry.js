///////////
// Point //
///////////
function Point(x, y) {
	this.x = x;
	this.y = y;

};

/////////
// Arc //
/////////
function Arc(x, y, radius, start, end) {
	this.x = x;
	this.y = y;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? 2 * Math.PI : end;
};

Arc.prototype.equals = function(other) {
	return (this.x === other.x && 
			this.y === other.y && 
			this.radius === other.radius && 
			this.start === other.start && 
			this.end === other.end);
};

Arc.prototype.getPerpendicularFoot = function(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	var k = (dy*(this.x-p1.x) - dx*(this.y-p1.y))/((dx*dx) + (dy*dy));

	return new Point(Number((this.x - k * dy).toFixed(1)), 
					Number((this.y + k * dx).toFixed(1)));
};

// Returns points of intersection with the given line segment ([] if none exist)
Arc.prototype.getCollisionPoints = function(p1, p2) {
	// TODO: allow me to have multiple collision points with one segment
	points = [];

	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	// var dr = Math.sqrt((dx*dx) + (dy*dy));
	// var bigD = (p1.x*p2.y) - (p2.x*p1.y);
	// var discriminant = (this.radius*this.radius)*(dr*dr) - (bigD*bigD);

	// if discriminant < 0, no intersection
	// else if disc. == 0; tangent @ foot
	// else; 2 possible points

	// is perpendicular distance greater than the radius?
	var pd = Math.abs((dy*this.x) - (dx*this.y) + (p2.x*p1.y) - (p1.x*p2.y))/Math.sqrt((dx*dx) + (dy*dy));
	if (pd > this.radius) {
		return [];
	} 

	// will arc miss segment?
	var angle1 = (Math.atan((p1.y-this.y)/(p1.x-this.x)) + 2*Math.PI) % 2*Math.PI;
	var	angle2 = (Math.atan((p2.y-this.y)/(p2.x-this.x)) + 2*Math.PI) % 2*Math.PI;
	if ((angle1 < this.start || angle1 > this.end) &&
			(angle2 < this.start || angle2 > this.end)) {
		return [];
	}

	// perpendicular foot on line segment?
	var foot = this.getPerpendicularFoot(p1, p2);
	if (foot.x >= Math.min(p1.x, p2.x) && foot.x <= Math.max(p1.x, p2.x) &&
			foot.y >= Math.min(p1.y, p2.y) && foot.y <= Math.max(p1.y, p2.y)) {
		// TODO: Figure out actual point(s) of intersection
		// if pd == radius, foot is the only intersection point
		if (pd == this.radius) {
			return [foot];
		}

		points.push(foot);
	}
	
	// is distance from the closest endpoint less than the radius?
	var dist = Math.min(Math.sqrt(Math.pow(p1.x-this.x, 2) + Math.pow(p1.y-this.y, 2)),
		Math.sqrt(Math.pow(p2.x-this.x, 2) + Math.pow(p2.y-this.y, 2)));
	if (dist < this.radius) {
		// TODO: Figure out actual point(s) of intersection
		points.push(foot);
	} 
	//else if (dist == this.radius) {
	//	return []
	//}
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

///////////////////////////////
// Geometry helper functions //
///////////////////////////////

// Line segments will be created between adjacent points
// in "points", and the last point will be connected to the first.
function getSegments(points) {
    var segments = [];
    if (points.length == 2) {
        return [points];
    }
    for (var i=0; i<points.length; i++) {
        if (i == 0) {
            segments.push([points[points.length - 1], points[i]]);
        } else {
            segments.push([points[i - 1], points[i]]);
        }
    }
    return segments;
};
