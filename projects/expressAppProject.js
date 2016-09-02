module.exports.init = function (path) {
    'use strict';

    return {
        name: 'Node express web app with gidget and ko.js',
        callback: function ($this) {
            var done = $this.async(),
                prompts;

            prompts = [{
                "name": 'scope',
                "message": 'What is the name of the Hilary scope?',
                "default": 'myScope'
            },
            {
                "name": 'instructions',
                "message": 'This generator will create your project and install dependencies. When it is complete, you can run the app with ``npm start``. Checkout the README.md for more info.',
                "default": 'OK'
            }];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath;

                $this.templatedata.scope = props.scope;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/express-app'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                $this.fs.copy(path.join(templatePath, 'app.js'), path.join(destinationPath, 'app.js'));
                $this.fs.copy(path.join(templatePath, 'gitignore.txt'), path.join(destinationPath, '.gitignore'));
                $this.fs.copy(path.join(templatePath, 'environment.js'), path.join(destinationPath, 'environment.js'));
                $this.fs.copy(path.join(templatePath, 'ExceptionHandler.js'), path.join(destinationPath, 'ExceptionHandler.js'));
                $this.fs.copyTpl(path.join(templatePath, 'expressStartup.js'), path.join(destinationPath, 'expressStartup.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'README.md'), path.join(destinationPath, 'README.md'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'startup.js'), path.join(destinationPath, 'startup.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, 'www.js'), path.join(destinationPath, 'www.js'));

                $this.fs.copyTpl(path.join(templatePath, '/domain/controllers/homeController.js'), path.join(destinationPath, '/domain/controllers/homeController.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, '/domain/controllers/index.js'), path.join(destinationPath, '/domain/controllers/index.js'));

                $this.fs.copy(path.join(templatePath, '/environment/environment.json'), path.join(destinationPath, '/environment/environment.json'));

                $this.fs.copy(path.join(templatePath, '/public/favicon.ico'), path.join(destinationPath, '/public/favicon.ico'));
                $this.fs.copy(path.join(templatePath, '/public/css/default.less'), path.join(destinationPath, '/public/css/default.less'));
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/lib/bower.json'), path.join(destinationPath, '/public/scripts/lib/bower.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/ExceptionHandler.js'), path.join(destinationPath, '/public/scripts/src/ExceptionHandler.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/startup.js'), path.join(destinationPath, '/public/scripts/src/startup.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/ViewEngine.js'), path.join(destinationPath, '/public/scripts/src/ViewEngine.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/controllers/homeController.js'), path.join(destinationPath, '/public/scripts/src/controllers/homeController.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/controllers/exampleController.js'), path.join(destinationPath, '/public/scripts/src/controllers/exampleController.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/src/locale/en_US.js'), path.join(destinationPath, '/public/scripts/src/locale/en_US.js'), $this.templatedata);

                $this.fs.copy(path.join(templatePath, '/views/layout.hbs'), path.join(destinationPath, '/views/layout.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/index.hbs'), path.join(destinationPath, '/views/index.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/error.hbs'), path.join(destinationPath, '/views/error.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/templates/empty.hbs'), path.join(destinationPath, '/views/templates/empty.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/templates/error.hbs'), path.join(destinationPath, '/views/templates/error.hbs'));
                $this.fs.copy(path.join(templatePath, '/views/templates/nav.hbs'), path.join(destinationPath, '/views/templates/nav.hbs'));

                $this.on('end', function () {
                    $this.spawnCommand('npm', ['run', 'install-dependencies'], { cwd: destinationPath });
                    //
                    // $this.installDependencies({
                    //     skipInstall: $this.options['skip-install'],
                    //     callback: function () {
                    //         $this.spawnCommand('npm', ['install']);
                    //         $this.spawnCommand('bower', ['install']);
                    //     }.bind($this)
                    // });
                });

                done();
            }.bind($this));
        }
    };
};
