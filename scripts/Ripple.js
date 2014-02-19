////////////
// Ripple //
////////////
function Ripple(x, y) { 
	this.timer = maxTimer;

	this.arcs = [new Arc(new Point(x, y))];
	numArcs++;

	this.collision_points = [];

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
		//this.collision_points = points;
		this.collision_points = this.collision_points.concat(points);
		// TODO: chop arc into smaller arcs, determine which to no longer draw
		var ref_points = this.arcs[i].getReflectionPoints(points);
		for (var j=0; j<ref_points.length; j++) {
			if (numArcs < maxArcs) {
				var arc = new Arc(ref_points[j], this.arcs[i].radius);
				if (!this.isArcInList(arc)) {
					this.arcs.push(arc);
					numArcs++;
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
		this.arcs[i].radius += 2; // TODO: Make this independent of timeStep
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
		this.arcs[i].draw();
	}
	ctx.restore();
};

Ripple.prototype.drawCollisions = function() {
	if (this.collision_points.length > 0) {
		ctx.save();
		ctx.strokeStyle = "#FF0000";
		for (var j=0; j<this.collision_points.length; j++) {
			ctx.beginPath();
			ctx.arc(this.collision_points[j].x, this.collision_points[j].y, 10, 0, TWO_PI);
			ctx.stroke();
		}
		ctx.restore();
	}
};
