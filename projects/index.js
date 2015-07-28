/*jshint quotmark: false*/
'use strict';
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
    },
    "express-app": {
        name: 'Node express project',
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
                $this.sourceRoot(path.join(__dirname, '../templates/projects/express-app'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                $this.fs.copy(path.join(templatePath, 'gitignore.txt'), path.join(destinationPath, '.gitignore'));
                $this.fs.copy(path.join(templatePath, 'environment.js'), path.join(destinationPath, 'environment.js'));
                $this.fs.copy(path.join(templatePath, 'ExceptionHandler.js'), path.join(destinationPath, 'ExceptionHandler.js'));
                $this.fs.copy(path.join(templatePath, 'expressStartup.js'), path.join(destinationPath, 'expressStartup.js'));
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'README.md'), path.join(destinationPath, 'README.md'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'startup.js'), path.join(destinationPath, 'startup.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, 'www.js'), path.join(destinationPath, 'www.js'));

                $this.fs.copy(path.join(templatePath, '/controllers/homeController.js'), path.join(destinationPath, '/controllers/homeController.js'));
                $this.fs.copy(path.join(templatePath, '/controllers/index.js'), path.join(destinationPath, '/controllers/index.js'));

                $this.fs.copy(path.join(templatePath, '/public/css/default.less'), path.join(destinationPath, '/public/css/default.less'));
                $this.fs.copy(path.join(templatePath, '/public/scripts/lib/bower.json'), path.join(destinationPath, '/public/scripts/lib/bower.json'));

                $this.fs.copy(path.join(templatePath, '/views/layout.hbs'), path.join(destinationPath, '/views/layout.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/index.hbs'), path.join(destinationPath, '/views/index.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/error.hbs'), path.join(destinationPath, '/views/error.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/templates/empty.hbs'), path.join(destinationPath, '/views/templates/empty.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/templates/error404.hbs'), path.join(destinationPath, '/views/templates/error404.hbs'));

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
