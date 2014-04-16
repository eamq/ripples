//////////////
// Renderer //
//////////////
// Controls everything related to drawing to the screen.
function Renderer() {
    this.ctx = canvas.getContext('2d');
};

// Draws our welcome screen
Renderer.prototype.welcome = function() {
    this.ctx.save();

    this.ctx.font = "3em Ubuntu";
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = "rgba(40, 120, 215, 0.4)";
    this.ctx.strokeStyle = "#000000";

    this.ctx.translate(width/2, height/2);
    for (var i=0; i<2; i++) {
        this.ctx.rotate(Math.PI);
        this.ctx.fillText("ripples", -width/2, height/2);
        this.ctx.strokeText("ripples", -width/2, height/2);
    }
    this.ctx.restore();

    this.ctx.save();
    this.ctx.font = "0.8em Ubuntu";
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';
    this.ctx.strokeStyle = "#DDDDDD";
    this.ctx.fillStyle = "#333333";
    this.ctx.strokeText("\u00A9 2014 eamq.net", width - 3, height);
    this.ctx.fillText("\u00A9 2014 eamq.net", width - 3, height);

    this.ctx.restore();
};

// Draws the level and all ripples to the canvas
Renderer.prototype.render = function(world) {
    // Clear canvas
    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);

    // TODO: Draw background:

    // Draw midground:
    //   Ripples
    //   Obstacles
    for (var i=0; i<world.ripples.length; i++) {
        this.drawRipple(world.ripples[i]);
        if (debug) {
            this.drawCollisions(world.ripples[i]);
        }
    }
    this.drawObstacles(world.level);

    // Draw foreground
    //   Level
    this.drawLevel(world.level);
    // Yeah, it's weird having the level in the foreground. This is to ensure
    // that the ripples don't show on top of the borders/obstacles they're
    // reflecting off of. 

    // TODO: put welcome screen/menu fade here
    //   maybe obscure area outside border? would prefer to 
    //   just not draw ripples outside the border :-/
    this.ctx.restore();
};

// Draws the pause screen overlay
Renderer.prototype.pause = function() {
    this.ctx.save();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    this.ctx.fillRect(0, 0, width, height);

    // TODO: shifting gradient fill?
    this.ctx.font = "3em Ubuntu";
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = "alphabetic";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillText("paused", 0, height);
    this.ctx.strokeText("paused", 0, height);

    this.ctx.restore();
};

// Draws a single ripple
Renderer.prototype.drawRipple = function(ripple) {
    var alpha = 1.0 - ((maxTimer - ripple.timer) / maxTimer);
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(" +
                  ripple.color['red'] + ", " +
                  ripple.color['green'] + ", " +
                  ripple.color['blue'] + ", " +
                  alpha + ")";
    // not sure if we want this in the long run, but damn it's pretty
    this.ctx.fillStyle = "rgba(" +
                 ripple.color['red'] + ", " +
                 ripple.color['green'] + ", " +
                 ripple.color['blue'] + ", " +
                 0.1 * alpha + ")";
    for (var i=0; i<ripple.arcs.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(ripple.arcs[i].center.x,
                ripple.arcs[i].center.y,
                ripple.arcs[i].radius,
                ripple.arcs[i].start,
                ripple.arcs[i].end);
        //if (ripple.arcs[i].reflected_segment) {
        //  this.ctx.fillStyle = "#FFFFFF";
        //}
        this.ctx.fill();
        this.ctx.stroke();
    }
    this.ctx.restore();
};

// Shows all collisions on a ripple
Renderer.prototype.drawCollisions = function(ripple) {
    this.ctx.save();
    this.ctx.strokeStyle = "#FF0000";
    for (var i=0; i<ripple.arcs.length; i++) {
        for (var j=0; j<ripple.arcs[i].collisions.length; j++) {
            for (var k=0; k<ripple.arcs[i].collisions[j].points.length; k++) {
                this.ctx.beginPath();
                this.ctx.arc(ripple.arcs[i].collisions[j].points[k].x, ripple.arcs[i].collisions[j].points[k].y, 4, 0, TWO_PI);
                this.ctx.stroke();
            }
        }
    }
    this.ctx.restore();
};

// Draws a level and all obstacles to the canvas
Renderer.prototype.drawLevel = function(level) {
    this.ctx.save();
    // TODO: draw background
    // draw edges
    this.ctx.strokeStyle = "#000000";
    this.ctx.beginPath();
    for (var i=0; i<level.border.length; i++) {
        this.ctx.lineTo(level.border[i].x, level.border[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    // TODO: fill. use alpha to let fancy backgrounds shine through?
    // TODO: draw fancy border effect
    // TODO: draw foreground
    this.ctx.restore();
};

// Draws an obstacle
Renderer.prototype.drawObstacles = function(level) {
    this.ctx.save();
    this.ctx.strokeStyle = "#333333";
    for (var i=0; i<level.obstacles.length; i++) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        for (var j=0; j<level.obstacles[i].points.length; j++) {
            this.ctx.lineTo(level.obstacles[i].points[j].x, level.obstacles[i].points[j].y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
    this.ctx.restore;
};
