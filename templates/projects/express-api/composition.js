'use strict';

module.exports.init = init;

var hilary = require('hilary'),
    express = require('express'),
    nconf = require('nconf'),
    ObjectID = require('bson-objectid'),
    // directories
    apis = require('./apis.js'),
    environment = require('./common/environment/environment.js'),
    env = environment.factory(nconf),
    scopeId = env.get('projectName');
    // log and various other function defined at bottom

function init() {
    var scope = hilary.scope(scopeId, {
            logging: {
                level: 'info', // trace|debug|info|warn|error|fatal|off
                // printer: function (entry) {
                //
                // }
            }
        });

    scope.bootstrap([
        function (scope, next) { log('composing application'); next(null, scope); },
        scope.makeRegistrationTask(apis),
        scope.makeRegistrationTask(require('./common/utils')),
        scope.makeRegistrationTask(require('./common/error-handling')),
        scope.makeRegistrationTask(require('./common/express')),
        function composeUtils (scope, next) {
            scope.register({ name: 'appDir', factory: __dirname });
            scope.register({ name: 'ObjectID', factory: ObjectID, dependencies: [] });
            scope.register({ name: 'environment', factory: function () { return env; }});
            next(null, scope);
        },
        function composeExpress (scope, next) {
            /*
            // Configures the express app and adds common middleware
            */

            var expressSingleton = express(),
                router = express.Router();

            scope.register({ name: 'express',           factory: function () { return express; }});             // lib
            scope.register({ name: 'express-singleton', factory: function () { return expressSingleton; }});    // single instance used for app
            scope.register({ name: 'router',            factory: function () { return router; }});              // route engine
            next(null, scope, router);
        },
        function registerRoutes (scope, router, next) {
            /*
            // Register the routes / controllers, by resolving them
            */

            log('registering routes');

            apis.forEach(mod => {
                if (mod.name.toLowerCase().indexOf('controller') > -1) {
                    // execute the controller modules to register routes on the router
                    scope.resolve(mod.name);
                }
            });

            next(null, scope, router);
        },
        function startAndRegisterExpress (scope, router, next) {
            /*
            // Configure and start the express app, and then register it
            // so other modules can depend on it (required for `www`)
            */

            log('starting express');

            scope.resolve('express-startup').init(router, function (err, app) {
                if (err) {
                    return next(err);
                }

                scope.register({
                    name: 'express-app',
                    factory: function () {
                        return app;
                    }
                });

                next(null, scope);
            });
        },
        // NOTE: Add any other necessary composition tasks here;
        // BEFORE adding makeHttpServerStartupTask
        function makeHttpServerStartupTask (scope, next) {
            /*
            // Make an async task that starts the HTTP server (starts listening)
            // and registers a singleton `server`, so other modules can depend on it
            */

            var server;

            scope.register({
                name: 'server',
                factory: function () {
                    return server;
                }
            });

            log('starting the HTTP server');

            // start the HTTP services
            server = scope.resolve('www');

            next(null, scope);
        }
    ], function (err) {
        if (err) {
            log(err);
        } else {
            log('application running');
        }

    });
}

function log (message) {
    console.log('startup::' + scopeId + '::' + message);
}
