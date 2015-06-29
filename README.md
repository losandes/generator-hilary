generator-hilary
===========


Yeoman generator for projects that use hilary IoC (DI).

## Getting Started

- Dependencies:
    - node.js: ``brew install node`` for OSX, ``choco install node`` for Windows
    - Yeoman: ``npm install -g yo``
- Install: ``npm install -g generator-hilary``
- Run: ``yo hilary``

## Usage

* ``yo hilary`` shows a wizard for generating a new ASP.NET app
* ``yo hilary --help`` shows flags and other configurable options

## Generators
Available generators

* [Hilary Module :: Node](#Hilary Module :: Node)
* [Hilary Module :: Browser](#Hilary Module :: Browser)
* [Hilary Module :: Cross Platform](#Hilary Module :: Cross Platform)
* [Hilary Express Router](#Hilary Express Router)
* [Hilary Gidget Router](#Hilary Gidget Router)

### Hilary Module :: Node
Creates a new Hilary compatible Node file

Example:

```
? What do you want to create?
>Hilary Module :: Node
? What is the name of the Hilary scope?
>myScope
? What is the name of your module?
>myModule
```

Produces `/myModule.js`

```JavaScript
/*jslint node: true*/
module.exports.name = 'myModule';
module.exports.dependencies = [];
module.exports.factory = function () {
    "use strict";
    
    
};
```

### Hilary Module :: Browser
Creates a new Hilary compatible JavaScript file

Example:

```
? What do you want to create?
>Hilary Module :: Browser
? What is the name of the Hilary scope?
>myScope
? What is the name of your module?
>myModule
```

Produces `/myModule.js`

```JavaScript
/*jslint node: true*/
/*globals Hilary*/
Hilary.scope('myScope').register({
    name: 'myModule',
    dependencies: [],
    factory: function () {
        "use strict";

        
    }
});
```

### Hilary Module :: Cross Platform
Creates a new JavaScript file that is compatible with Hilary in Node and the Browser, and will put the output on Window if Hilary doesn't exist.

Example:

```
? What do you want to create?
>Hilary Module :: Cross Platform
? What is the name of the Hilary scope?
>myScope
? What is the name of your module?
>myModule
```

Produces `/myModule.js`

```JavaScript
/*jslint node: true*/
/*globals Hilary, Window*/
(function (scope) {
    "use strict";

    var definition = {
        name: 'myModule',
        dependencies: [],
        factory: undefined
    };
    
    definition.factory = function () {
        // DEFINITION
    };
    
    if (Window && scope instanceof Window) {
        scope[definition.name] = definition.factory;
    } else if (typeof scope.register === 'function') {
        scope.register(definition);
    } else {
        scope.name = definition.name;
        scope.dependencies = definition.dependencies;
        scope.factory = definition.factory;
    }
    
}((typeof module !== 'undefined' && module.exports) ? module.exports : ((Hilary && Hilary.scope) ? Hilary.scope('myScope') : window)));
```

### Hilary Express Router
Creates a new Express router that leverages Hilary

Example:

```
? What do you want to create?
>Hilary Express Router
? What is the name of the Hilary scope?
>myScope
? What is the name of your module?
>myRouter
```

Produces `/myRouter.js`

```JavaScript
/*jslint node: true*/
module.exports.name = 'myRouter';
// Assumes you registered a router (the equivelant of express().Router())
module.exports.dependencies = ['router'];
module.exports.factory = function (router) {
    "use strict";

    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', { title: 'myRouter' });
    });

    return router;
};
```

### Hilary Gidget Router
Creates a new Gidget router that leverages Hilary

Example:

```
? What do you want to create?
>Hilary Express Router
? What is the name of the Hilary scope?
>myScope
? What is the name of your module?
>myRouter
```

Produces `/myRouter.js`

```JavaScript
/*globals Hilary, console*/
Hilary.scope('myScope').register({
    name: 'myRouter',
    // Assumes you registered GidgetModule, locale and a viewEngine module
    dependencies: ['GidgetModule', 'locale', 'viewEngine'],
    factory: function (GidgetModule, locale, viewEngine) {
        "use strict";

        var $this = new GidgetModule();
        
        $this.get['/'] = function (params) {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body
                }
            });
        };

        return $this;
    }
});
```

## Sub Generators

Available sub generators:

* [hilary:js](#javascript)
* [hilary:grunt](#grunt)
* [hilary:gruntTask](#gruntTask)
* [hilary:html](#html)
* [hilary:json](#json)
* [hilary:md](#markdown)

### JavaScript

Creates a new JavaScript file

Example:

```
yo hilary:js myModule
```

Produces `/myModule.js`

```JavaScript
(function () {
    "use strict";
    
}());
```

### Grunt

Creates a new Grunt file

Example:

```
yo hilary:grunt gruntfile
```

Produces `/gruntfile.js`

```JavaScript
/*jslint node: true*/
/*
This file is the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    "use strict";
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });
    
};
```

### GruntTask

Creates a new Grunt task file

Example:

```
yo hilary:gruntTask myTask
```

Produces `/myTask.js`

```JavaScript
/*jslint node: true*/
module.exports = function (grunt) {
    "use strict";
    
    grunt.registerTask('myTask', '[DESCRITION]', function () {

    });
    
};
```

### HTML

Creates a new HTML file

Example:

```
yo hilary:html myView
```

Produces `/myView.html`

```HTML
<!DOCTYPE html>

<html lang="">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>myView</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>

</body>
</html>
```

### JSON

Creates a new JSON file

Example:

```
yo hilary:json myJSON
```

Produces `/myJSON.json`

```JavaScript
{

}
```

### MarkDown

Creates a new MarkDown file

Example:

```
yo hilary:md myMarkDown
```

Produces `/myMarkDown.md`

```Markdown
myMarkDown
==========

```


