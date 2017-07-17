module.exports = function (grunt) {
    'use strict';

    var os;

    // arguments
    os = grunt.option('os') || 'osx';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.config('path-root', '.');
    grunt.config('path-to-scripts', './public/scripts');
    grunt.config('path-to-environment', './common/environment');

    grunt.loadTasks('./common/build-tasks');
    grunt.registerTask('default', ['help']);
};
