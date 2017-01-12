module.exports = Prompter;

var path = require('path');

function Prompter (options) {
    'use strict';
    var self = {
            prompt: undefined
        };

    if (
        !options ||
        !options.scope ||
        typeof options.templatesPath !== 'string' ||
        !Array.isArray(options.prompts) ||
        (!Array.isArray(options.files) && typeof options.files !== 'function') ||
        typeof options.done !== 'function'
    ) {
        throw new Error('options are not valid');
    }

    self.prompt = function () {
        var $this = options.scope;

        $this.prompt(options.prompts, function (choices) {
            var files, templatePath, destinationPath, src, dest, i;

            if (typeof options.files === 'function') {
                console.log(choices);
                files = options.files(choices);
            } else {
                files = options.files;
            }

            $this.templatedata.scope = choices.scope;
            $this.sourceRoot(path.join(__dirname, options.templatesPath));
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

            options.done(destinationPath, choices);
        }.bind($this));
    };

    return self;
}
