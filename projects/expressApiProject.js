module.exports.init = function (path) {
    'use strict';

    return {
        name: 'Node express API project',
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
                { src: 'app.js'},
                { src: 'environment.js'},
                { src: 'ExceptionHandler.js' },
                { src: 'expressStartup.js', template: true },
                { src: 'gitignore.txt', dest: '.gitignore' },
                { src: 'package.json', template: true },
                { src: 'README.md', template: true },
                { src: 'startup.js', template: true },
                { src: 'www.js' },
                { src: '/domain/express-middleware/corsHandler-default.js' },
                { src: '/domain/express-middleware/CorsHandler.js' },
                { src: '/domain/express-middleware/hbsBlocks.js' },
                { src: '/domain/express-middleware/versionHandler.js' },
                { src: '/domain/express-middleware/index.js' },
                { src: '/domain/controllers/homeController.js', template: true },
                { src: '/domain/controllers/exampleController.js', template: true },
                { src: '/domain/controllers/index.js' },
                { src: '/docs/index.md', template: true },
                { src: '/docs/_versioning.md', template: true },
                { src: '/docs/_cors.md' },
                { src: '/docs/_status-codes.md' },
                { src: '/docs/_legos.md' },
                { src: '/docs/_about.md' },
                { src: '/environment/environment.json', template: true },
                { src: '/public/favicon.ico' },
                { src: '/public/content/logo.png' },
                { src: '/public/css/_variables.less' },
                { src: '/public/css/_mixins.less' },
                { src: '/public/css/default.less' },
                { src: '/public/css/default.css' },
                { src: '/public/css/docs.less' },
                { src: '/public/css/docs.css' },
                { src: '/public/css/docs-slate.less' },
                { src: '/public/scripts/docs.js', template: true },
                { src: '/views/layout.hbs' },
                { src: '/views/docs.hbs' }
            ];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath, src, dest, i;

                $this.templatedata.scope = props.scope;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/express-api'));
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
