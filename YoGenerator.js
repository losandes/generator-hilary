/*jslint node: true, nomen: true*/
"use strict";

var yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    path = require('path'),
    YoGenerator;

YoGenerator = function (choices, namePrompt) {
    return yeoman.generators.Base.extend({
        constructor: function () {
            yeoman.generators.Base.apply(this, arguments);
        },
        init: function () {
            this.log(yosay('Welcome to the Hilary generator!'));
            this.templatedata = {};
        },
        askFor: function () {
            var done = this.async(),
                prompts,
                promptChoices = [],
                choice;
            
            for (choice in choices) {
                if (choices.hasOwnProperty(choice)) {
                    promptChoices.push({
                        name: choices[choice].name,
                        value: choice
                    });
                }
            }

            prompts = [{
                type: 'list',
                name: 'type',
                message: 'What do you want to create?',
                choices: promptChoices
            }];

            this.prompt(prompts, function (props) {
                this.type = props.type;
                done();
            }.bind(this));
        },
        askForName: namePrompt,
        writing: function () {
            this.sourceRoot(path.resolve(__dirname, './templates'));
            var handler = choices[this.type];
            
            if (handler) {
                handler.callback(this);
            } else {
                this.log('Unknown file type');
            }
        }
    });
};


module.exports = YoGenerator;
