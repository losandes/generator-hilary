module.exports.name = 'express-request-ids';
module.exports.dependencies = ['ObjectID'];
module.exports.factory = function (ObjectID) {
    'use strict';

    var header = 'X-Request-ID';

    return function (req, res, next) {
            // the server request ID is guaranteed to be unique per request
        var serverId = new ObjectID(),
            // the client request ID _can_ be defined by the client.
            // this is NOT guaranteed to be unique per request, if the client
            // actually sets it. The server request ID is used if the client
            // does not set it.
            clientId = makeRequestId(req.get(header), serverId);

        // puts the read-only requestIds on res.locals
        res.locals.requestIds = Object.freeze({
            clientId: clientId,
            serverId: serverId
        });

        // puts the client request ID in the response headers, so the client
        // can use it for continuity checks, logging, support calls, etc.
        res.setHeader(header, res.locals.requestIds.clientId.toString());

        next();
    };

    function makeRequestId (uid, serverId) {
        if (!uid) {
            // the client did not present a request ID, use the serverId
            return serverId;
        } else if (ObjectID.isValid(uid)) {
            // the client presented a BSON ObjectID as the request ID
            return new ObjectID(uid);
        } else {
            // the client presented an unknown type of request ID
            return uid;
        }
    }
};
