////////////
// Ripple //
////////////
function Ripple(point, maxTimer) { 
	this.timer = this.maxTimer = maxTimer;

	this.arcs = [new Arc(point)];

	this.color = {
		'red': Math.round(Math.random() * 215),
		'green': Math.round(Math.random() * 215),
		'blue': Math.round(Math.random() * 215)
	};
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
	this.timer--;
	for (var i=0; i<this.arcs.length; i++) {
		this.arcs[i].radius += 1.5; // TODO: Make this independent of timeStep
	}
};
