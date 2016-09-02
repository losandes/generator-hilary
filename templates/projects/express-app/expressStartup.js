module.exports.name = 'expressStartup';
module.exports.dependencies = [
    'expressSingleton',
    'path',
    'cookieParser',
    'bodyParser',
    'serve-static',
    'less',
    'hbs',
    'favicon'
];
module.exports.factory = function (app, path, cookieParser, bodyParser, serveStatic, less, hbs, favicon) {
    'use strict';

    var init,
        beforeAllRoutes,
        afterAllRoutes,
        paths = {
            views: path.join(__dirname, 'views'),
            partials: __dirname + '/views/templates',
            public: path.join(__dirname, 'public'),
            favicon: __dirname + '/public/favicon.ico'
        };

    init = function (applicationLifecycle, next) {
        beforeAllRoutes();

        if (typeof applicationLifecycle === 'function') {
            applicationLifecycle(app);
        }

        afterAllRoutes();

        if (typeof next === 'function') {
            next(app);
        }

        return app;
    };

    beforeAllRoutes = function () {
        // view engine setup
        app.set('views', paths.views);
        app.set('view engine', 'hbs');
        hbs.registerPartials(paths.partials);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(less(paths.public));
        app.use(serveStatic(paths.public));
        app.use(favicon(paths.favicon));
    };

    afterAllRoutes = function () {
        // make 404's a greedy index route for the SPA
        app.use(function (req, res, next) {
            res.render('index', { title: '<%= projectName %>' });
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                if (typeof err === 'string') {
                    err = new Error(err);
                }

                res.status(err.status || 500);
                res.render('error', { title: 'Whoops!', message: err.message, error: err });
            });
        } else {
            // production error handler
            // no stacktraces leaked to user
            app.use(function (err, req, res, next) {
                if (typeof err === 'string') {
                    err = new Error(err);
                }
                
                res.status(err.status || 500);
                res.render('error', { title: 'Whoops!', message: err.message, error: { stack: {} } });
            });
        }
    };

    return {
        init: init
    };
};
