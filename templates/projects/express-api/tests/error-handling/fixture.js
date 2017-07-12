'use strict';

var scope = require('hilary').scope('error-handling', { logging: { level: 'error' } }),
    errorHandling = require('../../error-handling'),
    registerBdd = require('../composition-helpers/register-bdd.js'),
    registerLogSuppressor = require('../composition-helpers/register-log-suppressor.js'),
    ExceptionHandlerSpec = require('./ExceptionHandler-spec.js');

scope.register(errorHandling);
registerBdd(scope);
registerLogSuppressor(scope);
scope.register(ExceptionHandlerSpec);

scope.register({
    name: 'fixture',
    dependencies: ['describe'],
    factory: function (describe) {

        describe('error-handling', function () {
            scope.resolve('ExceptionHandler-spec');
        });

        return true;
    }
});

scope.resolve('fixture');
