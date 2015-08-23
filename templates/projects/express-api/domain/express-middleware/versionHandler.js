module.exports.name = "versionHandler";
module.exports.singleton = true;
module.exports.dependencies = ['environment'];
module.exports.factory = function (env) {
    'use strict';

    var versions = env.get('versions'),
        latest = null,
        getVersion,
        setVersion;

    if (versions && versions.prod && versions.prod[0]) {
        latest = versions.prod[0];
    }

    /*
    // Attempts to get version from Accept Header: // Accept application/vnd.example.20150820+json
    */
    getVersion = function (req, res, next, accept, versions) {
        try {
            var acceptDate = accept.split('.').pop().split('+')[0],
                acceptInt = parseInt(acceptDate.replace(/(-|_|\.)/g, '')),
                i;

            for (i = 0; i < versions.length; i += 1) {
                if (versions[i].comparable <= acceptInt) {
                    return setVersion(req, res, next, versions[i]);
                }
            }

            throw new Error('No version was found to satisfy this request\'s Accept Header');
        } catch (e) {
            console.log(e);
            return setVersion(req, res, next, latest);
        }
    };

    setVersion = function (req, res, next, version) {
        res.locals.version = version;
        res.set(env.get('versions:responseHeader') || 'X-Api-Media-Type', version.responseHeader);
        next();
    };

    return function (req, res, next) {
        var accept = req.get('Accept');

        if (!accept || !versions) {
            return setVersion(req, res, next, latest);
        }

        if (accept.indexOf('-beta') > -1 && versions.beta) {
            getVersion(req, res, next, accept, versions.beta);
        } else if (accept.indexOf('-alpha') > -1 && versions.alpha) {
            getVersion(req, res, next, accept, versions.alpha);
        } else if (accept.indexOf('-rc') > -1 && versions.rc) {
            getVersion(req, res, next, accept, versions.rc);
        } else {
            getVersion(req, res, next, accept, versions.prod);
        }
    };
};
