///////////
// World //
///////////
// Main model. Contains the current level and all ripples.
function World() {

    this.level = new Level(); // TODO: load level from file
    this.ripples = [];

    this.maxArcs = 600;
    this.numArcs = 0;
};

World.prototype.update = function() {
    // Move all circles, removing them if necessary.
    for (var i=0; i<this.ripples.length; i++) {

        // remove ripple from list
        if (this.ripples[i].timer == 0) {
            this.numArcs -= this.ripples[i].arcs.length;
            this.ripples.splice(i, 1);
            continue;
        }

        // process any collisions and move ripple
        this.processCollisions(this.ripples[i]);
        this.ripples[i].move();
    }
    // TODO: move all obstacles
};

World.prototype.createRipple = function(x, y) {
    if (this.ripples.length < this.level.maxRipples && this.numArcs < this.maxArcs) {
        this.ripples.push(new Ripple(new Point(Math.round(x), Math.round(y)), this.level.maxTimer));
        this.numArcs++;
    }
};

// High-level collision detection function.
World.prototype.processCollisions = function(ripple) {
    for (var i=0; i<ripple.arcs.length; i++) {
        // get segment collisions
        ripple.arcs[i].collisions = ripple.arcs[i].getSegmentCollisions(this.level); //TODO: move me after depth check for opto
        // get circle collisions
        // For each arc, check if it's colliding with any other arc
        //   TODO: maybe check for collsions with other ripple's arcs? // prob not
        for (var j=0; j<ripple.arcs.length; j++) {
            var collision = ripple.arcs[i].getCircleCollision(ripple.arcs[j]);
            if (collision) {
                ripple.arcs[i].collisions.push(collision);
            }
        }
        // If you are colliding with an arc, add the collisions to its 
        //   collision list, and add current arc to other arc's ignore_list // why?
        if (this.numArcs >= this.maxArcs || ripple.arcs[i].depth >= this.level.maxDepth) {
            continue;
        }
        for (var j=0; j<ripple.arcs[i].collisions.length; j++) {
            // TODO: chop arc into smaller arcs, determine which to no longer draw
            //ripple.arcs[i].sliceArc(ripple.arcs[i].collisions[j]);
            var ref_point = ripple.arcs[i].getReflectionPoint(ripple.arcs[i].collisions[j]);
            if (!ref_point) {
                continue;
            }
            var arc = new Arc(ref_point, ripple.arcs[i].radius, ripple.start, ripple.end);
            if (!ripple.isArcInList(arc)) {
                // TODO: move all of this into Arc
                arc.reflected_collidee = ripple.arcs[i].collisions[j].collidee;
                arc.depth = ripple.arcs[i].depth + 1;
                ripple.arcs.push(arc);
                this.numArcs++;
            }
        }
    }
};
