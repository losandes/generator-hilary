'use strict';

var Hilary = require('hilary'),
    polyn = require('polyn'),
    ObjectID = require('bson-objectid'),
    registerBdd = require(relativeToTest('composition-helpers/register-bdd.js')),
    registerLogMemory = require(relativeToTest('composition-helpers/register-log-memory.js')),
    makeReadOnly = require(relativeToRoot('common/makeReadOnly.js')),
    makeReadOnlySpec = require('./makeReadOnly-spec.js');

function relativeToTest(path) { return '../' + path; }
function relativeToRoot(path) { return '../../' + path; }

new Hilary().Bootstrapper({
    composeLifecycle: function (err, scope, pipeline) {
        pipeline.register.on.error(function (err) {
            console.log(err);
        });
    },
    composeModules: function (err, scope) {
        registerBdd(scope);
        registerLogMemory(scope);

        scope.register({ name: 'ObjectID', singleton: true, dependencies: [], factory: ObjectID });
        scope.register({ name: 'polyn::is', singleton: true, dependencies: [], factory: polyn.is });

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
    },
    onComposed: function (err, scope) {
        scope.resolve('fixture');
    }
});
