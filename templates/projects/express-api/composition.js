'use strict';

module.exports.init = init;

var Hilary = require('hilary'),
    polyn = require('polyn'),
    async = require('async'),
    express = require('express'),
    nconf = require('nconf'),
    ObjectID = require('bson-objectid'),
    // directories
    api = require('./api'),
    common = require('./common'),
    environment = require('./environment.js'),
    env = environment.factory(nconf),
    errorHandling = require('./error-handling'),
    expressConfig = require('./express'),
    scopeId = env.get('projectName');
    // log and various other function defined at bottom


function init() {
    Hilary.scope(scopeId).Bootstrapper({
        composeLifecycle: function (err, scope, pipeline) {
            var exceptions;

            log('@' + new Date().toISOString());
            log('composing application lifecycle');

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
            log('composing application modules');

            scope.register({ name: 'appDir', singleton: true, factory: __dirname });
            scope.register({ name: 'ObjectID', singletong: true, factory: ObjectID, dependencies: [] });
            scope.register({ name: 'polyn::Immutable', singleton: true, factory: polyn.Immutable, dependencies: [] });
            scope.register({ name: 'polyn::is', singleton: true, factory: polyn.is, dependencies: [] });

            scope.register({ name: 'environment', factory: function () { return env; }});
            scope.autoRegister(api);
            scope.autoRegister(common);
            scope.autoRegister(errorHandling);
            scope.autoRegister(expressConfig);

            composeExpress(scope);
        },
        onComposed: function (err, scope) {
            var startupTasks = [];

            // NOTE: Order matters here

            // regiser the controllers / routes
            startupTasks.push(makeRouteRegistrationTask(scope));
            // start / configure the express app
            startupTasks.push(makeExpressStartupTask(scope));
            // register the express app
            startupTasks.push(makeExpressRegistrationTask(scope));

            // NOTE: Add any other necessary composition tasks here;
            // BEFORE adding makeHttpServerStartupTask

            // register a singleton HTTP server, and start listening
            startupTasks.push(makeHttpServerStartupTask(scope));

            log('composing application');

            async.waterfall(startupTasks, function (err) {
                if (err) {
                    throw err;
                }

                log('application running');
            });
        }
    });
}

function log (message) {
    console.log('startup::' + scopeId + '::' + message);
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
// Make an async task that registers the routes / controllers
*/
function makeRouteRegistrationTask (scope) {
    return function (callback) {
        var router = scope.resolve('router');

        // executes the controller modules to register routes on the router
        scope.autoResolve(api);

        callback(null, router);
    };
}

/*
// Make an async task that configures / starts the express app
// @expects: an express router to be passed in by the previous task
*/
function makeExpressStartupTask (scope) {
    return function (router, callback) {
        scope.resolve('express-startup').init(router, callback);
    };
}

/*
// Make an async task that registers the express app
// so other modules can depend on it (required for `www`)
// @expects: a configured express app to be passed in by the previous task
*/
function makeExpressRegistrationTask (scope) {
    return function (expressApp, callback) {
        scope.register({
            name: 'express-app',
            factory: function () {
                return expressApp;
            }
        });

        callback();
    };
}

/*
// Make an async task that starts the HTTP server (starts listening)
// and registers a singleton `server`, so other modules can depend on it
*/
function makeHttpServerStartupTask (scope) {
    return function (callback) {
        var server;

        scope.register({
            name: 'server',
            factory: function () {
                return server;
            }
        });

        // start the HTTP services
        server = scope.resolve('www');

        callback();
    };
}
