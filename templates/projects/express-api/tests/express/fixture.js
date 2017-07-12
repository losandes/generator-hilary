'use strict';

var scope = require('hilary').scope('express', { logging: { level: 'error' } }),
    polyn = require('polyn'),
    ObjectID = require('bson-objectid'),
    errorHandling = require(relativeToRoot('error-handling')),
    env = require('./mockEnvironment.js'),
    express = require(relativeToRoot('express')),
    VersionHandler = require(relativeToRoot('express/VersionHandler.js')),
    makeReadOnly = require(relativeToRoot('common/makeReadOnly.js')),
    registerBdd = require('../composition-helpers/register-bdd.js'),
    registerLogSuppressor = require('../composition-helpers/register-log-suppressor.js'),
    expressRequestIdsSpec = require('./express-request-ids-spec.js'),
    VersionHandlerSpec = require('./VersionHandler-spec.js');

function relativeToRoot(path) { return '../../' + path; }

scope.register(errorHandling);
scope.register(express);
scope.register(env);
scope.register(makeReadOnly);
scope.register({name: 'VersionHandlerFactory', factory: function () { return VersionHandler.factory; }});

scope.register({ name: 'ObjectID', dependencies: [], factory: ObjectID });
scope.register({ name: 'polyn', dependencies: [], factory: polyn });

registerBdd(scope);
registerLogSuppressor(scope);

scope.register(expressRequestIdsSpec);
scope.register(VersionHandlerSpec);

scope.register({
    name: 'fixture',
    dependencies: ['describe'],
    factory: function (describe) {

        describe('express middleware,', function () {
            scope.resolve('express-request-ids-spec');
            scope.resolve('VersionHandler-spec');
        });

        return true;
    }
});

scope.resolve('fixture');
