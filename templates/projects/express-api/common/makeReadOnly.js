module.exports.name = 'common-makeReadOnly';
module.exports.singleton = true;
module.exports.dependencies = ['polyn::is', 'logger'];
module.exports.factory = function (is, logger) {
    'use strict';

    var mutatingArrayFunctions = [
            'setPrototypeOf', 'push', 'pop', 'sort', 'splice', 'shift',
            'unshift', 'reverse'
        ],
        mutatingDateFunctions = [
            'setPrototypeOf', 'setDate', 'setFullYear', 'setHours',
            'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds',
            'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours',
            'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth',
            'setUTCSeconds', 'setYear'
        ],
        DEFAULT_ERROR_TEMPLATE = 'the {{name}} property is read-only';

    /*
    // Example 1 (basic usage):
    // var requestIds = {};
    // makeReadOnly('clientId', clientId).on(requestIds);
    //
    // Example 2 (with error message):
    // var requestIds = {};
    // makeReadOnly('clientId', clientId)
    //      .withSetMessage('clientId on requestIds is immutable')
    //      .on(requestIds);
    */
    function makeReadOnly(name, val) {
        var defaultErrorMessage = DEFAULT_ERROR_TEMPLATE
                .replace(/{{name}}/, name),
            message,
            self = {
                withSetMessage: withSetMessage,
                on: on
            };

        if (is.array(val)) {
            mutatingArrayFunctions.forEach(function (func) {
                val[func] = makeSetter(message);
            });
        } else if (is.datetime(val)) {
            mutatingDateFunctions.forEach(function (func) {
                val[func] = makeSetter(message);
            });
        }

        function withSetMessage (errorMessage) {
            if (is.string(errorMessage)) {
                message = errorMessage;
            }

            return {
                on: on
            };
        }

        function on (obj) {
            Object.defineProperty (obj, name, {
                get: function () { return val; },
                set: makeSetter(message || defaultErrorMessage),
                enumerable: true,
                configurable: false
            });
        }

        return self;
    }

    function makeSetter (message) {
        return function () {
            logger.error(new Error(message));
        };
    }

    return makeReadOnly;
};
