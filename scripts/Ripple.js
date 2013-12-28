function Ripple(x, y, radius, start, end) { 
	this.x = x;
	this.y = y;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? 2 * Math.PI : end;

	this.timer = maxTimer;

	this.color = {
		'red': Math.round(Math.random() * 215),
		'green': Math.round(Math.random() * 215),
		'blue': Math.round(Math.random() * 215)
	}

	this.drawnRefPoints = {};
	this.drawnRefPoints[[x, y]] = true;

	this.tempRefPoints = [];

};

// Returns a list of points of intersection with the given line segment.
//
// Side Effects: adds "mirrored" points to this.refPoints for later use
Ripple.prototype.isIntersectingLine = function(p1, p2) {
	var x1 = p1[0]
	var y1 = p1[1]
	var x2 = p2[0]
	var y2 = p2[1]

	var dx = x1 - x2;
	var dy = y1 - y2;

	// is perpendicular distance greater than the radius?
	var pd = Math.abs((dy*this.x) - (dx*this.y) + (x1*y2) - (x2*y1))/Math.sqrt((dx*dx) + (dy*dy));
	if (pd > this.radius) {
		return false;
	}

	// will arc miss segment?
	var angle1 = (Math.atan((y1-this.y)/(x1-this.x)) + 2*Math.PI) % 2*Math.PI;
	var	angle2 = (Math.atan((y2-this.y)/(x2-this.x)) + 2*Math.PI) % 2*Math.PI;
	if ((angle1 < this.start || angle1 > this.end) &&
			(angle2 < this.start || angle2 > this.end)) {
		return false;
	}

	// perpendicular foot on line segment?
	var k = (dy*(this.x-x1) - dx*(this.y-y1))/((dx*dx) + (dy*dy));
	var px = this.x - k * dy;
	var py = this.y + k * dx;
	var refPoint = [2*px-this.x, 2*py-this.y];
	if (px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
			py >= Math.min(y1, y2) && py <= Math.max(y1, y2)) {
		if (this.tempRefPoints.indexOf(refPoint) == -1) {
			this.tempRefPoints.push(refPoint);
		}
		return true;
	}
	
	// is distance from the closest endpoint less than the radius?
	var dist = Math.min(Math.sqrt(Math.pow(x1-this.x, 2) + Math.pow(y1-this.y, 2)),
		Math.sqrt(Math.pow(x2-this.x, 2) + Math.pow(y2-this.y, 2)));
	if (dist < this.radius) {
		if (this.tempRefPoints.indexOf(refPoint) == -1) {
			this.tempRefPoints.push(refPoint);
		}
		return true;
	}
	else {
		return false;
	}
};

// Reflection off edge of canvas
Ripple.prototype.isIntersectingCanvas = function() {
	return this.isIntersectingLine([0,0], [width, 0]) ||                // top
		this.isIntersectingLine([width, 0], [width, height]) ||  // right
		this.isIntersectingLine([0, height], [width, height]) || // bottom
		this.isIntersectingLine([0, 0], [0, height]);			 // left
};

Ripple.prototype.move = function() {
	for (var i=0; i<this.tempRefPoints.length; i++) {
		var x = this.tempRefPoints[i][0];
		var y = this.tempRefPoints[i][1]
		if (!([x, y] in this.drawnRefPoints)) {
			this.drawnRefPoints[[x, y]] = true;
			var r = new Ripple(x, y, this.radius);
			r.timer = this.timer;
			r.color = this.color;
			r.drawnRefPoints = clone(this.drawnRefPoints);
			ripples.push(r);
		}
	}
	this.tempRefPoints = [];
	this.radius++;
	this.timer--;
};

Ripple.prototype.draw = function() {
	var alpha = 1.0 - ((maxTimer - this.timer) / maxTimer);
	ctx.strokeStyle = "rgba(" +
						this.color['red'] + ", " +
						this.color['green'] + ", " +
						this.color['blue'] + ", " +
						alpha + ")";
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, this.start, this.end);
	ctx.stroke();
};
