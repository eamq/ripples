////////////
// Ripple //
////////////
function Ripple(x, y) { 
	this.timer = maxTimer;

	this.arcs = [new Arc(x, y)];

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
			// TODO: chop arc into smaller arcs, determine which to no longer draw
			var ref_points = this.arcs[i].getReflectionPoints(points);
			for (var j=0; j<ref_points.length; j++) {
				var arc = new Arc(ref_points[j].x, ref_points[j].y, this.arcs[i].radius);
				if (!this.isArcInList(arc)) {
					this.arcs.push(arc);
				}
			}
		}
	}
};

Ripple.prototype.isArcInList = function(arc) {
	for (var i=0; i<this.arcs.length; i++) {
		if (this.arcs[i].equals(arc)) {
			return true; 
		}
	}
	return false;
};

Ripple.prototype.move = function() {
	this.processCollisions();
	this.timer--;
	for (var i=0; i<this.arcs.length; i++) {
		this.arcs[i].radius += 1.5; // TODO: Make this independent of timeStep
	}
};

Ripple.prototype.draw = function() {
	var alpha = 1.0 - ((maxTimer - this.timer) / maxTimer);
	ctx.save();
	ctx.strokeStyle = "rgba(" +
						this.color['red'] + ", " +
						this.color['green'] + ", " +
						this.color['blue'] + ", " +
						alpha + ")";
	// not sure if we want this in the long run, but damn it's pretty
	ctx.fillStyle = "rgba(" +
						this.color['red'] + ", " +
						this.color['green'] + ", " +
						this.color['blue'] + ", " +
						0.1 * alpha + ")";
	for (var i=0; i<this.arcs.length; i++) {
		// TODO: move to Arc.draw()
		ctx.beginPath();
		ctx.arc(this.arcs[i].x, 
				this.arcs[i].y, 
				this.arcs[i].radius, 
				this.arcs[i].start, 
				this.arcs[i].end);
		ctx.stroke();
		ctx.fill();
	}
	ctx.restore();
};
