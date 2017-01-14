'use strict';
module.exports = help;

var chalk = require('chalk');

function help (grunt) {
    grunt.registerTask('help', 'tell me more...', function () {
        console.log('');
        printHeader('Legend');
        printDefinition('command', 'definition/explanation/behavior', 'supported switches');
        printExample('example');
        console.log('');

        printHeader('Run/Debug Commands');
        printDefinition('grunt start', 'Runs the app, watches for changes');
        console.log('');

        printHeader('Test/Lint Commands');
        printDefinition('grunt test', 'Runs the unit tests (if you installed the test features)');
        printDefinition('grunt lint', 'Lints the JavaScript, using JSHint');
        console.log('');
    });
}

function printDefinition (name, definition, switchList) {
    if (switchList) {
        console.log(chalk.bold.blue(name), chalk.white(definition) + chalk.italic.magenta(' ' + switchList));
    } else {
        console.log(chalk.bold.blue(name), chalk.white(definition));
    }
}

function printHeader (header) {
    console.log(chalk.bold.bgYellow.black(header));
}

function printExample (example) {
    console.log(chalk.white(example));
}
