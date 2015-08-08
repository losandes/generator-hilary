module.exports.init = function (path) {
    'use strict';
    
    return {
        name: 'Node domain project',
        callback: function ($this) {
            var done = $this.async(),
                prompts;

            prompts = [{
                "name": 'namedModule',
                "message": 'What is the name of the first module you want to create?',
                "default": 'myModule'
            }];

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath;

                $this.templatedata.namedModule = props.namedModule;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/domain'));
                templatePath = $this.templatePath();
                destinationPath = path.join($this.destinationPath(), $this.templatedata.projectName);

                $this.fs.copyTpl(path.join(templatePath, 'index.js'), path.join(destinationPath, 'index.js'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'package.json'), path.join(destinationPath, 'package.json'), $this.templatedata);
                $this.fs.copyTpl(path.join(templatePath, 'untitled.js'), path.join(destinationPath, props.namedModule + '.js'), $this.templatedata);

                done();
            }.bind($this));
        }
    };
};
