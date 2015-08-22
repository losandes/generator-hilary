module.exports.init = function (path) {
    'use strict';

    return {
        name: 'Node express API project',
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
                $this.sourceRoot(path.join(__dirname, '../templates/projects/express-api'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                $this.fs.copy(path.join(templatePath, 'environment.js'), path.join(destinationPath, 'environment.js'));
                $this.fs.copy(path.join(templatePath, 'ExceptionHandler.js'), path.join(destinationPath, 'ExceptionHandler.js'));
                $this.fs.copyTpl(path.join(templatePath, 'expressStartup.js'), path.join(destinationPath, 'expressStartup.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, 'gitignore.txt'), path.join(destinationPath, '.gitignore'));
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'README.md'), path.join(destinationPath, 'README.md'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'startup.js'), path.join(destinationPath, 'startup.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, 'www.js'), path.join(destinationPath, 'www.js'));

                $this.fs.copy(path.join(templatePath, '/domain/express-middleware/corsHandler-default.js'), path.join(destinationPath, '/domain/express-middleware/corsHandler-default.js'));
                $this.fs.copy(path.join(templatePath, '/domain/express-middleware/CorsHandler.js'), path.join(destinationPath, '/domain/express-middleware/CorsHandler.js'));
                $this.fs.copy(path.join(templatePath, '/domain/express-middleware/index.js'), path.join(destinationPath, '/domain/express-middleware/index.js'));

                $this.fs.copyTpl(path.join(templatePath, '/controllers/homeController.js'), path.join(destinationPath, '/controllers/homeController.js'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, '/controllers/index.js'), path.join(destinationPath, '/controllers/index.js'));

                $this.fs.copyTpl(path.join(templatePath, '/docs/index.apib'), path.join(destinationPath, '/docs/index.apib'), $this.templatedata);
                $this.fs.copy(path.join(templatePath, '/docs/errors.md'), path.join(destinationPath, '/docs/errors.md'));
                $this.fs.copy(path.join(templatePath, '/docs/example-schema.json'), path.join(destinationPath, '/docs/example-schema.json'));

                $this.fs.copy(path.join(templatePath, '/environment/environment.json'), path.join(destinationPath, '/environment/environment.json'));

                $this.fs.copy(path.join(templatePath, '/public/favicon.ico'), path.join(destinationPath, '/public/favicon.ico'));
                $this.fs.copy(path.join(templatePath, '/public/css/_docs-variables.less'), path.join(destinationPath, '/public/css/_docs-variables.less'));
                $this.fs.copy(path.join(templatePath, '/public/css/docs.less'), path.join(destinationPath, '/public/css/docs.less'));
                $this.fs.copy(path.join(templatePath, '/public/css/default.less'), path.join(destinationPath, '/public/css/default.less'));
                $this.fs.copy(path.join(templatePath, '/public/css/default.css'), path.join(destinationPath, '/public/css/default.css'));
                $this.fs.copyTpl(path.join(templatePath, '/public/scripts/docs.js'), path.join(destinationPath, '/public/scripts/docs.js'), $this.templatedata);

                $this.fs.copy(path.join(templatePath, '/views/layout.jade'), path.join(destinationPath, '/views/layout.jade'));
                $this.fs.copy(path.join(templatePath, '/views/error.jade'), path.join(destinationPath, '/views/error.jade'));
                $this.fs.copy(path.join(templatePath, '/views/docs.jade'), path.join(destinationPath, '/views/docs.jade'));
                $this.fs.copy(path.join(templatePath, '/views/_docs-mixins.jade'), path.join(destinationPath, '/views/_docs-mixins.jade'));

                $this.on('end', function () {
                    $this.spawnCommand('npm', ['run', 'install-dependencies'], { cwd: destinationPath });
                });

                done();
            }.bind($this));
        }
    };
};
