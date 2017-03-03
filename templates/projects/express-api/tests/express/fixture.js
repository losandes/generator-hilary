'use strict';

var Hilary = require('hilary'),
    polyn = require('polyn'),
    ObjectID = require('bson-objectid'),
    errorHandling = require(relativeToRoot('error-handling')),
    env = require('./mockEnvironment.js'),
    express = require(relativeToRoot('express')),
    VersionHandler = require(relativeToRoot('express/VersionHandler.js')),
    makeReadOnly = require(relativeToRoot('common/makeReadOnly.js')),
    registerBdd = require('../composition-helpers/register-bdd.js'),
    registerLogSuppressor = require('../composition-helpers/register-log-suppressor.js'),
    expressRequestIdsSpec = require('./express-request-ids-spec.js'),
    VersionHandlerSpec = require('./VersionHandler-spec.js');

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
        scope.register(env);
        scope.register(makeReadOnly);
        scope.register({name: 'VersionHandlerFactory', factory: function () { return VersionHandler.factory; }});

        scope.register({ name: 'ObjectID', singleton: true, dependencies: [], factory: ObjectID });
        scope.register({ name: 'polyn::is', singleton: true, dependencies: [], factory: polyn.is });

        registerBdd(scope);
        registerLogSuppressor(scope);

        scope.register(expressRequestIdsSpec);
        scope.register(VersionHandlerSpec);

        scope.register({
            name: 'fixture',
            dependencies: ['describe'],
            factory: function (describe) {

                describe('express middleware,', function () {
                    scope.resolve('express-request-ids-spec');
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
