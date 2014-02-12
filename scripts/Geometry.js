function Arc(x, y, radius, start, end) {
	this.x = x;
	this.y = y;
	this.radius = (typeof radius === "undefined") ? 0 : radius;
	this.start = (typeof start === "undefined") ? 0 : start;
	this.end = (typeof end === "undefined") ? 2 * Math.PI : end;
};

function Point(x, y) {
	this.x = x;
	this.y = y;
};