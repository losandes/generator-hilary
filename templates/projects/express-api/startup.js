'use strict';
module.exports.init = init;

var Hilary = require('hilary');

/*
// Configures the express app and adds common middleware
*/
function composeExpress (scope) {
    var express = require('express'),
        expressSingleton = express(),
        router = express.Router(),
        favicon = require('serve-favicon'),
        logger = require('morgan'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        less = require('less-middleware'),
        debug = require('debug')('expressdefault:server'),
        serveStatic = require('serve-static');

    /*
    // we'll use Hilary to wire up the node dependencies, for simplicity.
    // Note that we're creating parameterless factories that return the result of
    // node's require function, instead of just registering the modules themselves.
    // This approach reduces memory overhead in Hilary, and allows node to behave as it
    // normally would when using the service-location anti-pattern (i.e. node will to do it's
    // own caching and GC, as normal)
    */

    scope.register({ name: 'express',               factory: function () { return express; }});          // lib
    scope.register({ name: 'expressSingleton',      factory: function () { return expressSingleton; }}); // single instance used for app
    scope.register({ name: 'router',                factory: function () { return router; }});           // route engine
    scope.register({ name: 'favicon',               factory: function () { return favicon; }});
    scope.register({ name: 'logger',                factory: function () { return logger; }});
    scope.register({ name: 'cookieParser',          factory: function () { return cookieParser; }});
    scope.register({ name: 'bodyParser',            factory: function () { return bodyParser; }});
    scope.register({ name: 'less',                  factory: function () { return less; }});
    scope.register({ name: 'debug',                 factory: function () { return debug; }});
    scope.register({ name: 'serve-static',          factory: function () { return serveStatic; }});

    /*
    // Alternatively, you can let Hilary gracefully degrade to node's require function.
    // If you don't define a dependency, and the name is resolvable via node's require function,
    // the result of that require function will be returned.
    //
    // The commented out definitions below serve as an example in this project
    */
    //scope.define('http', function () { return require('http'); });
    //scope.define('path', function () { return require('path'); });

    scope.register(require('./expressStartup.js'));         // configures middleware and controllers
    scope.register(require('./www.js'));                    // the HTTP server
}

/*
// Where the routes (controllers) are registered
// This will auto-resolve any controllers that are included in controller/index.js
*/
function configureRoutes (scope, expressApp) {
    scope.autoResolve(require('./domain/controllers'));    // execute the controller modules to register routes
    expressApp.use(scope.resolve('router'));        // use the router, after the controllers are all registered
}

/*
// Last chance to add before and after handlers.
// Executes configureRoutes - so all controllers get registered.
*/
function configureApplicationLifecycle (scope) {
    var corsHandler = scope.resolve('defaultCorsHandler'),
        versionHandler = scope.resolve('versionHandler');

    return function (expressApp) {
        // BEFORE
        (function () {
            expressApp.use(corsHandler);
            expressApp.use(versionHandler);
        }());

        configureRoutes(scope, expressApp);

        // AFTER
        (function () {

        }());
    };
}

function init() {
    Hilary.scope('<%= scope %>').Bootstrapper({
        composeLifecycle: function (err, scope, pipeline) {
            var exceptions;

            console.log('startup::@' + new Date().toISOString());
            console.log('startup::composing application lifecycle');

            pipeline.on.error(function (err) {
                try {
                    // try, in case this is triggered before exceptions are registered
                    if (!exceptions) {
                        exceptions = scope.resolve('exceptions');
                    }

                    exceptions.throw(err);
                } catch (e) {
                    console.log(e);
                    console.log(err);
                }
            });
        },
        composeModules: function (err, scope) {
            // perform composition tasks (register modules here)
            var exceptions;

            console.log('startup::composing application modules');

            scope.register(require('./environment.js'));
            scope.register(require('./ExceptionHandler.js'));
            scope.autoRegister(require('./domain/express-middleware'));

            scope.register({
                name: 'hilary::is',
                singleton: true,
                factory: function () {
                    return scope.getContext().is;
                }
            });

            scope.register({
                name: 'exceptions',
                singleton: true,
                factory: function () {
                    if (!exceptions) {
                        var ExceptionHandler = scope.resolve('ExceptionHandler');
                        exceptions = new ExceptionHandler(function (exception) {
                            console.error(exception);
                        });
                    }

                    return exceptions;
                }
            });

            composeExpress(scope);
        },
        onComposed: function (err, scope) {
            scope.resolve('expressStartup').init(configureApplicationLifecycle(scope), function (app) {
                var server;

                scope.register({
                    name: 'expressApp',
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

            console.log('startup::starting application');

            // perform startup tasks (resolve modules here)

            console.log('startup::application running');
        }
    });
}
