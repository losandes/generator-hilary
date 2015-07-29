/*globals Hilary, jQuery, Sammy, Gidget, ko, console*/
(function (scope, $, Sammy, Gidget, ko) {
    'use strict';

    var compose,
        start,
        configureRoutes,
        configureApplicationContainer,
        configureApplicationLifecycle,
        mainSelector,
        $main;

    mainSelector = '#main';
    $main = $(mainSelector);

    /*
    // compose the application and dependency graph
    */
    compose = function (onReady) {
        new Gidget({
            routerName: 'bootstrappers.sammy',
            router: new Sammy(mainSelector, function () { }),
            callback: function (gidgetApp) {
                configureApplicationContainer(gidgetApp);
                configureApplicationLifecycle(gidgetApp.pipelines());

                // Start handler
                onReady(null, gidgetApp);
            }
        });
    };

    /*
    // Configure the IoC container - register singleton dependencies and what not
    */
    configureApplicationContainer = function (gidget) {
        // singletons are stored in local variables
        var locale,
            viewEngine,
            exceptions,
            is;

        scope.register({ name: 'newGidgetModule',   factory: function () { return new gidget.GidgetModule(); }});
        scope.register({ name: 'Blueprint',         factory: function () { return Hilary.Blueprint; }});

        scope.register({
            name: 'is',
            factory: function () {
                if (!is) {
                    is = scope.getContext().is;
                }
                return is;
            }
        });

        scope.register({
            name: 'locale',
            factory: function () {
                if (!locale) {
                    // TODO: Pick the locale based on the user preferences
                    // and load it separately from the web
                    locale = scope.resolve('locale::en_US');
                }

                return locale;
            }
        });

        scope.register({
            name: 'exceptions',
            factory: function () {
                if (!exceptions) {
                    var ExceptionHandler = scope.resolve('ExceptionHandler');
                    exceptions = new ExceptionHandler(function (exception) {
                        throw exception;
                    });
                }

                return exceptions;
            }
        });

        // register a single viewEngine to be used throughout the app
        scope.register({
            name: 'viewEngine',
            factory: function () {

                if (!viewEngine) {
                    var ViewEngine = scope.resolve('ViewEngine');
                    viewEngine = new ViewEngine($main);
                }

                return viewEngine;
            }
        });
    };

    /*
    // Register application lifecycle pipeline events
    */
    configureApplicationLifecycle = function (pipelines) {
        pipelines.before(function (verb, path, params) {
            console.log('about to navigate to:', { verb: verb, path: path, params: params });
        });

        pipelines.after(function (verb, path, params) {
            console.log('finished navigating to:', { verb: verb, path: path, params: params });
        });
    };

    /*
    // Register Modules
    */
    configureRoutes = function (gidget) {
        gidget.registerModule(scope.resolve('homeController'));
    };

    /*
    // starts the application
    */
    start = function (err, gidget) {
        configureRoutes(gidget);
        ko.applyBindings(scope.resolve('viewEngine').mainVM, $main[0]);
        gidget.routeEngine.start();
    };

    //////////////////////////////////////////////////
    // START IMMEDIATELY
    // note: we don't use an iffe for start, so it can be registered and the app can be restarted
    compose(start);

}(Hilary.scope('<%= scope %>'), jQuery, Sammy, Gidget, ko));
