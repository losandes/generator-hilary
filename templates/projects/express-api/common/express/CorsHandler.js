module.exports.name = 'CorsHandler';
module.exports.dependencies = ['corsOptions', 'logger'];
module.exports.factory = (options, logger) => () => {
    'use strict';

    if (options.mode === 'on' && !options.areValid()) {
        throw new Error(options.validationErrors);
    }

    const ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
    const ALLOW_CREDENTIALS = 'Access-Control-Allow-Credentials';
    const ALLOW_HEADERS = 'Access-Control-Allow-Headers';
    const ALLOW_METHODS = 'Access-Control-Allow-Methods';
    const EXPOSE_HEADERS = 'Access-Control-Expose-Headers';

    // the following constants are for getting headers from the request
    // express lower cases the headers
    const REQUEST_METHOD = 'access-control-request-method';
    const REQUEST_HEADERS = 'access-control-request-headers';

    return function (req, res, next) {
        if (options.mode === 'off') {
            next();
            return;
        }

        const originValidationResult = validateOrigin(options, req, res);

        if (!originValidationResult.isValid) {
            // Do not allow the request to be processed
            // return the response
            // do not continue the pipeline
            return invalidOriginResponse(options, originValidationResult.origin, res);
        }

        if (options.allowCredentials === true) {
            // set the response header to allow credentials (cookies)
            res.set(ALLOW_CREDENTIALS, 'true');
        }

        if (isPreflight(req)) {
            // process the preflight request and return the response
            // do not continue the pipeline
            return preflightResponse(options, req, res);
        } else if (Array.isArray(options.exposeHeaders)) {
            res.set(
                EXPOSE_HEADERS,
                options.exposeHeaders.join(',')
            );
        }

        next();
    };

    // PRIVATE /////////////////////////////////////////////////////////////////
    const isOriginAllowed = (val) => {
        if (
            options.originWhiteList.indexOf('*') > -1 ||                  // allow all
            (!val && options.originWhiteList.indexOf('null') > -1) ||     // allow null origin header (server-to-server)
            options.originWhiteList.indexOf(val) > -1                     // found match in whitelist
        ) {
            return true;
        } else {
            return false;
        }
    };

    const getAllowedHeaders = (allowedHeaders, req) => {
        if (allowedHeaders.indexOf('*') > -1) {
            return req.headers[REQUEST_HEADERS];
        } else {
            return allowedHeaders.join(',');
        }
    };

    function validateOrigin (options, req, res) {
        // Validate that the origin is on the whitelist
        const origin = req.headers.origin || null;

        if (isOriginAllowed(origin)) {
            res.set(ALLOW_ORIGIN, origin);
            res.set('Vary', 'Origin');
            return { isValid: true };
        } else {
            return { isValid: false, origin };
        }
    }

    function invalidOriginResponse (options, origin, res) {
        logger.info(`Denied access to ${origin} (CORS)`);
        return res.status(403)
            .send(options.denialMessage.replace(/{origin}/g, origin))
            .end();
    }

    function isPreflight (req) {
        const isHttpOptions = req.method === 'OPTIONS';
        const hasOriginHeader = req.headers.origin;
        const hasRequestMethod = req.headers[REQUEST_METHOD];
        return isHttpOptions && hasOriginHeader && hasRequestMethod;
    }

    function preflightResponse (options, req, res) {
        if (Array.isArray(options.allowMethods)) {
            res.set(
                ALLOW_METHODS,
                options.allowMethods.join(',')
            );
        }

        if (Array.isArray(options.allowHeaders)) {
            res.set(
                ALLOW_HEADERS,
                getAllowedHeaders(options.allowHeaders, req)
            );
        }

        // Chrome, Safari and Opera support a max of 5 minutes, Firefox supports up to 24 hours
        res.set('Access-Control-Max-Age', options.cacheDuration || '120' /* 2 minutes */);

        res.status(204).end();
    }

};
