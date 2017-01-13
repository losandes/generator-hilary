'use strict';

var Hilary = require('hilary'),
    errorHandling = require(relativeToRoot('error-handling')),
    env = require('./mockEnvironment.js'),
    express = require(relativeToRoot('express')),
    VersionHandler = require(relativeToRoot('express/VersionHandler.js')),
    registerBdd = require('../composition-helpers/register-bdd.js'),
    registerLogSuppressor = require('../composition-helpers/register-log-suppressor.js'),
    VersionHandleSpec = require('./VersionHandler-spec.js');

function relativeToRoot(path) { return '../../' + path; }

new Hilary().Bootstrapper({
    composeLifecycle: function (err, scope, pipeline) {
        pipeline.register.on.error(function (err) {
            console.log(err);
        });
    },
    composeModules: function (err, scope) {
        scope.autoRegister(errorHandling);
        scope.autoRegister(express);
        scope.register({name: 'VersionHandlerFactory', factory: function () { return VersionHandler.factory; }});
        scope.register(env);
        registerBdd(scope);
        registerLogSuppressor(scope);

        scope.register(VersionHandleSpec);

        scope.register({
            name: 'fixture',
            dependencies: ['describe'],
            factory: function (describe) {

                describe('express middleware,', function () {
                    scope.resolve('VersionHandler-spec');
                });

                return true;
            }
        });
    },
    onComposed: function (err, scope) {
        scope.resolve('fixture');
    }
});
