/*jslint node: true, nomen: true*/
"use strict";
var Generator = require('../YoGenerator.js'),
    path = require('path'),
    appGenerator,
    choices,
    namePrompt;

choices = {
    console: {
        name: 'Node console project',
        callback: function ($this) {
            var done = $this.async(),
                prompts;

            prompts = [{
                "name": 'scope',
                "message": 'What is the name of the Hilary scope?',
                "default": 'myScope'
            }];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath;
                
                $this.templatedata.scope = props.scope;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/console'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                $this.fs.copy(path.join(templatePath, 'gitignore.txt'), path.join(destinationPath, '.gitignore'));
                $this.fs.copy(path.join(templatePath, 'index.js'), path.join(destinationPath, 'index.js'));
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, 'npm-install-all.sh'), path.join(destinationPath, 'npm-install-all.sh'));
                $this.fs.copyTpl(path.join(templatePath, 'README.md'), path.join(destinationPath, 'README.md'), $this.templatedata);

                $this.fs.copyTpl(path.join(templatePath, '/app/startup.js'), path.join(destinationPath, '/app/startup.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/app/package.json'), path.join(destinationPath, '/app/package.json'), $this.templatedata);

                $this.fs.copyTpl(path.join(templatePath, '/build/package.json'), path.join(destinationPath, '/build/package.json'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, '/build/gruntfile.js'), path.join(destinationPath, '/build/gruntfile.js'));
                $this.fs.copy(path.join(templatePath, '/build/tasks/test-task.js'), path.join(destinationPath, '/build/tasks/test-task.js'));

                $this.fs.copyTpl(path.join(templatePath, '/tests/package.json'), path.join(destinationPath, '/tests/package.json'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, '/tests/example.fixture.js'), path.join(destinationPath, '/tests/example.fixture.js'));
                
                done();
            }.bind($this));
            
        }
    },
    domain: {
        name: 'Node domain project',
        callback: function ($this) {
            var done = $this.async(),
                prompts;

            prompts = [{
                "name": 'namedModule',
                "message": 'What is the name of the first module you want to create?',
                "default": 'myModule'
            }];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath;
                
                $this.templatedata.namedModule = props.namedModule;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/domain'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);
                
                $this.fs.copyTpl(path.join(templatePath, 'index.js'), path.join(destinationPath, 'index.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'untitled.js'), path.join(destinationPath, props.namedModule + '.js'), $this.templatedata);
                
                done();
            }.bind($this));
        }
    }
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

appGenerator = new Generator(choices, namePrompt);
module.exports = appGenerator;
