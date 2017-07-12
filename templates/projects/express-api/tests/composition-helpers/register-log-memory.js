module.exports = register;

var logs = [],
    log = function (arg) {
        'use strict';

        if (typeof arg === 'string') {
            // supress output and add to array instead
            logs.push({ message: arg, err: null });
        } else if (arg && arg.message) {
            // supress output and add to array instead
            logs.push({ message: arg.message, err: arg });
        } else {
            console.log(this.args);
        }
    };

function register (scope) {
    'use strict';

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
}

function getLogs () {
    'use strict';

    return logs;
}

function findByMessage (message) {
    'use strict';

    return logs.filter(function (log) {
        return log.message === message;
    });
}
