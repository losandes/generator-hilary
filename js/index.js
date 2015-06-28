/*jslint node: true, nomen: true*/
"use strict";
var Generator = require('../YoGenerator.js'),
    jsGenerator,
    choices,
    namePrompt;

choices = {
    hilaryNode: {
        name: 'Hilary Module :: Node',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('hilary-module-node.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    },
    hilaryBrowser: {
        name: 'Hilary Module :: Browser',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('hilary-module-browser.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    },
    hilaryCrossPlatform: {
        name: 'Hilary Module :: Cross-Platform',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('hilary-module.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    },
    expressRouter: {
        name: 'Hilary Express Router',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('hilary-express-router.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    },
    gidgetRouter: {
        name: 'Hilary Gidget Router',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('hilary-gidget-router.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    },
    iife: {
        name: 'iife',
        callback: function ($this) {
            $this.fs.copyTpl($this.templatePath('iife.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
        }
    }
};

namePrompt = function () {
    var done = this.async(),
        prompts;

    prompts = [{
        "name": 'scope',
        "message": 'What is the name of the Hilary scope?',
        "default": 'myScope'
    }, {
        "name": 'fileName',
        "message": 'What is the name of your module?',
        "default": 'myModule'
    }];

    this.prompt(prompts, function (props) {
        this.templatedata.scope = props.scope;
        this.templatedata.name = props.fileName;
        done();
    }.bind(this));
};

jsGenerator = new Generator(choices, namePrompt);
module.exports = jsGenerator;
