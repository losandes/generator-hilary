module.exports.prompts = Prompts();
module.exports.files = Files();
module.exports.template = Template();

var Prompter = require('./Prompter');

function Prompts () {
    'use strict';

    return [{
        "name": 'scope',
        "message": 'What is the name of the Hilary scope?',
        "default": 'myScope'
    },
    {
        "name": 'instructions',
        "message": 'This generator will create your project and install dependencies. When it is complete, you can run the app with ``npm start``. Checkout the README.md for more info.',
        "default": 'OK'
    }];
}

function Files () {
    'use strict';

    return [
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
}

function Template () {
    'use strict';

    return {
        name: 'Node express API project',
        callback: function ($this) {
            var done = $this.async();

            new Prompter({
                scope: $this,
                templatesPath: '../templates/projects/express-api',
                prompts: new Prompts(),
                files: new Files(),
                done: function (destinationPath) {
                    $this.on('end', function () {
                        $this.spawnCommand('npm', ['run', 'install-dependencies'], { cwd: destinationPath });
                    });

                    done();
                },
            }).prompt();
        } // /callback
    };
}
