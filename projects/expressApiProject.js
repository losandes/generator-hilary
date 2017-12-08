'use strict';
module.exports.prompts = Prompts();
module.exports.files = Files;
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
        "name": 'tests',
        "message": 'Do you want to install vows for unit tests (requires grunt)?',
        "default": 'yes'
    }, {
        "name": 'instructions',
        "message": 'This generator will create your project and install dependencies. When it is complete, you can run the app with ``npm start``. Checkout the README.md for more info.',
        "default": 'OK'
    }];
}

function Files (choices) {
    var files = [
        // root
        { src: 'apis.js'},
        { src: 'app.js'},
        { src: 'composition.js' },
        { src: 'gruntfile.js'},
        { src: 'README.md', template: true },
        { src: 'gitignore.txt', dest: '.gitignore' },
        { src: 'jshintrc.txt', dest: '.jshintrc' },

        // common
        { src: '/common/README.md', template: true },

        // common/build-tasks
        { src: '/common/build-tasks/help.js'},
        { src: '/common/build-tasks/lint.js'},
        { src: '/common/build-tasks/Spawner.js'},
        { src: '/common/build-tasks/start.js'},

        // common/environment
        { src: '/common/environment/environment.js'},
        { src: '/common/environment/environment.json', template: true },
        { src: '/common/environment/README.md' },

        // common/error-handling
        { src: '/common/error-handling/index.js' },
        { src: '/common/error-handling/Exception.js' },
        { src: '/common/error-handling/ExceptionHandler.js' },
        { src: '/common/error-handling/exceptions.js' },
        { src: '/common/error-handling/logger.js' },

        // common/express
        { src: '/common/express/index.js' },
        { src: '/common/express/CorsHandler.js' },
        { src: '/common/express/corsOptions.js' },
        { src: '/common/express/express-errors-404.js' },
        { src: '/common/express/express-errors-500.js' },
        { src: '/common/express/express-request-ids.js' },
        { src: '/common/express/express-startup.js' },
        { src: '/common/express/hbsBlocks.js' },
        { src: '/common/express/versionHandler.js' },
        { src: '/common/express/www.js' },

        // common/utils
        { src: '/common/utils/index.js'},
        { src: '/common/utils/idFactory.js'},

        // home
        { src: '/home/docRenderer.js' },
        { src: '/home/homeController.js'},
        { src: '/home/mdParser.js' },
        { src: '/home/README.md', template: true },
        { src: '/home/stringHelper.js' },
        { src: '/home/producers/curlProducer.js' },
        { src: '/home/producers/goProducer.js' },
        { src: '/home/producers/jsProducer-browser-fetch.js' },
        { src: '/home/producers/jsProducer-node-request.js' },

        // legos
        { src: '/legos/Lego.js'},
        { src: '/legos/legoController.js'},
        { src: '/legos/README.md', template: true },

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

    if (choices.tests) {
        files.push({ src: '/common/build-tasks/test.js' });
        files.push({ src: '/common/tests/composition-helpers/register-log-memory.js' });
        files.push({ src: '/common/tests/composition-helpers/register-log-suppressor.js' });
        files.push({ src: '/common/tests/testComposition.js' });
        files.push({ src: '/common/tests/README.md' });

        // common/error-handling
        files.push({ src: '/common/error-handling/tests/error-handling-vows.js' });
        files.push({ src: '/common/error-handling/tests/ExceptionHandler-spec.js' });

        // common/express
        files.push({ src: '/common/express/tests/express-vows.js' });
        files.push({ src: '/common/express/tests/ApiVersion-which-spec.js' });
        files.push({ src: '/common/express/tests/ApiVersion-get-spec.js' });
        files.push({ src: '/common/express/tests/express-request-ids-spec.js' });
        files.push({ src: '/common/express/tests/versionHandler-spec.js' });
    }

    return files;
}

function savePackage(choices, destinationPath, callback) {
    var gruntConfig = pkg.grunt,
        testsConfig = pkg.tests,
        fileName = path.join(destinationPath, 'package.json'),
        yes = /yes|y|true/i;

    delete pkg.grunt;
    delete pkg.tests;
    pkg.name = choices.scope;
    pkg.description = choices.scope + ' API built on hilary, polyn, and express';

    if (yes.test(choices.grunt) || yes.test(choices.tests)) {
        copyDevDependencies(gruntConfig, pkg);
    }

    if (yes.test(choices.tests)) {
        copyDevDependencies(testsConfig, pkg);
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
                files: Files,
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
