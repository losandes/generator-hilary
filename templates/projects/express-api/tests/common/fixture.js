'use strict';

var scope = require('hilary').scope('common', { logging: { level: 'error' } }),
    polyn = require('polyn'),
    ObjectID = require('bson-objectid'),
    registerBdd = require(relativeToTest('composition-helpers/register-bdd.js')),
    registerLogMemory = require(relativeToTest('composition-helpers/register-log-memory.js')),
    makeReadOnly = require(relativeToRoot('common/makeReadOnly.js')),
    makeReadOnlySpec = require('./makeReadOnly-spec.js');

function relativeToTest(path) { return '../' + path; }
function relativeToRoot(path) { return '../../' + path; }

registerBdd(scope);
registerLogMemory(scope);

scope.register({ name: 'ObjectID', dependencies: false, factory: ObjectID });
scope.register({ name: 'polyn', dependencies: false, factory: polyn });

scope.register(makeReadOnly);
scope.register(makeReadOnlySpec);

scope.register({
    name: 'fixture',
    dependencies: ['describe'],
    factory: function (describe) {

        describe('common', function () {
            scope.resolve('makeReadOnly-spec');
        });

        return true;
    }
});

scope.resolve('fixture');
