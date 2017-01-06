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
        // root
        { src: 'app.js'},
        { src: 'composition.js'},
        { src: 'environment.js'},
        { src: 'gitignore.txt', dest: '.gitignore' },
        { src: 'jshintrc.txt', dest: '.jshintrc' },
        { src: 'package.json', template: true },
        { src: 'README.md', template: true },
        // api
        { src: '/api/index.js'},
        { src: '/api/README.md', template: true },
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
