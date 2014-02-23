////////////
// Ripple //
////////////
function Ripple(x, y) { 
	this.timer = maxTimer;

	this.arcs = [new Arc(new Point(x, y))];
	numArcs++;

	this.color = {
		'red': Math.round(Math.random() * 215),
		'green': Math.round(Math.random() * 215),
		'blue': Math.round(Math.random() * 215)
	};
};

// High-level collision detection function.
Ripple.prototype.processCollisions = function() {
	for (var i=0; i<this.arcs.length; i++) {
		this.arcs[i].collisions = this.arcs[i].getAllCollisions(); //TODO: move me after depth check for opto
		for (var j=0; j<this.arcs[i].collisions.length; j++) {
			// TODO: chop arc into smaller arcs, determine which to no longer draw
			//this.arcs[i].sliceArc(this.arcs[i].collisions[j]);
			// don't reflect, but still intersect
			if (this.arcs[i].depth >= maxDepth) {
				continue;
			}
			var ref_point = this.arcs[i].getReflectionPoint(this.arcs[i].collisions[j]);
			if (!ref_point || numArcs >= maxArcs) {
				continue;
			}
			var arc = new Arc(ref_point, this.arcs[i].radius, this.start, this.end);
			arc.reflected_segment = this.arcs[i].collisions[j].segment;
			if (!this.isArcInList(arc)) {
				arc.depth = this.arcs[i].depth + 1;
				this.arcs.push(arc);
				numArcs++;
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
		this.arcs[i].draw();
	}
	ctx.restore();
};

Ripple.prototype.drawCollisions = function() {
	for (var i=0; i<this.arcs.length; i++) {
		this.arcs[i].drawCollisions();
	}
};
