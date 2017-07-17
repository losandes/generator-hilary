module.exports.name = 'express-request-ids-spec';
module.exports.dependencies = ['express-request-ids', 'ObjectID', 'vows', 'assert'];
module.exports.factory = function (sut, ObjectID, vows, assert) {
    // jshint validthis:true, unused:false
    'use strict';

    return vows.describe('express-request-ids').addBatch({
        'when the middleware is executed': {
            'and a BSON ObjectID X-Request-ID header is present': {
                topic: bsonRequestIdExistsTopic,
                'it should use that ID for the clientId': clientIdIsSetWhenBsonRequestIdExists,
                'it should use a DIFFERENT ID for the serverId': serverIdIsSetWhenBsonRequestIdExists,
                'it should use that ID to set the response header': responseHeaderIsSetWhenBsonRequestIdExists
            },
            'and an UNKNOWN type of X-Request-ID header is present': {
                topic: unkownRequestIdExistsTopic,
                'it should use that ID for the clientId': clientIdIsSetWhenUnkownRequestIdExists,
                'it should use a DIFFERENT ID for the serverId': serverIdIsSetWhenUnkownRequestIdExists,
                'it should use that ID to set the response header': responseHeaderIsSetWhenUnkownRequestIdExists
            },
            'and the X-Request-ID header is NOT present': {
                topic: requestIdMissingTopic,
                'it should use that ID for the clientId': clientIdIsSetWhenRequestIdIsMissing,
                'it should use the SAME ID for the serverId': serverIdIsSetWhenRequestIdIsMissing,
                'it should use that ID to set the response header': responseHeaderIsSetWhenRequestIdIsMissing
            }
        }
    });


    function bsonRequestIdExistsTopic () {
        var self = this,
            expected = new ObjectID().toString(),
            req = makeMockReq({ 'X-Request-ID': expected }),
            res = makeMockRes();

        sut(req, res, function () {
            self.callback(null, {
                req: req,
                res: res,
                expected: expected
            });
        });
    }

    function clientIdIsSetWhenBsonRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(stuff.res.locals.requestIds.clientId.toString(), stuff.expected);
    }

    function serverIdIsSetWhenBsonRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.notEqual(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.res.locals.requestIds.clientId.toString()
        );
        assert.equal(ObjectID.isValid(stuff.res.locals.requestIds.serverId), true);
    }

    function responseHeaderIsSetWhenBsonRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(stuff.res._headers['X-Request-ID'], stuff.expected);
    }

    function unkownRequestIdExistsTopic () {
        var self = this,
            header = '12345',
            req = makeMockReq({ 'X-Request-ID': header }),
            res = makeMockRes();

        sut(req, res, function () {
            self.callback(null, {
                req: req,
                res: res,
                header: header
            });
        });
    }

    function clientIdIsSetWhenUnkownRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(stuff.res.locals.requestIds.clientId.toString(), stuff.header);
    }

    function serverIdIsSetWhenUnkownRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.notEqual(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.res.locals.requestIds.clientId.toString()
        );
        assert.notEqual(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.header
        );
        assert.equal(ObjectID.isValid(stuff.res.locals.requestIds.serverId), true);
    }

    function responseHeaderIsSetWhenUnkownRequestIdExists (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(stuff.res._headers['X-Request-ID'], stuff.header);
    }

    function requestIdMissingTopic () {
        var self = this,
            req = makeMockReq(),
            res = makeMockRes();

        sut(req, res, function () {
            self.callback(null, {
                req: req,
                res: res
            });
        });
    }

    function clientIdIsSetWhenRequestIdIsMissing (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(ObjectID.isValid(stuff.res.locals.requestIds.clientId), true);
        assert.equal(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.res.locals.requestIds.clientId.toString()
        );
    }

    function serverIdIsSetWhenRequestIdIsMissing (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(ObjectID.isValid(stuff.res.locals.requestIds.serverId), true);
        assert.equal(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.res.locals.requestIds.clientId.toString()
        );
    }

    function responseHeaderIsSetWhenRequestIdIsMissing (err, stuff) {
        assert.typeOf(stuff.res.locals.requestIds, 'object');
        assert.equal(ObjectID.isValid(stuff.res.locals.requestIds.serverId), true);
        assert.equal(
            stuff.res.locals.requestIds.serverId.toString(),
            stuff.res._headers['X-Request-ID']
        );
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
