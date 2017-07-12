/*globals describe, it, xit, before, after*/
module.exports = register;

var chai = require('chai');

function register (scope) {
    'use strict';

    scope.register({ name: 'describe', factory: function () { return describe; } });
    scope.register({ name: 'expect', factory: function () { return chai.expect; } });
    scope.register({ name: 'it', factory: function () { return it; } });
    scope.register({ name: 'xit', factory: function () { return xit; } });
    scope.register({ name: 'before', factory: function () { return before; } });
    scope.register({ name: 'after', factory: function () { return after; } });
}
