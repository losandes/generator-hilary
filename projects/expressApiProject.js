'use strict';
module.exports.prompts = Prompts();
module.exports.files = Files();
module.exports.template = Template();

var Prompter = require('./Prompter'),
    path = require('path'),
    fs = require('fs'),
    templatePath = '../templates/projects/express-api',
    pkg = require(path.normalize(templatePath + '/package.js'));

function Prompts () {
    return [{
        "name": 'scope',
        "message": 'What is the name of the Hilary scope?',
        "default": 'myScope'
    }, {
        "name": 'grunt',
        "message": 'Do you want to install grunt?',
        "default": 'yes'
    }, {
        "name": 'instructions',
        "message": 'This generator will create your project and install dependencies. When it is complete, you can run the app with ``npm start``. Checkout the README.md for more info.',
        "default": 'OK'
    }];
}

function Files () {
    return [
        // root
        { src: 'app.js'},
        { src: 'composition.js'},
        { src: 'environment.js'},
        { src: 'gruntfile.js'},
        { src: 'README.md', template: true },
        { src: 'gitignore.txt', dest: '.gitignore' },
        { src: 'jshintrc.txt', dest: '.jshintrc' },

        // api
        { src: '/api/index.js'},
        { src: '/api/README.md', template: true },
        // build-tasks
        { src: '/build-tasks/help.js'},
        { src: '/build-tasks/lint.js'},
        { src: '/build-tasks/Spawner.js'},
        { src: '/build-tasks/start.js'},
        // api/home
        { src: '/api/home/docRenderer.js', template: true},
        { src: '/api/home/homeController.js'},
        { src: '/api/home/README.md', template: true },
        // api/legos
        { src: '/api/legos/Lego.js'},
        { src: '/api/legos/legoController.js'},
        { src: '/api/legos/README.md', template: true },
        // environment
        { src: '/environment/environment.json', template: true },
        // errorHandling
        { src: '/errorHandling/index.js' },
        { src: '/errorHandling/ExceptionHandler.js' },
        { src: '/errorHandling/exceptions.js' },
        //express
        { src: '/express/index.js' },
        { src: '/express/defaultCorsHandler.js' },
        { src: '/express/CorsHandler.js' },
        { src: '/express/express-errors-404.js' },
        { src: '/express/express-errors-500.js' },
        { src: '/express/express-startup.js' },
        { src: '/express/hbsBlocks.js' },
        { src: '/express/versionHandler.js' },
        { src: '/express/www.js' },
        // public
        { src: '/public/favicon.ico' },
        { src: '/public/content/logo.png' },
        { src: '/public/css/_variables.less' },
        { src: '/public/css/_mixins.less' },
        { src: '/public/css/default.less' },
        { src: '/public/css/default.css' },
        { src: '/public/css/docs.less' },
        { src: '/public/css/docs.css' },
        { src: '/public/css/docs-slate.less' },
        { src: '/public/scripts/docs.js' },
        // views
        { src: '/views/layout.hbs' },
        { src: '/views/docs.hbs' }
    ];
}

function savePackage(choices, destinationPath, callback) {
    var gruntConfig = pkg.grunt,
        fileName = path.join(destinationPath, 'package.json');

    delete pkg.grunt;
    pkg.name = choices.scope;
    pkg.description = choices.scope + ' API built on hilary, polyn, and express';

    if (/yes|y|true/i.test(choices.grunt)) {
        copyDevDependencies(gruntConfig, pkg);
    }

    fs.writeFile(fileName, JSON.stringify(pkg, null, 4), callback);
}

function copyDevDependencies(source, pkg) {
    var prop;

    pkg.devDependencies = pkg.devDependencies || {};

    for (prop in source.devDependencies) {
        if (source.devDependencies.hasOwnProperty(prop)) {
            pkg.devDependencies[prop] = pkg.devDependencies[prop] ||
                source.devDependencies[prop];
        }
    }
}

function Template () {
    return {
        name: 'Node express API project',
        callback: function ($this) {
            var done = $this.async();

            new Prompter({
                scope: $this,
                templatesPath: templatePath,
                prompts: new Prompts(),
                files: new Files(),
                done: function (destinationPath, choices) {
                    $this.on('end', function () {
                        savePackage(choices, destinationPath, function (err) {
                            if (err) {
                                throw err;
                            }

                            $this.spawnCommand('npm', ['run', 'install-dependencies'], { cwd: destinationPath });
                        });
                    });

                    done();
                },
            }).prompt();
        } // /callback
    };
}
