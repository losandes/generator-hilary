Hilary.scope('<%= scope %>').register({
    name: 'ExceptionHandler',
    dependencies: ['hilary::is'],
    factory: function (is) {
        'use strict';

        return function (onError) {
            var self = {
                makeException: undefined,
                makeArgumentException: undefined,
                throw: undefined,
                throwArgumentException: undefined
            };

            onError = (typeof onError === 'function') ? onError : function (error) {
                console.error(error);
                throw error;
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

                err.type = err.type || 'error';

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

            self.throw = function (error, data) {
                onError(self.makeException(error, data));
            };

            self.throwArgumentException = function (error, argument, data) {
                onError(self.makeArgumentException(error, argument, data));
            };

            self.throwWithInnerError = function (error, innerError, data) {
                var err = self.makeException(error, data);
                err.innerError = self.makeException(innerError);
                onError(err);
            };

            return self;
        };
    }
});
