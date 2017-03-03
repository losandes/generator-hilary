module.exports.name = 'express-request-ids-spec';
module.exports.dependencies = ['express-request-ids', 'ObjectID', 'describe', 'describe', 'describe', 'it', 'expect'];
module.exports.factory = function (sut, ObjectID, describe, when, and, it, expect) {
    'use strict';

    describe('express-request-ids', function () {
        when('when the middleware is executed', function () {
            and('and a BSON ObjectID X-Request-ID header is present', function () {
                it('it should set res.locals.requestIds.clientId to the given X-Request-ID', function (done) {
                    var expected = new ObjectID().toString(),
                        req = makeMockReq({ 'X-Request-ID': expected }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res.locals.requestIds.clientId.toString()).to.equal(expected);
                        done();
                    });
                });

                it('it should set res.locals.requestIds.serverId to a DIFFERENT id', function (done) {
                    var clientId = new ObjectID().toString(),
                        req = makeMockReq({ 'X-Request-ID': clientId }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res.locals.requestIds.serverId.toString()).to.not.equal(clientId);
                        done();
                    });
                });

                it('it should set the response header to the given X-Request-ID', function (done) {
                    var expected = new ObjectID().toString(),
                        req = makeMockReq({ 'X-Request-ID': expected }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res._headers['X-Request-ID']).to.equal(expected);
                        done();
                    });
                });
            });

            and('and an UNKNOWN type of X-Request-ID header is present', function () {
                it('it should set res.locals.requestIds.serverId to a DIFFERENT id', function (done) {
                    var header = '12345',
                        req = makeMockReq({ 'X-Request-ID': header }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res.locals.requestIds.serverId.toString()).to.not.equal(header);
                        done();
                    });
                });

                it('it should set res.locals.requestIds.clientId to the clientId', function (done) {
                    var header = '12345',
                        req = makeMockReq({ 'X-Request-ID': header }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res.locals.requestIds.clientId)
                            .to.equal(header);
                        done();
                    });
                });

                it('it should set the response header to the clientId', function (done) {
                    var header = '12345',
                        req = makeMockReq({ 'X-Request-ID': header }),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res._headers['X-Request-ID'])
                            .to.equal(res.locals.requestIds.clientId);
                        done();
                    });
                });
            });

            and('and an X-Request-ID header is NOT present', function () {
                it('it should set res.locals.requestIds.serverId', function (done) {
                    var req = makeMockReq(),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(ObjectID.isValid(res.locals.requestIds.serverId)).to.equal(true);
                        done();
                    });
                });

                it('it should set res.locals.requestIds.clientId to the serverId', function (done) {
                    var req = makeMockReq(),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res.locals.requestIds.clientId.toString())
                            .to.equal(res.locals.requestIds.serverId.toString());
                        done();
                    });
                });

                it('it should set the response header to the serverId', function (done) {
                    var req = makeMockReq(),
                        res = makeMockRes();

                    sut(req, res, function () {
                        expect(typeof res.locals.requestIds).to.equal('object');
                        expect(res._headers['X-Request-ID'])
                            .to.equal(res.locals.requestIds.serverId.toString());
                        done();
                    });
                });
            });
        });
    });

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

    return true;
};
