module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-mocha-test');

    // Update the grunt config
    grunt.config.set('mochaTest', {
        example: {
            options: {
                reporter: 'nyan', // 'spec', // 'min', // 'nyan', // 'xunit',
                //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                quiet: false // Optionally suppress output to standard out (defaults to false)
                //clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            require: 'coverage/blanket',
            src: ['./tests/error-handling/fixture.js']
        },
        default: {
            options: {
                reporter: 'nyan',
                quiet: false
            },
            src: ['./tests/**/*fixture.js']
        },
        coverage: {
            options: {
                reporter: 'html-cov',
                // use the quiet flag to suppress the mocha console output
                quiet: true,
                // specify a destination file to capture the mocha
                // output (the quiet option does not suppress this)
                captureFile: 'coverage.html'
            },
            src: ['./tests/**/*fixture.js']
        }
    });

    grunt.registerTask('test', ['mochaTest:default']);
    grunt.registerTask('coverage', ['mochaTest:coverage']);
};
