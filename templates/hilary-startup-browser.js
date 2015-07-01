/*globals Hilary, console*/
(function (scope) {
    "use strict";

    var compose, start;

    /*
    // Orchestrates composition of the application dependency graph
    */
    compose = function (onReady) {

    };

    /*
    // Orchestrates startup
    */
    start = function () {
        
        compose(function () {
            // onReady
        });
        
    };

    // START
    start();

}(Hilary.scope('<%= scope %>')));
