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

Point.prototype.getPerpendicularFoot = function(seg) {
	var dx = seg.p2.x - seg.p1.x;
	var dy = seg.p2.y - seg.p1.y;
	var k = (dy*(this.x-seg.p1.x) - dx*(this.y-seg.p1.y))/((dx*dx) + (dy*dy));

	return new Point(Number((this.x - k * dy).toFixed(1)), 
					Number((this.y + k * dx).toFixed(1)));
};

Point.prototype.getPerpendicularDistance = function(seg) {
	var dx = seg.p2.x - seg.p1.x;
	var dy = seg.p2.y - seg.p1.y;
	return Math.abs((dy*this.x) - (dx*this.y) + (seg.p2.x*seg.p1.y) - (seg.p1.x*seg.p2.y))/Math.sqrt((dx*dx) + (dy*dy));
};

Point.prototype.isPointOnSegment = function(seg) {
	var crossproduct = (this.y - seg.p1.y) * (seg.p2.x - seg.p1.x) - (this.x - seg.p1.x) * (seg.p2.y - seg.p1.y);
	if (Math.abs(crossproduct) > EPSILON) {
		return false;
	}
	var dotproduct = (this.x - seg.p1.x) * (seg.p2.x - seg.p1.x) + (this.y - seg.p1.y) * (seg.p2.y - seg.p1.y);
	if (dotproduct < 0) {
		return false;
	}
	var squaredlength = Math.pow(seg.p2.x - seg.p1.x, 2) + Math.pow(seg.p2.y - seg.p1.y, 2);
	if (dotproduct > squaredlength) {
		return false;
	}
	return true;
};

// optimized version of isPointOnSegment
Point.prototype.isPerpendicularFootOnSegment = function(seg) {
	return this.x >= Math.min(seg.p1.x, seg.p2.x) && this.x <= Math.max(seg.p1.x, seg.p2.x) &&
		   this.y >= Math.min(seg.p1.y, seg.p2.y) && this.y <= Math.max(seg.p1.y, seg.p2.y);
};


///////////////////
// Segment class //
///////////////////
function Segment(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};


/////////////////////
// Collision class //
/////////////////////
function Collision(segment, points, foot) {
	this.segment = segment;
	this.points = (typeof points === "undefined") ? [] : points;
	this.foot = (typeof foot === "undefined") ? null : foot;
};


///////////////////////////////
// Geometry helper functions //
///////////////////////////////

// segments will be created between adjacent points
// in "points", and the last point will be connected to the first.
function createSegments(points) {
    var segments = [];
    if (points.length == 2) {
        return [points];
    }
    for (var i=0; i<points.length; i++) {
        if (i == 0) {
            segments.push(new Segment(points[points.length - 1], points[i]));
        } else {
            segments.push(new Segment(points[i - 1], points[i]));
        }
    }
    return segments;
};


///////////////
// Constants //
///////////////
var TWO_PI = 2 * Math.PI;
var EPSILON = 0.1;