module.exports.name = 'ExceptionHandler';
module.exports.singleton = true;
module.exports.dependencies = ['hilary::is'];
module.exports.factory = function (is) {
    'use strict';

    return function (onError) {
        var self = {
            makeException: undefined,
            makeArgumentException: undefined,
            throw: undefined,
            throwArgumentException: undefined
        };

        onError = (typeof onError === 'function') ? onError : function (exception) {
            console.error(exception);
            throw exception;
        };

        self.makeException = function (messageOrError, data) {
            var err,
                isDataOnMessage,
                isDataArg,
                prop;

            if (is.object(messageOrError)) {
                err = messageOrError;
            } else if (is.string(messageOrError)) {
                err = new Error(messageOrError);
            } else {
                err = new Error();
            }

            isDataOnMessage = is.defined(err.data);
            isDataArg = is.defined(data);

            if (isDataOnMessage && isDataArg) {
                for (prop in data) {
                    if (data.hasOwnProperty(prop)) {
                        err.data[prop] = data[prop];
                    }
                }
            } else if (isDataArg) {
                err.data = data;
            }

            err.type = err.type || 'exception';

            return err;
        };

        self.makeArgumentException = function (error, argument, data) {
            var err;

            if (is.object(error)) {
                error.type = 'argumentException';
                return self.makeException(error, data);
            } else {
                err = new Error(error);
                err.type = 'argumentException';

                return self.makeException(err, data);
            }
        };

        self.throw = function (exception, data) {
            onError(self.makeException(exception, data));
        };

        self.throwArgumentException = function (error, argument, data) {
            onError(self.makeArgumentException(error, argument, data));
        };

        self.throwWithInnerException = function (exception, innerException, data) {
            var exc = self.makeException(exception, data);
            exc.innerException = self.makeException(innerException);
            onError(exc);
        };

        return self;
    };
};
