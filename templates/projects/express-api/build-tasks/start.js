'use strict';
module.exports = start;

var Spawner = require('./Spawner'),
    async = require('async');

function start (grunt) {
    grunt.registerTask('start', 'starts the app', function () {
        var spawner = new Spawner(),
            done = this.async(),
            makeAction,
            doneHandler,
            series = [];

        makeAction = function (path) {
            return function (callback) {
                spawner.spawnThis('npm', ['start'], { cwd: path }, callback);
            };
        };

        doneHandler = function (err, results) {
            var i;

            if (err) {
                console.error(err);
            } else {
                for (i = 0; i < results.length; i += 1) {
                    console.log(results[i]);
                }
            }

            done();
        };

        series.push(function (callback) {
            spawner.spawnThis('npm', ['start'], { cwd: grunt.config('path-root') }, callback);
        });

        async.parallel(series, doneHandler);
    });
}
