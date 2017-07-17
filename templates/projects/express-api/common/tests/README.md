# Tests
This project uses [vows](http://vowsjs.org) for the developer/unit tests, along with [assert](http://vowsjs.org/#-assertions), for the assertions.

## Test Locations & Patterns
Tests are located with the code they are testing, and are nested in folders, named `tests`. To run the tests:

```
grunt test
```

The following convention is used to locate tests:

```
./**/*vows.js
```

So any file ending in **vows.js** will be executed by the test runner.

##### Ignored Folders
The following folders are ignored:

* common/build-tasks
* node_modules
* public
* views

## Test Composition
A module, `testComposition` exists to support integration testing and to make testing module dependencies easier. To use this, require _/common/tests/testComposition.js_, and use a [waterfall](https://caolan.github.io/async/docs.html#waterfall) pattern to register and run your tests, with `compose`.

> Note it may be necessary to register other modules in _testComposition.js_, as you add new libraries to your app.

The following example shows a test, _error-handling-vows.js_, that resides in _/common/error-handling/tests_.

```JavaScript
// Require testComposition
var testComposition = require('../../tests/testComposition.js');

// Compose the dependency graph
testComposition.compose([
    // Register the specifications / tests
    function (scope, next) {
        scope.register(require('./ExceptionHandler-spec.js'));
        next(null, scope);
    }
], function (err, scope) {
    // Resolve the specifications and run the tests
    scope.resolve('ExceptionHandler-spec').run();
});
```
