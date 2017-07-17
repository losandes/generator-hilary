'use strict';
var testComposition = require('../../tests/testComposition.js');

testComposition.compose([
    function (scope, next) {
        scope.register(require('./express-request-ids-spec.js'));
        scope.register(require('./VersionHandler-spec.js'));
        scope.register(require('./ApiVersion-which-spec.js'));
        scope.register(require('./ApiVersion-get-spec.js'));
        next(null, scope);
    }
], function (err, scope) {
    scope.resolve('express-request-ids-spec').run();
    scope.resolve('VersionHandler-spec').run();
    scope.resolve('ApiVersion-which-spec').run();
    scope.resolve('ApiVersion-get-spec').run();
});
