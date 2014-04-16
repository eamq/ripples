// Ripples
// Copyright 2014 Eamonn Comerford

var canvas = document.getElementById('ripples');

var width = this.canvas.width;
var height = this.canvas.height;

var debug = false;

var maxTimer = 300; // TODO: make this independent of timeStep

var maxArcs = 600;

var timeStep = 17; // in ms, equal to (1000/desired_fps)

// Create the game engine.
var engine = new Engine();