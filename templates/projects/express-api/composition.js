'use strict';

module.exports.init = init;

var Hilary = require('hilary'),
    express = require('express'),
    environment = require('./environment.js'),
    errorHandling = require('./error-handling'),
    api = require('./api'),
    expressConfig = require('./express'),
    log = console.log;

function init() {
    Hilary.scope('myScope').Bootstrapper({
        composeLifecycle: function (err, scope, pipeline) {
            var exceptions;

            log('startup::@' + new Date().toISOString());
            log('startup::composing application lifecycle');

            pipeline.on.error(function (err) {
                try {
                    // try, in case this is triggered before exceptions are registered
                    if (!exceptions) {
                        exceptions = scope.resolve('exceptions');
                    }

                    exceptions.throw(err);
                } catch (e) {
                    log(err);
                    log(e);
                }
            });
        },
        composeModules: function (err, scope) {
            // perform composition tasks (register modules here)
            log('startup::composing application modules');

            scope.register(environment);
            scope.autoRegister(errorHandling);
            scope.autoRegister(expressConfig);
            scope.autoRegister(api);

            scope.register({
                name: 'appDir',
                singleton: true,
                factory: __dirname
            });

            composeExpress(scope);
        },
        onComposed: function (err, scope) {
            var router = registerRoutes(scope);

            log('startup::composing application');

            scope.resolve('express-startup').init(router, function (app) {
                var server;

                scope.register({
                    name: 'express-app',
                    factory: function () {
                        return app;
                    }
                });

                scope.register({
                    name: 'server',
                    factory: function () {
                        return server;
                    }
                });

                // start the HTTP services
                server = scope.resolve('www');
            });

            // perform startup tasks (resolve modules here)

            log('startup::application running');
        }
    });
}

/*
// Configures the express app and adds common middleware
*/
function composeExpress (scope) {
    var expressSingleton = express(),
        router = express.Router();

    scope.register({ name: 'express',           factory: function () { return express; }});             // lib
    scope.register({ name: 'express-singleton', factory: function () { return expressSingleton; }});    // single instance used for app
    scope.register({ name: 'router',            factory: function () { return router; }});              // route engine
}

/*
// Last chance to add before and after handlers.
*/
function registerRoutes (scope) {
    var router = scope.resolve('router');

    // executes the controller modules to register routes on the router
    scope.autoResolve(api);

    return router;
}
