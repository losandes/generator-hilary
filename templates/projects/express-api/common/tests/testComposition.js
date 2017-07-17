var hilary = require('hilary'),
    vows = require('vows'),
    nconf = require('nconf'),
    ObjectID = require('bson-objectid'),
    environment = require('../environment/environment.js'),
    env = environment.factory(nconf),
    scopeId = env.get('projectName');

module.exports.compose = TestComposition;

function TestComposition (testTasks, done) {
    'use strict';

    var scope = hilary.scope(scopeId, {
            logging: {
                level: 'off' // trace|debug|info|warn|error|fatal|off
            }
        }),
        tasks = [
            scope.makeRegistrationTask(require('../../apis.js')),
            scope.makeRegistrationTask(require('../index.js')),
            scope.makeRegistrationTask(require('../error-handling')),
            scope.makeRegistrationTask(require('../express')),
            function composeUtils (scope, next) {
                scope.register({ name: 'appDir', factory: __dirname });
                scope.register({ name: 'ObjectID', factory: ObjectID, dependencies: [] });
                scope.register({ name: 'environment', factory: function () { return env; }});

                scope.register({ name: 'vows', factory: vows });

                next(null, scope);
            },
            require('./composition-helpers/register-log-memory.js')
        ];

    // support done as a first arg
    done = done || testTasks;

    // support tasks as a first arg
    if (Array.isArray(testTasks)) {
        tasks = tasks.concat(testTasks);
    }

    scope.bootstrap(tasks, done);
}
