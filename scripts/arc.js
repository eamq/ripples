function Arc(x, y, radius, start end) {
	this.x = x;
	this.y = y;
	this.radius = radius,
	this.start = start;
	this.end = end;
};

Arc.prototype.move = function() {

};

Arc.prototype.draw = function() {
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