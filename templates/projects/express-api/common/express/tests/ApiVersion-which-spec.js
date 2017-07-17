module.exports.name = 'ApiVersion-which-spec';
module.exports.dependencies = ['versionHandler', 'vows', 'assert'];
module.exports.factory = (sut, vows, assert) => {
    'use strict';

    return vows.describe('ApiVersion.which').addBatch({
        'when which is used to find a supported version to use': {
            topic: makeTopic('application/json;version=20170205', [20161001, 20170117, 20170214, 20170320]),
            'it should choose the most recent version that is not after the accepted version': makeValidator(20170117),
            'and there is an EXACT MATCH for the supported version': {
                topic: makeTopic('application/json;version=20170205', [20161001, 20170117, 20170205, 20170320]),
                'it should choose the EXACT MATCH': makeValidator(20170205)
            },
            'and the client did not specify a version': {
                topic: makeTopic(null, [20161001, 20170117, 20170214, 20170320]),
                'it should choose the most recent version': makeValidator(20170320)
            },
            'and the client did not specify a version, and the versions include dates in the future': {
                topic: makeTopic(null, [20161001, 20170117, 20170214, 20990320]),
                'it should support scheduling versions to become available in the future': makeValidator(20170214),
            },
            'and the version specified by the client that precedes all supported versions': {
                topic: makeTopic('application/json;version=20160205', [20161001, 20170117, 20170205, 20170320]),
                'it should return null': makeValidator(null)
            }
        }
    });

    function makeValidator (expected) {
        return function (err, version) {
            assert.isNull(err);
            assert.equal(version, expected);
        };
    }

    function makeTopic (acceptHeader, versions) {
        return function () {
            var self = this,
                req = acceptHeader ? makeMockReq({ 'Accept': acceptHeader }) : makeMockReq(),
                res = makeMockRes();

            sut(req, res, function () {
                self.callback(null, res.locals.apiVersion.which(versions));
            });
        };
    }

    // NOTE: this matches the express response API, but not behavior
    function makeMockReq (headers) {
        headers = headers || {};

        return {
            get: function (name) {
                return headers[name];
            }
        };
    }

    // NOTE: this matches the express response API, but not behavior
    function makeMockRes () {
        var _headers = {};

        return {
            setHeader: function (name, val) {
                _headers[name] = val;
            },
            _headers: _headers,
            locals: {}
        };
    }
};
