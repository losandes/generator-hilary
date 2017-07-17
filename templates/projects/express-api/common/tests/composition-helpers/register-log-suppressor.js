module.exports = function (scope, next) {
    'use strict';

    scope.register({ name: 'logger', factory: {
            debug: log,
            trace: log,
            info: log,
            warn: log,
            error: log,
            fatal: log
        }
    });

    next(null, scope);
};

var log = function () { /*suppressed*/ };
