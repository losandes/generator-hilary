<%= projectName %>
==========

## Getting Started
Before running this app, install the NPM and bower dependencies:
```Shell
> npm install
> cd public/scripts/lib
? bower install
```

## Directories
The express app has the following directory structure:
```
- controllers
- public
- views
```

The ``build`` directory has ``grunt`` and ``grunt-mocha-test`` already configured. You can run the tests by navigating to the ``build`` directory and executing ``grunt test``. Grunt tasks are located in the ``tasks`` directory.

The ``tests`` folder is where the test specifications go. This project has ``mocha`` and ``chai`` already configured. The grunt test task will execute any files in the ``tests`` folder that end in ``*.fixture.js``. It will also recurse through a ``tests\specs`` folder, if it exists, where it will execute any files that end in ``*.fixture.js``.
