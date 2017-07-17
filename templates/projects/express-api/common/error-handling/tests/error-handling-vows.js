'use strict';

var testComposition = require('../../tests/testComposition.js');

testComposition.compose([
    function (scope, next) {
        scope.register(require('./ExceptionHandler-spec.js'));
        next(null, scope);
    }
], function (err, scope) {
    scope.resolve('ExceptionHandler-spec').run();
});
