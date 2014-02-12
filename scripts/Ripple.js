function Ripple(x, y, radius, start, end) { 
	this.x = x;
	this.y = y;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	// TODO: move start and end to Arc (maybe x and y too)
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? 2 * Math.PI : end;

	this.arcs = [new Arc(this.x, this.y, this.radius, this.start, this.end)];

	this.timer = maxTimer;

	this.color = {
		'red': Math.round(Math.random() * 215),
		'green': Math.round(Math.random() * 215),
		'blue': Math.round(Math.random() * 215)
	};
};

// High-level collision detection function.
Ripple.prototype.processCollisions = function() {
	for (var i=0; i<this.arcs.length; i++) {
		var points = this.arcs[i].getAllCollisionPoints();
		if (points) {
			var ref_points = this.arcs[i].getReflectionPoints(points);
			for (var j=0; j<ref_points.length; j++) {
				if (!this.isArcInList(ref_points[j])) {
					this.arcs.push(new Arc(ref_points[j].x, ref_points[j].y, this.radius));
				}
			}
		}
	}
};

Ripple.prototype.isArcInList = function(point) {
	for (var i=0; i<this.arcs.length; i++) {
		if (point.x === this.arcs[i].x && point.y === this.arcs[i].y) {
			return true;
		}
	}
	return false;
};

Ripple.prototype.move = function() {
	this.processCollisions();
	this.radius++;
	this.timer--;
	for (var i=0; i<this.arcs.length; i++) {
		this.arcs[i].radius++;
	}
};

Ripple.prototype.draw = function() {
	var alpha = 1.0 - ((maxTimer - this.timer) / maxTimer);
	ctx.strokeStyle = "rgba(" +
						this.color['red'] + ", " +
						this.color['green'] + ", " +
						this.color['blue'] + ", " +
						alpha + ")";
	for (var i=0; i<this.arcs.length; i++) {
		ctx.beginPath();
		ctx.arc(this.arcs[i].x, 
				this.arcs[i].y, 
				this.arcs[i].radius, 
				this.arcs[i].start, 
				this.arcs[i].end);
		ctx.stroke();
	}
};
