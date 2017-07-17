module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-vows');
    grunt.config.set('vows', {
        all: {
            options: {
                // String {spec|json|dot-matrix|xunit|tap}
                // defaults to "dot-matrix"
                reporter: 'spec',

                // String or RegExp which is
                // matched against title to
                // restrict which tests to run
                // onlyRun: /helper/,

                // Boolean, defaults to false
                verbose: false,

                // Boolean, defaults to false
                silent: false,

                // Colorize reporter output,
                // boolean, defaults to true
                colors: true,

                // Run each test in its own
                // vows process, defaults to
                // false
                isolate: false,

                // String {plain|html|json|xml}
                // defaults to none
                coverage: 'json'
            },
            // String or array of strings
            // determining which files to include.
            // This option is grunt's "full" file format.
            src: [
                './**/*vows.js',
                // ignore
                '!./node_modules/**/*',
                '!./public/**/*',
                '!./views/**/*',
                '!./common/build-tasks/**/*'
            ]
        }
    });

    grunt.registerTask('test', ['vows:all', 'lint']);
};
