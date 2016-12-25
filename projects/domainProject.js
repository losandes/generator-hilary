module.exports.prompts = Prompts();
module.exports.files = Files();
module.exports.template = Template();

var Prompter = require('./Prompter');

function Prompts () {
    'use strict';

    return [{
        "name": 'namedModule',
        "message": 'What is the name of the first module you want to create?',
        "default": 'myModule'
    }];
}

function Files () {
    'use strict';

    return [
        { src: 'index.js', template: true },
        { src: 'package.json', template: true },
        { src: 'untitled.js', template: true }
    ];
}

function Template () {
    'use strict';

    return {
        name: 'Node domain project',
        callback: function ($this) {
            var done = $this.async();

            new Prompter({
                scope: $this,
                templatesPath: '../templates/projects/domain',
                prompts: new Prompts(),
                files: new Files(),
                done: function (/*destinationPath*/) {
                    done();
                }
            }).prompt();
        } // /callback
    };
}
