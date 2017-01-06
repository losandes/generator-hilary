module.exports.name = 'defaultCorsHandler';
module.exports.dependencies = ['environment', 'CorsHandler'];
module.exports.factory = function (env, CorsHandler) {
    'use strict';

    var corsOptions,
        makeWhitelistValidator;

    makeWhitelistValidator = function (whitelist) {
        return function (val) {
            if (whitelist[val]) {
                return true;
            }

            return false;
        };
    };

    corsOptions = env.get('cors');

    if (!corsOptions) {
        corsOptions = {
            // When mode is set to 'off', CORS will not operate
            mode: 'on',
            // Set this to true if you want to allow cookies to be sent to your API
            allowCredentials: true,
            // List only the verbs that your API supports/uses
            allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
            // List the headers that are accepted by your api
            // When this is null, the CORS handler will allow the client to describe what headers are being sent
            allowHeaders: ['Authorization', 'Accepts', 'Content-Type', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Unmodified-Since', 'Range', 'X-Requested-With'],
            // List the headers that can be exposed by the server
            exposeHeaders: ['Content-Length', 'Date', 'ETag', 'Expires', 'Last-Modified', 'X-Powered-By'],
            // Set the maxAge for pre-flight cache (default is 2 minutes / 120 seconds)
            cacheDuration: '120'
        };
    }

    if (!corsOptions.originWhiteList) {
        corsOptions.originWhiteList = {
            // null is needed if you plan to hit the API via local files or via redirects (301, etc.)
            'null': true
        };
        corsOptions.originWhiteList['http://localhost:' + env.get('port')] = true;
    }

    corsOptions.allowOrigin = makeWhitelistValidator(corsOptions.originWhiteList);

    // if allowHeaders is not set, allow the consumer (client) to tell us what headers they are sending
    // This option allows the end user to send any header they want!
    corsOptions.allowHeaders = corsOptions.allowHeaders || function(req) {
        return req.headers['access-control-request-headers'];
    };

    return new CorsHandler(corsOptions);

};
