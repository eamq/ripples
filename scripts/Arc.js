/////////
// Arc //
/////////
function Arc(center, radius, start, end) {
	this.center = center;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? TWO_PI : end;

	this.ignore_list = []; // List of segments to ignore for collisions
};

Arc.prototype.equals = function(other) {
	return (this.center.x === other.center.x && 
			this.center.y === other.center.y && 
			this.radius === other.radius && 
			this.start === other.start && 
			this.end === other.end);
};

// Returns an object denoting the 'closest' and 'farthest' points
// from the center of the Arc.
Arc.prototype.rankEndpointsByDistance = function(seg) {
	var d1 = Math.sqrt(Math.pow(seg.p1.x-this.center.x, 2) + Math.pow(seg.p1.y-this.center.y, 2));
	var d2 = Math.sqrt(Math.pow(seg.p2.x-this.center.x, 2) + Math.pow(seg.p2.y-this.center.y, 2));
	if (d1 > d2) {
		return {
			'closest': seg.p2,
			'farthest': seg.p1
		};
	} else {
		return {
			'closest': seg.p1,
			'farthest': seg.p2
		};
	}
};

// Returns points of intersection with the given line segment ([] if none exist)
Arc.prototype.getCollisionPoints = function(seg) {

	var points = [];

	if (this.radius == 0) {
		return [];
	}

	// quick check for no collision
	if (this.center.getPerpendicularDistance(seg) > this.radius) {
		return [];
	}

	//// will arc miss segment?
	//// TODO: this will probably need to be revised in order to properly expand arcs
	//var angle1 = (Math.atan((seg.p1.y-this.center.y)/(seg.p1.x-this.center.x)) + TWO_PI) % TWO_PI;
	//var angle2 = (Math.atan((seg.p2.y-this.center.y)/(seg.p2.x-this.center.x)) + TWO_PI) % TWO_PI;
	//if ((angle1 < this.start || angle1 > this.end) &&
	//		(angle2 < this.start || angle2 > this.end)) {
	//	// TODO: cull this segment from future collision detection?
	//	return [];
	//}

	// Rhoad's circle-line intersection algorithm 
	// http://mathworld.wolfram.com/Circle-LineIntersection.html
	// Requires center = (0, 0), so we'll pretend that's true :)
	var x1 = seg.p1.x - this.center.x;
	var x2 = seg.p2.x - this.center.x;
	var y1 = seg.p1.y - this.center.y;
	var y2 = seg.p2.y - this.center.y;

	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr = Math.sqrt((dx*dx) + (dy*dy));
	var bigD = (x1*y2) - (x2*y1);
	var discriminant = (this.radius*this.radius)*(dr*dr) - (bigD*bigD);

	var foot = this.center.getPerpendicularFoot(seg);

	// we already know discriminant >= 0, because of the quick check above
	// if disc. == 0, 1 intersection (tangent line at perp. foot)
	if (discriminant == 0) {
		if (foot.isPerpendicularFootOnSegment(seg)) {
			return [foot];
		} else {
			return [];
		}
	} else {
		// if disc. > 0, 2 (possible) intersection points
		var segment = this.rankEndpointsByDistance(seg);
		if (this.center.getDistance(segment['closest']) <= this.radius) {
			if (this.center.getDistance(segment['farthest']) <= this.radius) {
				// both endpoints are inside arc
				// cull this segment from future collision detection
				this.ignore_list.push(seg);
				return [];
			} 
		} else if (!foot.isPerpendicularFootOnSegment(seg)) {
			// no insersection with segment
			return [];
		}
		// TODO: implement the rest of Rhoad's algorithm
		// TODO find both intersection points, see if each is on segment
		points.push(foot); // push the perp. foot for now
	}
	return points;
};

Arc.prototype.getReflectionPoints = function(collisions) {
	var ref_points = [];

	for (var i=0; i<collisions.length; i++) {
		ref_points.push(new Point(Number((2*collisions[i].foot.x-this.center.x).toFixed(1)), 
								Number((2*collisions[i].foot.y-this.center.y).toFixed(1))));
	}
	return ref_points;
};

// Returns a list of collision objects, one for each segment
// that the ripple is colliding with.
Arc.prototype.getAllCollisions = function() {
	var collisions = [];

	// cull the list of collidables
	var collidables = clone(level.collidables);
	for (var i=0; i<this.ignore_list.length; i++) {
		// assumes everything in ignore_list is in collidables.
		collidables.splice(collidables.indexOf(this.ignore_list[i]), 1);
	}

    // TODO: is arc intersecting with another arc?

	for (var i=0; i<collidables.length; i++) {
		var points = this.getCollisionPoints(collidables[i]);
		if (points.length > 0) {
			collisions.push(new Collision(collidables[i], 
										  points, 
							  			  this.center.getPerpendicularFoot(collidables[i])
			));
		}
	}
	//return points;
	return collisions;
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
