(function (scope) {
    'use strict';

    var compose, start;

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
        compose();

        // perform startup tasks (resolve modules here)

        // example
        scope.resolve('example');
    };

    //////////////////////////////////////////////////
    // START IMMEDIATELY
    // note: we don't use an iffe for start, so it can be registered and the app can be restarted
    start();

}(Hilary.scope('<%= scope %>')));
