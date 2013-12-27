function Ripple(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 0;
	this.start = 0;
	this.end = 2 * Math.PI;

	this.red = Math.round(Math.random() * 215);
	this.blue = Math.round(Math.random() * 215);
	this.green = Math.round(Math.random() * 215);

	this.timer = maxTimer;

	this.arcs = []
};

Ripple.prototype.move = function() {
	if (this.timer > 0) {
		// TODO: if intersecting, create new reflected arc
		this.radius++;
		this.timer--;
	}
	else {
		// remove ripple from list
		ripples.splice(ripples.indexOf(this), 1);
	}
};

Ripple.prototype.draw = function() {
	var alpha = 1.0 - ((maxTimer - this.timer) / maxTimer);
	ctx.strokeStyle = "rgba(" +
						this.red + ", " +
						this.blue + ", " +
						this.green + ", " +
						alpha + ")";
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, this.start, this.end);
	ctx.stroke();
};
