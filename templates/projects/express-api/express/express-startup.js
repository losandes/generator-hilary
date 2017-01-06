module.exports.name = 'express-startup';
module.exports.dependencies = [
    'express-singleton',
    'path',
    'appDir',
    'body-parser',
    'serve-favicon',
    'serve-static',
    'hbs',
    'hbsBlocks',
    'defaultCorsHandler',
    'versionHandler',
    'express-errors-404',
    'express-errors-500'
];
module.exports.factory = function (app, path, appDir, bodyParser, favicon, serveStatic, hbs, extendHbs, corsHandler, versionHandler, on404, on500) {
    'use strict';

    var init,
        beforeAllRoutes,
        afterAllRoutes,
        paths = {
            views: path.join(appDir, 'views'),
            public: path.join(appDir, 'public'),
            favicon: path.join(appDir, '/public/favicon.ico')
        };

    init = function (router, next) {
        beforeAllRoutes();
        app.use(router);
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
        extendHbs(hbs);

        // custom middleware
        app.use(corsHandler);
        app.use(versionHandler);

        // 3rd party middleware
        app.use(bodyParser.json());
        // app.use(bodyParser.urlencoded({ extended: true }));
        app.use(serveStatic(paths.public));
        app.use(favicon(paths.favicon));
    };

    afterAllRoutes = function () {
        app.use(on404);
        app.use(on500);
    };

    return {
        init: init
    };
};
