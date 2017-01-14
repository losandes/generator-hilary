module.exports.name = "VersionHandler";
module.exports.singleton = true;
module.exports.dependencies = ['environment', 'logger'];
module.exports.factory = function (env, logger) {
    'use strict';

    var versions = env.get('versions'),
        projectName = env.get('projectName'),
        getVersion,
        setVersion,
        getBranches,
        getDefaultBranch,
        getLatestVersion;

    /*
    // Attempts to get version from Accept Header: // Accept application/vnd.example.20150820+json
    */
    getVersion = function (req, res, next, accept, versions, latest) {
        try {
            var acceptDate = accept.split('.').pop().split('+')[0],
                acceptInt = parseInt(acceptDate.replace(/-/g, '')),
                i;

            for (i = 0; i < versions.length; i += 1) {
                if (versions[i].comparable <= acceptInt) {
                    return setVersion(req, res, next, versions[i]);
                }
            }

            throw new Error('No version was found to satisfy this request\'s Accept Header: ' + accept);
        } catch (e) {
            logger.warn(e);
            return setVersion(req, res, next, latest);
        }
    };

    setVersion = function (req, res, next, version) {
        res.locals.version = version;
        res.set(versions.responseHeader || 'X-Api-Media-Type', version.responseHeader);
        next();
    };

    getBranches = function (options) {
        var prop, branches = [];

        if (Array.isArray(options.branches)) {
            return options.branches;
        }

        for (prop in versions) {
            if (versions.hasOwnProperty(prop) && Array.isArray(versions[prop])) {
                branches.push({ name: prop });
            }
        }

        return branches;
    };

    getDefaultBranch = function (options) {
        var defaultBranch = options.branches.filter(function (branch) {
            return branch.default;
        })[0];

        return defaultBranch || options.branches[0];
    };

    getLatestVersion = function (defaultBranch) {
        return defaultBranch && Array.isArray(versions[defaultBranch.name]) ?
            versions[defaultBranch.name][0] : {
                "name": "20170101",
                "comparable": 20170101,
                "number": "v1",
                "responseHeader": "application/vnd." + projectName + ".20170101+json"
            };
    };

    return function (options) {
        var defaultBranch,
            latest;

        if (!versions) {
            // There are no versions in the environment,
            // So there is nothing for this middleware to do
            return function (req, res, next) { next(null); };
        }

        options = options || {};
        options.branches = getBranches(options);

        defaultBranch = getDefaultBranch(options);
        latest = getLatestVersion(defaultBranch);

        /*
        // The Middleware
        */
        return function (req, res, next) {
            var accept = req.get('Accept'),
                vendorPrefix = versions.vendorPrefix,
                branchFound = false;

            if (!accept || !versions || (vendorPrefix && accept.indexOf(vendorPrefix) === -1)) {
                // give latest to any request that does not have the accept Header
                // or if there are no versions to speak of
                // or if we're validating a vendor prefix and it's not present in the accept Header
                return setVersion(req, res, next, latest);
            }

            options.branches.forEach(function (branch) {
                if (accept.indexOf(branch.name) > -1 && versions[branch.name]) {
                    getVersion(req, res, next, accept, versions[branch.name], latest);
                    branchFound = true;
                }
            });

            if (!branchFound && defaultBranch && Array.isArray(versions[defaultBranch.name])) {
                getVersion(req, res, next, accept, versions[defaultBranch.name], latest);
            } else if (!branchFound) {
                setVersion(req, res, next, latest);
            }
        };
    };
};
