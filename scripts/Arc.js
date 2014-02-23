/////////
// Arc //
/////////
function Arc(center, radius, start, end) {
	this.center = center;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? TWO_PI : end;

	this.collisions = [];
	this.reflected_segment = null;
	this.depth = 0;
	this.ignore_list = []; // List of segments to ignore for collisions
};

Arc.prototype.equals = function(other) {
	return (this.center.x === other.center.x && 
			this.center.y === other.center.y && 
			//this.start === other.start && 
			//this.end === other.end &&
			this.radius === other.radius
			);
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

Arc.prototype.sliceArc = function(collision) {
	// TODO: one-point collision
	if (collision.points.length == 2) {
		var angles = [
			this.center.getAngle(collision.points[0]) + TWO_PI, 
			this.center.getAngle(collision.points[1]) + TWO_PI
		];
		//angles.sort();
		// TODO: check if the angles lie on the arc
		this.start = angles[0];
		this.end = angles[1];
	}
}

// Returns points of intersection with the given line segment ([] if none exist)
Arc.prototype.getCollision = function(seg) {

	var collision = new Collision(seg);

	if (this.radius == 0) {
		return null;
	}

	// quick check for no collision
	if (this.center.getPerpendicularDistance(seg) > this.radius) {
		return null;
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
	var bigD = (x1 * y2) - (x2 * y1);
	var discriminant = (this.radius*this.radius) * (dr*dr) - (bigD*bigD);

	var foot = this.center.getPerpendicularFoot(seg);
	collision.foot = foot;

	// we already know discriminant >= 0, because of the quick check above
	// if disc. == 0, 1 intersection (tangent line at perp. foot)
	if (discriminant == 0) {
		if (foot.isPerpendicularFootOnSegment(seg)) {
			collision.points.push(foot);
			return collision
		} else {
			return null;
		}
	} else {
		// if disc. > 0, 2 (possible) intersection points
		var segment = this.rankEndpointsByDistance(seg);
		if (this.center.getDistance(segment['closest']) <= this.radius) {
			if (this.center.getDistance(segment['farthest']) <= this.radius) {
				// both endpoints are inside arc
				// cull this segment from future collision detection?
				// TODO: expanding arcs (ie, the initial reflection) will need
				//    to keep reflecting along the line, not just the segment
				this.ignore_list.push(seg);
				return null;
			} 
		} else if (!foot.isPerpendicularFootOnSegment(seg)) {
		//if (!foot.isPerpendicularFootOnSegment(seg)) {
			// no insersection with segment
			return null;
		}
		// TODO: implement the rest of Rhoad's algorithm
		// TODO find both intersection points, see if each is on segment
		var x1 = Number(((bigD * dy + rhoadSign(dy) * dx * Math.sqrt(discriminant))/(dr * dr) + this.center.x).toFixed(2));
		var x2 = Number(((bigD * dy - rhoadSign(dy) * dx * Math.sqrt(discriminant))/(dr * dr) + this.center.x).toFixed(2));
		var y1 = Number(((-bigD * dx + Math.abs(dy) * Math.sqrt(discriminant))/(dr * dr) + this.center.y).toFixed(2));
		var y2 = Number(((-bigD * dx - Math.abs(dy) * Math.sqrt(discriminant))/(dr * dr) + this.center.y).toFixed(2));
		var intPoints = [new Point(x1, y1), new Point(x2, y2)];
		for (var i=0; i<intPoints.length; i++) {
			if (intPoints[i].isPointOnSegment(seg)) {
				collision.points.push(intPoints[i]);
			}
		}
		//points.push(foot); // push the perp. foot for now
	}
	if (collision.points.length > 0) {
		return collision;
	} else {
		return null;
	}
};

Arc.prototype.getReflectionPoint = function(collision) {
	return new Point(Math.round(2 * collision.foot.x - this.center.x), 
					 Math.round(2 * collision.foot.y - this.center.y));
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
		var collision = this.getCollision(collidables[i]);
		if (collision) {
			collisions.push(collision);
		}
	}
	//return points;
	return collisions;
};

// Requires stroke/fill style to be set prior to calling
Arc.prototype.draw = function(counter) {
	var counter = (typeof counter === "undefined") ? false : counter;
	ctx.save();
	ctx.beginPath();
	ctx.arc(this.center.x,
			this.center.y,
			this.radius,
			this.start,
			this.end,
			counter);
	//if (this.reflected_segment) {
	//	ctx.fillStyle = "#FFFFFF";
	//}
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

Arc.prototype.drawCollisions = function() {
	ctx.save();
	ctx.strokeStyle = "#FF0000";
	for (var i=0; i<this.collisions.length; i++) {
		for (var j=0; j<this.collisions[i].points.length; j++) {
			ctx.beginPath();
			ctx.arc(this.collisions[i].points[j].x, this.collisions[i].points[j].y, 4, 0, TWO_PI);
			ctx.stroke();
		}
	}
	ctx.restore();
}