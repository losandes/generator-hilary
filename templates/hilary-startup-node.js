/*jslint node: true*/
"use strict";

// All app variables are defined in start and compose.
// By isolating the app's requirements into the start and compose functions,
// The entire app can be restarted from within, to react to failure, and to
// get into a clean running state when associated services recover from failure.
var scope, compose, start;

/*
// Orchestrates composition of the application dependency graph
*/
compose = function () {

};

/*
// Orchestrates startup
*/
start = function () {
    var Hilary = require('hilary');

    scope = Hilary.scope('<%= scope %>');

    console.log('startup::@' + new Date().toISOString());
    console.log('startup::composing application');

    // compose the application dependency graph
    compose();
};

// !!!!!!!!!!!!!!!!!!!!!!!!!
// START NOW
start();
