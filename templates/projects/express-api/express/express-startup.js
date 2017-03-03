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
    'helmet',
    'hpp',
    'defaultCorsHandler',
    'VersionHandler',
    'express-errors-404',
    'express-errors-500',
    'express-request-ids'
];
module.exports.factory = function (app, path, appDir, bodyParser, favicon, serveStatic, hbs, extendHbs, helmet, hpp, corsHandler, VersionHandler, on404, on500, requestIds) {
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
        try {
            beforeAllRoutes();
            app.use(router);
            afterAllRoutes();

            if (typeof next === 'function') {
                next(null, app);
            }

            return app;
        } catch (e) {
            if (typeof next === 'function') {
                next(e);
            } else {
                throw e;
            }
        }
    };

    beforeAllRoutes = function () {
        // view engine setup
        app.set('views', paths.views);
        app.set('view engine', 'hbs');
        extendHbs(hbs);

        app.use(requestIds);
        app.use(corsHandler);
        app.use(helmet.hsts({
            maxAge: 10886400000,        // Must be at least 18 weeks to be approved by Google
            includeSubdomains: true,    // Must be enabled to be approved by Google
            preload: true
        }));
        app.use(helmet.frameguard('deny'));
        app.use(helmet.xssFilter());
        app.use(helmet.ieNoOpen());
        app.use(helmet.noSniff());
        app.use(helmet.noCache());
        app.use(new VersionHandler({
            branches: [{
                name: 'alpha'
            }, {
                name: 'beta'
            }, {
                name: 'rc'
            }, {
                name: 'ga',
                default: true
            }]
        }));
        app.use(bodyParser.json());
        // app.use(bodyParser.urlencoded({ extended: true }));
        app.use(hpp()); // NOTE: this MUST come directly after bodyParser; hpp: Protect against HTTP Parameter Pollution attacks
        app.use(serveStatic(paths.public));
        app.use(favicon(paths.favicon));

        // Consider using Public Key Pinning (HPKP)
        // Browser support is still young so it's necessary to support a secondary key
        // app.use(helmet.publicKeyPins({
        //     maxAge: ninetyDaysInMilliseconds, // ninetyDaysInMilliseconds = 7776000000
        //     sha256s: ['AbCdEf123=', 'ZyXwVu456='],
        //     includeSubdomains: true,         // optional
        //     reportUri: 'http://example.com'  // optional
        // }));

        // Consider setting a content security policy (https://github.com/helmetjs/csp)
        // read more about it here: http://www.html5rocks.com/en/tutorials/security/content-security-policy/
        // and here: http://content-security-policy.com/
        // app.use(helmet.contentSecurityPolicy({
        //     defaultSrc: ["'self'", 'default.com'],
        //     scriptSrc: ['scripts.com'],
        //     styleSrc: ['style.com'],
        //     imgSrc: ['img.com'],
        //     connectSrc: ['connect.com'],
        //     fontSrc: ['font.com'],
        //     objectSrc: ['object.com'],
        //     mediaSrc: ['media.com'],
        //     frameSrc: ['frame.com'],
        //     sandbox: ['allow-forms', 'allow-scripts'],
        //     reportUri: '/report-violation',
        //     reportOnly: false, // set to true if you only want to report errors
        //     setAllHeaders: false, // set to true if you want to set all headers
        //     disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy)
        //     safari5: false // set to true if you want to force buggy CSP in Safari 5
        // }));
    }; // /beforeAllRoutes

    afterAllRoutes = function () {
        app.use(on404);
        app.use(on500);
    };

    return {
        init: init
    };
};
