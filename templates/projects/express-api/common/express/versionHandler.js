module.exports.name = "versionHandler";
module.exports.dependencies = ['logger'];
module.exports.factory = function (logger) {
    'use strict';

    var REQUEST_HEADER = 'Accept',
        RESPONSE_HEADER = 'X-API-Version',
        HANDLER_NOT_FOUND = 'No handler was found for the requested version';

    return function (req, res, next) {
        try {
            var acceptHeader = req.get(REQUEST_HEADER);

            // puts the read-only apiVersion on res.locals
            res.locals.apiVersion = Object.freeze(
                new ApiVersion(parseVersion(acceptHeader))
            );

            // puts the version on the response header
            setResponseHeader(res, res.locals.apiVersion.version);
            return next();
        } catch (e) {
            logger.warn({
                message: 'The API version could not be parsed',
                error: e,
                requestId: req.locals.requestId
            });

            return next();
        }
    };

    function setResponseHeader (res, version) {
        if (!res || typeof res.setHeader !== 'function') {
            return;
        }

        res.setHeader(RESPONSE_HEADER, version);
    }

    function parseVersion (acceptHeader) {
        if (!acceptHeader) {
            return todaysVersion();
        }

        var parts = acceptHeader.split(';'),
            rawVersion = parts.filter(function (part) {
                return part.indexOf('version') > -1;
            }).map(function (part) {
                var kvp = part.split('=');

                if (kvp.length === 2) {
                    return kvp[1].trim();
                }
            }).filter(function (version) {
                return version;
            });

        return rawVersion.length ? makeVersion(rawVersion[0]) : todaysVersion();
    }

    function makeVersion (version) {
        var year, month, day, date;

        if(/^(\d){8}$/.test(version)) {
            year = version.substr(0,4);
            month = version.substr(4,2) - 1;
            day = version.substr(6,2);
            date = new Date(year, month, day);
        } else if (/^(\d){4}-(\d){2}-(\d){2}$/.test(version)) {
            year = version.substr(0,4);
            month = version.substr(5,2) - 1;
            day = version.substr(8,2);
            date = new Date(year, month, day);
        } else {
            return todaysVersion();
        }

        return parseDateIsValid(date, year, month, day) ? formatDate(date) : todaysVersion();
    }

    function parseDateIsValid (date, year, month, day) {
        if (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() === parseInt(month) &&
            date.getDate() === parseInt(day)
        ) {
            return true;
        }

        return false;
    }

    function todaysVersion () {
        return formatDate(new Date());
    }

    function formatDate (date) {
        return parseInt(date.toISOString().slice(0,10).replace(/-/g,''));
    }

    function ApiVersion (version) {
        var self = {};

        self.version = version;
        self.which = which;
        self.get = get;

        /*
        // Picks the most recent version that is acceptable, based on the
        // given version
        // @param versions an array of versions to choose from
        */
        function which (versions) {
            var whiches;

            if (!Array.isArray(versions)) {
                return null;
            }

            whiches = versions.map(v => {
                return parseInt(v);
            }).filter(v => {
                return !isNaN(v);
            }).sort((a, b) => {
                // reverseOrder
                return b - a;
            }).filter(v => {
                return v <= self.version;
            });

            // return the most recent acceptable version
            return whiches.length ? whiches[0] : null;
        }

        /*
        // Picks the most recent version that is acceptable, based on the
        // given version, sets the response header to the chosen version, and
        // passes the error or chosen version to the callback
        // @param versionMap: an object, where the keys are versions, and
        //    the values are the appropriate values/functions for those versions
        // @param res: The express response
        // @param callback: A callback that accepts an error, or the chosen version & handler
        */
        function get (versionMap, res, callback) {
            var versions = [], key, version, value;
            callback = callback || res;

            if (!versionMap) {
                return callback(new Error(HANDLER_NOT_FOUND));
            }

            for (key in versionMap) {
                if (versionMap.hasOwnProperty(key)) {
                    versions.push(key);
                }
            }

            version = which(versions);
            value = versionMap[version];

            if (value) {
                setResponseHeader(res, version);

                return callback(null, {
                    version: version,
                    value: value
                });
            } else {
                return callback(new Error(HANDLER_NOT_FOUND));
            }
        }

        return self;
    }
};
