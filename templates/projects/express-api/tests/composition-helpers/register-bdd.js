/*globals describe, it, xit, before, after*/
module.exports = register;

var chai = require('chai');

function register (scope) {
    'use strict';

    scope.register({ name: 'describe', singleton: true, factory: function () { return describe; } });
    scope.register({ name: 'expect', singleton: true, factory: function () { return chai.expect; } });
    scope.register({ name: 'it', singleton: true, factory: function () { return it; } });
    scope.register({ name: 'xit', singleton: true, factory: function () { return xit; } });
    scope.register({ name: 'before', singleton: true, factory: function () { return before; } });
    scope.register({ name: 'after', singleton: true, factory: function () { return after; } });
}
