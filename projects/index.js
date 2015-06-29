/*jslint node: true, nomen: true*/
"use strict";
var Generator = require('../YoGenerator.js'),
    appGenerator,
    choices,
    namePrompt;

choices = {
    domain: {
        name: 'Domain project',
        callback: function ($this) {
            console.log('todo');
            // copy files from projects/domain
        }
    }
};

namePrompt = function () {
    var done = this.async(),
        app = '',
        prompts;

    switch (this.type) {
    case 'domain':
        app = 'project';
        break;
    }

    prompts = [{
        "name": 'projectName',
        "message": 'What\'s the name of your project?',
        "default": app
    }];

    this.prompt(prompts, function (props) {
        this.templatedata.projectName = props.projectName;
        done();
    }.bind(this));
};

appGenerator = new Generator(choices, namePrompt);
module.exports = appGenerator;
