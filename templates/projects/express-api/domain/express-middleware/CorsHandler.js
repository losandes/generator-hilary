module.exports.name = 'CorsHandler';
module.exports.singleton = true;
module.exports.factory = function () {
    'use strict';

    var validateOrigin,
        isPreflight,
        handlePreflight;

    validateOrigin = function (options, req, res) {
        var origin;

        if (options.allowOrigin) {
            // Validate that the origin is on the whitelist
            origin = req.headers.origin || null;

            if (options.allowOrigin(origin)) {
                res.set('Access-Control-Allow-Origin', origin);
                res.set('Vary', 'Origin');
            } else if (options.denialMessage) {
                res.status(403).send(options.denialMessage.message.replace('{origin}', origin)).end();
                return false;
            } else {
                res.status(403).end();
                return false;
            }
        } else {
            // The options do not provide a means of validating the origin, allow any origin
            // WE RECOMMEND NOT LETTING THIS HAPPEN IN PRODUCTION
            res.set('Access-Control-Allow-Origin', '*');
        }

        return true;
    };

    isPreflight = function (req) {
        var isHttpOptions = req.method === 'OPTIONS',
            hasOriginHeader = req.headers.origin,
            hasRequestMethod = req.headers['access-control-request-method'];

        return isHttpOptions && hasOriginHeader && hasRequestMethod;
    };

    handlePreflight = function (options, req, res) {
        var headers;

        if (options.allowMethods) {
            res.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
        }

        if (typeof(options.allowHeaders) === 'function') {
            headers = options.allowHeaders(req);

            if (headers) {
                res.set('Access-Control-Allow-Headers', headers);
            }
        } else if (options.allowHeaders) {
            res.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
        }

        // Chrome, Safari and Opera support a max of 5 minutes, Firefox supports up to 24 hours
        res.set('Access-Control-Max-Age', options.cacheDuration || '120' /* 2 minutes */);

        res.status(204).end();
    };

    return function (options) {
        return function (req, res, next) {
            if (options.mode === 'off') {
                next();
                return;
            }

            if (!validateOrigin(options, req, res)) {
                // Do not allow the request to be processed; return the response (do not continue the pipeline)
                return;
            }

            if (options.allowCredentials) {
                // set the response header to allow credentials (cookies)
                res.set('Access-Control-Allow-Credentials', 'true');
            }

            if (isPreflight(req)) {
                // process the preflight request and return the response (do not continue the pipeline)
                handlePreflight(options, req, res);
                return;
            } else if (options.exposeHeaders) {
                res.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
            }

            next();
        };
    };

};
