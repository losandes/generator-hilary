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
    }];
}

function Files () {
    'use strict';

    return [
        { src: 'gitignore.txt', dest: '.gitignore' },
        { src: 'jshintrc.txt', dest: '.jshintrc' },
        { src: 'index.js' },
        { src: 'package.json', template: true },
        { src: 'npm-install-all.sh' },
        { src: 'README.md', template: true },
        { src: '/app/startup.js', template: true },
        { src: '/app/package.json', template: true },
        { src: '/build/package.json', template: true },
        { src: '/build/gruntfile.js' },
        { src: '/build/tasks/test-task.js' },
        { src: '/tests/package.json', template: true },
        { src: '/tests/example.fixture.js' },
    ];
}

function Template () {
    'use strict';

    return {
        name: 'Node console project',
        callback: function ($this) {
            var done = $this.async();

            new Prompter({
                scope: $this,
                templatesPath: '../templates/projects/console',
                prompts: new Prompts(),
                files: new Files(),
                done: function (/*destinationPath*/) {
                    done();
                }
            }).prompt();
        } // /callback
    };
}
