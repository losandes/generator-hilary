module.exports.name = "versionHandler";
module.exports.singleton = true;
module.exports.dependencies = ['environment', 'exceptions'];
module.exports.factory = function (env, exceptions) {
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

            exceptions.throw(new Error('No version was found to satisfy this request\'s Accept Header'));
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
        var accept = req.get('Accept'),
            vendorPrefix = env.get('versions:vendorPrefix');

        if (!accept || !versions || (vendorPrefix && accept.indexOf(vendorPrefix) === -1)) {
            // give latest to any request that does not have the accept Header
            // or if there are no versions to speak of
            // or if we're validating a vendor prefix and it's not present in the accept Header
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
