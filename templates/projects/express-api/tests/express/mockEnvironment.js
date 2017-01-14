module.exports.name = 'environment';
module.exports.factory = function () {
    'use strict';

    var versions = {
        "beta": [
            { "name": "20150828-beta", "comparable": 20150828, "number": "v2b2", "responseHeader": "application/vnd.test.20150828-beta+json" },
            { "name": "20150725-beta", "comparable": 20150725, "number": "v2b1", "responseHeader": "application/vnd.test.20150725-beta+json" }
        ],
        "alpha": [
            { "name": "20150828-alpha", "comparable": 20150828, "number": "v2a2", "responseHeader": "application/vnd.test.20150828-alpha+json" },
            { "name": "20150725-alpha", "comparable": 20150725, "number": "v2a1", "responseHeader": "application/vnd.test.20150725-alpha+json" }
        ],
        "rc": [
            { "name": "20150828-rc", "comparable": 20150828, "number": "v2rc2", "responseHeader": "application/vnd.test.20150828-rc+json" },
            { "name": "20150725-rc", "comparable": 20150725, "number": "v2rc1", "responseHeader": "application/vnd.test.20150725-rc+json" }
        ],
        "ga": [
            { "name": "20150920", "comparable": 20150920, "number": "v2", "responseHeader": "application/vnd.test.20150920+json" },
            { "name": "20150807", "comparable": 20150807, "number": "v1", "responseHeader": "application/vnd.test.20150807+json" }
        ],
        "vendorPrefix": "vnd.test",
        "responseHeader": "X-test-Media-Type"
    };

    return {
        get: function (key) {
            switch (key) {
                case 'versions':
                    return versions;
                case 'projectName':
                    return 'test';
                default:
                    throw new Error('The Mock Environment isn\'t configured for the key you are trying to retrieve: ' + key);
            }
        }
    };
};
