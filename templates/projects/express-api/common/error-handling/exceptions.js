module.exports.name = 'exceptions';
module.exports.singleton = true;
module.exports.dependencies = ['ExceptionHandler'];
module.exports.factory = function (ExceptionHandler) {
    'use strict';

    return new ExceptionHandler(function (exception) {
        console.error(exception);
    });
};
