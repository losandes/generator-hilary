module.exports.name = 'VersionHandler-spec';
module.exports.dependencies = ['versionHandler', 'vows', 'assert'];
module.exports.factory = (sut, vows, assert) => {
    'use strict';

    var RESPONSE_HEADER = 'X-API-Version';

    return vows.describe('VersionHandler').addBatch({
        'when the accept header is set,': {
            'and includes a date (application/json;version=20170320),': {
                topic: makeTopic('application/json;version=20170320'),
                'it should use the given version on res.locals': validateLocals,
                'it should use the given version on the response header': validateResHeader
            },
            'and includes a date (application/json;version=20170320;charset=UTF-8),': {
                topic: makeTopic('application/json;version=20170320;charset=UTF-8'),
                'it should use the given version on res.locals': validateLocals,
                'it should use the given version on the response header': validateResHeader
            },
            'and includes a date and spaces (application/json; version = 20170320 ),': {
                topic: makeTopic('application/json; version = 20170320 '),
                'it should use the given version on res.locals': validateLocals,
                'it should use the given version on the response header': validateResHeader
            },
            'and includes a hyphentated date (application/json;version=2017-03-20),': {
                topic: makeTopic('application/json;version=2017-03-20'),
                'it should use the given version on res.locals': validateLocals,
                'it should use the given version on the response header': validateResHeader
            },
            'and does NOT include a date (application/json;),': {
                topic: makeTopic('application/json;'),
                'it should use TODAY on res.locals': validateLocalsToday,
                'it should use TODAY on the response header': validateResHeaderToday
            },
            'and includes an unrecognized version (application/json;version=2.1),': {
                topic: makeTopic('application/json;version=2.1'),
                'it should use TODAY on res.locals': validateLocalsToday,
                'it should use TODAY on the response header': validateResHeaderToday
            },
            'and includes an unrecognized version (application/json;version=2017),': {
                topic: makeTopic('application/json;version=2017'),
                'it should use TODAY on res.locals': validateLocalsToday,
                'it should use TODAY on the response header': validateResHeaderToday
            },
            'and the media-type is NOT application/json': {
                topic: makeTopic('text/html'),
                'it should use TODAY on res.locals': validateLocalsToday,
                'it should use TODAY on the response header': validateResHeaderToday
            }
        },
        'when the accept header is NOT set': {
            topic: makeTopic(),
            'it should use TODAY on res.locals': validateLocalsToday,
            'it should use TODAY on the response header': validateResHeaderToday
        }
    });

    function makeTopic (acceptHeader) {
        return function () {
            var self = this,
                req = acceptHeader ? makeMockReq({ 'Accept': acceptHeader }) : makeMockReq(),
                res = makeMockRes();

            sut(req, res, function () {
                self.callback(null, {
                    req: req,
                    res: res,
                    header: acceptHeader
                });
            });
        };
    }

    function validateLocals (err, stuff) {
        assert.isNull(err);
        assert.equal(stuff.res.locals.apiVersion.version, 20170320);
    }

    function validateResHeader (err, stuff) {
        assert.isNull(err);
        assert.equal(stuff.res._headers[RESPONSE_HEADER], '20170320');
    }

    function validateLocalsToday (err, stuff) {
        assert.isNull(err);
        assert.equal(stuff.res.locals.apiVersion.version, formatDate(new Date()));
    }

    function validateResHeaderToday (err, stuff) {
        assert.isNull(err);
        assert.equal(stuff.res._headers[RESPONSE_HEADER], formatDate(new Date()));
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
