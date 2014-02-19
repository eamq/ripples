/////////////////
// Point class //
/////////////////
function Point(x, y) {
	this.x = x;
	this.y = y;

};

Point.prototype.getDistance = function(other) {
	return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
};

Point.prototype.getPerpendicularFoot = function(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	var k = (dy*(this.x-p1.x) - dx*(this.y-p1.y))/((dx*dx) + (dy*dy));

	return new Point(Number((this.x - k * dy).toFixed(1)), 
					Number((this.y + k * dx).toFixed(1)));
};

Point.prototype.getPerpendicularDistance = function(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	return Math.abs((dy*this.x) - (dx*this.y) + (p2.x*p1.y) - (p1.x*p2.y))/Math.sqrt((dx*dx) + (dy*dy));
};

Point.prototype.isPointOnSegment = function(p1, p2) {
	var crossproduct = (this.y - p1.y) * (p2.x - p1.x) - (this.x - p1.x) * (p2.y - p1.y);
	if (Math.abs(crossproduct) > EPSILON) {
		return false;
	}
	var dotproduct = (this.x - p1.x) * (p2.x - p1.x) + (this.y - p1.y) * (p2.y - p1.y);
	if (dotproduct < 0) {
		return false;
	}
	var squaredlength = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
	if (dotproduct > squaredlength) {
		return false;
	}
	return true;
};

// optimized version of isPointOnSegment
Point.prototype.isPerpendicularFootOnSegment = function(p1, p2) {
	return this.x >= Math.min(p1.x, p2.x) && this.x <= Math.max(p1.x, p2.x) &&
		   this.y >= Math.min(p1.y, p2.y) && this.y <= Math.max(p1.y, p2.y);
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


///////////////
// Constants //
///////////////
var TWO_PI = 2 * Math.PI;
var EPSILON = 0.1;