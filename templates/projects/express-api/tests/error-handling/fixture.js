'use strict';

var Hilary = require('hilary'),
    errorHandling = require('../../error-handling'),
    registerBdd = require('../composition-helpers/register-bdd.js'),
    registerLogSuppressor = require('../composition-helpers/register-log-suppressor.js'),
    ExceptionHandlerSpec = require('./ExceptionHandler-spec.js');

new Hilary().Bootstrapper({
    composeLifecycle: function (err, scope, pipeline) {
        pipeline.register.on.error(function (err) {
            console.log(err);
        });
    },
    composeModules: function (err, scope) {
        scope.autoRegister(errorHandling);

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
    },
    onComposed: function (err, scope) {
        scope.resolve('fixture');
    }
});
