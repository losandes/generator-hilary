'use strict';
module.exports = lint;

var reporter = require('jshint-stylish');

function lint (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.config.set('jshint', {
        options: {
            reporter: reporter,
            jshintrc: true, // '../.jshintrc',
        },
        all: [
            './*.js',
            './api/**/*.js',
            './build-tasks/**/*.js',
            './errorHandling/**/*.js',
            './express/**/*.js',
            './public/scripts/**/*.js'
        ]
    });

    grunt.registerTask('lint', ['jshint:all']);
}
