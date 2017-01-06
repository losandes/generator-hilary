module.exports.name = 'express-errors-500';
module.exports.singleton = true;
module.exports.dependencies = [];
module.exports.factory = function () {
    'use strict';

    var env = process.env.NODE_ENV || 'development';
    
    return function (err, req, res, next) {
        var errorBody;

        if (typeof err === 'string') {
            err = new Error(err);
        }

        if (env === 'development') {
            // development error handler
            // will print stacktrace
            errorBody = { title: 'error', message: err.message, error: err };
        } else {
            // production error handler
            // no stacktraces leaked to user
            errorBody = { title: 'error', message: err.message, error: {} };
        }

        res.status(err.status || 500);
        res.send(errorBody);
    };
};
