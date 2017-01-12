module.exports = register;

var log = function () { /*suppressed*/ };

function register (scope) {
    'use strict';

    scope.register({ name: 'logger', singleton: true, factory: {
            debug: log,
            trace: log,
            info: log,
            warn: log,
            error: log,
            fatal: log
        }
    });
}
