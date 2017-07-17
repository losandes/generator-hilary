'use strict';
var logs = [];

module.exports = function (scope, next) {
    scope.register({ name: 'logger', factory: {
            debug: log,
            trace: log,
            info: log,
            warn: log,
            error: log,
            fatal: log,
            getLogs: getLogs,
            findByMessage: findByMessage
        }
    });

    next(null, scope);
};

function log (arg) {
    if (typeof arg === 'string') {
        // supress output and add to array instead
        logs.push({ message: arg, err: null });
    } else if (arg && arg.message) {
        // supress output and add to array instead
        logs.push({ message: arg.message, err: arg });
    } else {
        console.log(arguments);
    }
}

function getLogs () {
    return logs;
}

function findByMessage (message) {
    return logs.filter(function (log) {
        return log.message === message;
    });
}
