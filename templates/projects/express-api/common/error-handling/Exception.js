module.exports.name = 'Exception';
module.exports.dependencies = ['logger'];
module.exports.factory = function (logger) {
    'use strict';

    var types = {
            default: 'EXCEPTION',
            unknown: 'UNKNOWN'
        },
        copy = {
            errorTypeWarning: 'EXCEPTION WARNING: You should always pass an Error to Exception, to preserve your stack trace',
            emptyOptionsWarning: 'EXCEPTION WARNING: Creating Exceptions without any information yields a pretty hard to follow stack trace'
        };

    /*
    // Exception
    // Make an exception argument of the given type
    // @param info.type: The type of exception
    // @param info.error: An instance of a JS Error
    // @param info.messages: An array of messages
    // @param info.cause: An inner exception, if one exists
    // @param info.data: data associated with the error (for debugging)
    */
    function Exception(info) {
        var err;

        if (!info) {
            logger.warn(copy.emptyOptionsWarning);
        }

        info = info || {};

        err = normalizeError(info.error, info.messages);

        return {
            type: normalizeType(info.type),
            error: err,
            messages: normalizeMessages(err, info.messages),
            cause: info.cause,
            data: info.data,
            isException: true
        };
    } // /ExceptionOfType

    function normalizeType (type) {
        return typeof type === 'string' ? type : types.default;
    }

    function normalizeError (error, messages) {
        if (typeof error === 'string') {
            logger.warn(copy.errorTypeWarning);
            return new Error(error);
        } else if (!error) {
            var message = types.unknown;

            if (messages && Array.isArray(messages) && messages.length) {
                message = messages[0];
            } else if (messages && typeof messages === 'string') {
                message = messages;
            }

            logger.warn(copy.errorTypeWarning);
            return new Error(message);
        }

        return error;
    }

    function normalizeMessages (error, messages) {
        var msgs = [];

        if (Array.isArray(messages)) {
            msgs = messages;
        } else if (messages) {
            msgs.push(messages);
        } else if (!messages && error && error.message) {
            msgs.push(error.message);
        }

        return msgs;
    }

    return Exception;
};
