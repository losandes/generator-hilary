'use strict';

// All app variables are defined in start and compose.
// By isolating the app's requirements into the start and compose functions,
// The entire app can be restarted from within, to react to failure, and to
// get into a clean running state when associated services recover from failure.
var scope, compose, start;

/*
// Orchestrates composition of the application dependency graph
*/
compose = function () {
    // perform composition tasks (register modules here)

    // example
    scope.register({ name: 'example', factory: function () { console.log('example'); } });
    scope.register({ name: 'application', factory: function () { return { compose: compose, start: start }; } });
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

    console.log('startup::starting application');

    // perform startup tasks (resolve modules here)
    
    // example
    scope.resolve('example');

    console.log('startup::application running');
};

//////////////////////////////////////////////////
// START IMMEDIATELY
// note: we don't use an iffe for start, so it can be registered and the app can be restarted
start();
