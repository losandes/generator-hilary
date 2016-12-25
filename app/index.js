module.exports = JsGenerator(require('../YoGenerator.js'));

function JsGenerator (Generator) {
    'use strict';
    var choices,
        namePrompt;

    choices = {
        hilaryProject: {
            name: 'Hilary Project',
            callback: function ($this) {
                $this.composeWith('hilary:projects');
            }
        },
        hilaryNode: {
            name: 'Hilary Module :: Node',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-module-node.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        hilaryBrowser: {
            name: 'Hilary Module :: Browser',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-module-browser.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        hilaryCrossPlatform: {
            name: 'Hilary Module :: Cross-Platform',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-module.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        expressRouter: {
            name: 'Hilary Express Router',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-express-router.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        gidgetRouter: {
            name: 'Hilary Gidget Router',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-gidget-router.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        nodeStartup: {
            name: 'Hilary Startup (Composition Root) :: Node',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-startup-node.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        },
        browserStartup: {
            name: 'Hilary Startup (Composition Root) :: Browser',
            callback: function ($this) {
                $this.fs.copyTpl($this.templatePath('hilary-startup-browser.js'), $this.destinationPath($this.templatedata.name + '.js'), $this.templatedata);
            }
        }
    };

    namePrompt = function ($this, done) {
        var prompts;

        prompts = [{
            "name": 'scope',
            "message": 'What is the name of the Hilary scope?',
            "default": 'myScope'
        }, {
            "name": 'fileName',
            "message": 'What is the name of your module?',
            "default": 'myModule'
        }];

        $this.prompt(prompts, function (props) {
            $this.templatedata.scope = props.scope;
            $this.templatedata.name = props.fileName;
            done();
        }.bind($this));
    };

    return new Generator(choices, function () {
        if (this.type !== 'hilaryProject') {
            namePrompt(this, this.async());
        }
    });
}
