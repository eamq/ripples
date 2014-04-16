function World() {
    this.level = new Level(); // TODO: load level from file
    this.ripples = [];
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

        // move ripple and process any collisions
        this.ripples[i].move();
        this.processCollisions(this.ripples[i]);
    }
    // TODO: move all obstacles
};

World.prototype.createRipple = function(x, y) {
    if (this.ripples.length < this.level.maxRipples && this.numArcs < maxArcs) {
        this.ripples.push(new Ripple(Math.round(x), Math.round(y)));
        this.numArcs++;
    }
};

// High-level collision detection function.
World.prototype.processCollisions = function(ripple) {
    for (var i=0; i<ripple.arcs.length; i++) {
        // Simple collisions
        ripple.arcs[i].collisions = ripple.arcs[i].getAllCollisions(this.level); //TODO: move me after depth check for opto
        if (this.numArcs >= maxArcs || ripple.arcs[i].depth >= this.level.maxDepth) {
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
                arc.reflected_segment = ripple.arcs[i].collisions[j].segment;
                arc.depth = ripple.arcs[i].depth + 1;
                ripple.arcs.push(arc);
                this.numArcs++;
            }
        }
        // TODO: Complex collisions
        // For each arc, check if it's colliding with any other arc
        //   TODO: maybe check for collsions with other ripple's arcs?
        // If you are colliding with an arc, add the collisions to its 
        //   collision list, and add current arc to other arc's ignore_list
    }
};
