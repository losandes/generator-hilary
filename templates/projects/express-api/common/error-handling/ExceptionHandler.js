module.exports.name = 'ExceptionHandler';
module.exports.singleton = true;
module.exports.dependencies = ['Exception', 'logger'];
module.exports.factory = function (Exception, logger) {
    'use strict';

    return function (onError) {
        var self = {
            throw: undefined,
            types: {
                default: 'EXCEPTION',
                argument: 'INVALID_ARGUMENT_EXCEPTION',
                notImplemented: 'NOT_IMPLEMENTED_EXCEPTION'
            }
        };

        onError = (typeof onError === 'function') ? onError : function (error) {
            logger.error(error);
            throw error;
        };

        self.throw = function (err) {
            if (err && err.isException) {
                return onError(err);
            } else if (err && (err.type || err.error || err.messages)) {
                return onError(new Exception(err));
            }

            return onError(new Exception({
                type: self.types.default,
                error: err
            }));
        };

        return self;
    };
};
