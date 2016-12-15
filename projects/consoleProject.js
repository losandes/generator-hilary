module.exports.init = function (path) {
    'use strict';

    return {
        name: 'Node console project',
        callback: function ($this) {
            var done = $this.async(),
                prompts,
                files;

            prompts = [{
                "name": 'scope',
                "message": 'What is the name of the Hilary scope?',
                "default": 'myScope'
            }];

            files = [
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

            $this.prompt(prompts, function (props) {
                var templatePath, destinationPath, src, dest, i;

                $this.templatedata.scope = props.scope;
                $this.sourceRoot(path.join(__dirname, '../templates/projects/console'));
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

                done();
            }.bind($this));

        }
    };
};
