module.exports.name = 'exceptions';
module.exports.dependencies = ['ExceptionHandler'];
module.exports.factory = function (ExceptionHandler) {
    'use strict';

    return new ExceptionHandler(function (exception) {
        console.error(exception);
    });
};
