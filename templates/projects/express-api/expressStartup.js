module.exports.name = 'expressStartup';
module.exports.dependencies = [
    'expressSingleton',
    'path',
    'cookieParser',
    'bodyParser',
    'serve-static',
    'less',
    'favicon',
    'defaultCorsHandler'
];
module.exports.factory = function (app, path, cookieParser, bodyParser, serveStatic, less, favicon, cors) {
    'use strict';

    var before,
        after,
        init;

    init = function (applicationLifecycle, next) {
        before();

        if (typeof applicationLifecycle === 'function') {
            applicationLifecycle(app);
        }

        after();

        if (typeof next === 'function') {
            next(app);
        }

        return app;
    };

    before = function () {
        app.use(cors);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(less(path.join(__dirname, 'public')));
        app.use(serveStatic(path.join(__dirname, 'public')));
        app.use(favicon(__dirname + '/public/favicon.ico'));
    };

    after = function () {
        // make 404's a greedy index route for the SPA
        app.use(function (req, res, next) {
            res.status(404).send({
                status: 404
            });
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.send({ title: 'error', message: err.message, error: err });
            });
        } else {
            // production error handler
            // no stacktraces leaked to user
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.send({ title: 'error', message: err.message, error: {} });
            });
        }
    };

    return {
        init: init
    };
};
