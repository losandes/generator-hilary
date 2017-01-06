module.exports = new Projects(require('../YoGenerator.js'));

function Projects (Generator) {
    'use strict';
    var namePrompt,
        choices = {
            expressApi: require('./expressApiProject.js').template,
            expressApp: require('./expressWebAppGidgetKoProject.js').template,
            console: require('./consoleProject.js').template,
            domain: require('./domainProject.js').template
        };

    namePrompt = function () {
        var $this = this,
            done = $this.async(),
            app = '',
            prompts;

        switch ($this.type) {
        case 'domain':
            app = 'domain';
            break;
        }

        prompts = [{
            "name": 'projectName',
            "message": 'What is the name of your project?',
            "default": app
        }];

        $this.prompt(prompts, function (props) {
            $this.templatedata.projectName = props.projectName;
            $this.templatedata.name = props.projectName;
            done();
        }.bind($this));
    };

    return new Generator(choices, namePrompt);
}
