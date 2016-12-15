module.exports.init = function (path) {
    'use strict';

    return {
        name: 'Node express web app with gidget and ko.js',
        callback: function ($this) {
            var done = $this.async(),
                prompts,
                files;

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

            files = [
                { src: 'gitignore.txt', dest: '.gitignore' },
                { src: 'app.js' },
                { src: 'environment.js' },
                { src: 'ExceptionHandler.js' },
                { src: 'expressStartup.js', template: true },
                { src: 'package.json', template: true },
                { src: 'README.md', template: true },
                { src: 'startup.js', template: true },
                { src: 'www.js' },
                { src: '/domain/controllers/homeController.js', template: true },
                { src: '/domain/controllers/index.js' },
                { src: '/environment/environment.json' },
                { src: '/public/favicon.ico' },
                { src: '/public/css/default.less' },
                { src: '/public/scripts/lib/bower.json', template: true },
                { src: '/public/scripts/src/ExceptionHandler.js', template: true },
                { src: '/public/scripts/src/startup.js', template: true },
                { src: '/public/scripts/src/ViewEngine.js', template: true },
                { src: '/public/scripts/src/controllers/homeController.js', template: true },
                { src: '/public/scripts/src/controllers/exampleController.js', template: true },
                { src: '/public/scripts/src/locale/en_US.js', template: true },
                { src: '/views/layout.hbs' },
                { src: '/views/index.hbs' },
                { src: '/views/error.hbs' },
                { src: '/views/templates/empty.hbs' },
                { src: '/views/templates/error.hbs' },
                { src: '/views/templates/nav.hbs' }
            ];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath, src, dest, i;

                $this.templatedata.scope = props.scope;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/express-app-gidget-ko'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                for (i = 0; i < files.length; i += 1) {
                    src = path.join(templatePath, files[i].src);
                    dest = path.join(destinationPath, (files[i].dest || files[i].src));

                    if (files[i].template) {
                        $this.fs.copyTpl(src, dest, $this.templatedata);
                    } else {
                        $this.fs.copy(src, dest);
                    }
                }

                $this.on('end', function () {
                    $this.spawnCommand('npm', ['run', 'install-dependencies'], { cwd: destinationPath });
                });

                done();
            }.bind($this));
        }
    };
};
