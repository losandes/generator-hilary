/*jshint quotmark: false*/
'use strict';
var Generator = require('../YoGenerator.js'),
    path = require('path'),
    choices,
    namePrompt;

choices = {
    console: require('./consoleProject.js').init(path),
    domain: require('./domainProject.js').init(path),
    expressApp: require('./expressAppProject.js').init(path),
    expressApi: require('./expressApiProject.js').init(path),
    expressApiBlueprint: require('./expressApiBlueprintProject.js').init(path)
};

namePrompt = function () {
    var $this = this,
        done = $this.async(),
        app = '',
        prompts;

    switch ($this.type) {
    case 'domain':
        app = 'domain';
        break;
    }

    prompts = [{
        "name": 'projectName',
        "message": 'What is the name of your project?',
        "default": app
    }];

    $this.prompt(prompts, function (props) {
        $this.templatedata.projectName = props.projectName;
        $this.templatedata.name = props.projectName;
        done();
    }.bind($this));
};

module.exports = new Generator(choices, namePrompt);
