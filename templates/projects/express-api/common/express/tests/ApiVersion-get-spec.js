module.exports.name = 'ApiVersion-get-spec';
module.exports.dependencies = ['versionHandler', 'vows', 'assert'];
module.exports.factory = (sut, vows, assert) => {
    // jshint validthis:true, unused:false
    'use strict';

    var RESPONSE_HEADER = 'X-API-Version';

    return vows.describe('ApiVersion.get').addBatch({
        'when get is used to identify the appropriate value/function': {
            'and the client supplied a valid version': {
                topic: makeTopic('application/json;version=20170205', {
                    '20161001': 20161001,
                    '20170117': 20170117,
                    '20170214': 20170214,
                    '20170320': 20170320
                }),
                'it should choose the most recent version that is not after the accepted version': makeValidator('20170117', 20170117),
                'it should set the  response header': makeResponseHeaderValidator('20170117')
            },
            'and the client supplied a valid version, and the response is not passed to `get`': {
                topic: makeTopicWithNoResArg('application/json;version=20170205', {
                    '20161001': 20161001,
                    '20170117': 20170117,
                    '20170214': 20170214,
                    '20170320': 20170320
                }),
                'it should choose the most recent version that is not after the accepted version': makeValidator('20170117', 20170117),
                'it should leave the  response header set to the client date': makeResponseHeaderValidator('20170205')
            },
            'and the client supplied a version that precedes all supported versions': {
                topic: makeTopic('application/json;version=20160205', {
                    '20161001': 20161001,
                    '20170117': 20170117,
                    '20170214': 20170214,
                    '20170320': 20170320
                }),
                'it should pass an error to the callback': function (err, result) {
                    assert.typeOf(err, 'object');
                },
                'it should leave the  response header set to the client date': function (err, result, res) {
                    assert.equal(res._headers[RESPONSE_HEADER].toString(), '20160205');
                }
            }
        }
    });

    function makeValidator (expectedVersion, expectedValue) {
        return function (err, result) {
            assert.isNull(err);
            assert.equal(result.version, expectedVersion);
            assert.equal(result.value, expectedValue);
        };
    }

    function makeResponseHeaderValidator (expectedVersion) {
        return function (err, result, res) {
            assert.isNull(err);
            assert.equal(res._headers[RESPONSE_HEADER].toString(), expectedVersion);
        };
    }

    function makeTopic (acceptHeader, versionMap) {
        return function () {
            var self = this,
                req = acceptHeader ? makeMockReq({ 'Accept': acceptHeader }) : makeMockReq(),
                res = makeMockRes();

            sut(req, res, function () {
                // note the callback is the 3rd arg; res is the 2nd arg
                res.locals.apiVersion.get(versionMap, res, function (err, result) {
                    self.callback(err, result, res);
                });
            });
        };
    }

    function makeTopicWithNoResArg (acceptHeader, versionMap) {
        return function () {
            var self = this,
                req = acceptHeader ? makeMockReq({ 'Accept': acceptHeader }) : makeMockReq(),
                res = makeMockRes();

            sut(req, res, function () {
                // note the callback is the 2ng arg; res is not passed to `get`
                res.locals.apiVersion.get(versionMap, function (err, result) {
                    self.callback(err, result, res);
                });
            });
        };
    }

    function formatDate(date) {
        return parseInt(date.toISOString().slice(0,10).replace(/-/g,''));
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
