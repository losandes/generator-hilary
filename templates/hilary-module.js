/*jslint node: true*/
/*globals Hilary, Window*/
(function (scope) {
    "use strict";

    var definition = {
        name: '<%= name %>',
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
    
}((typeof module !== 'undefined' && module.exports) ? module.exports : ((Hilary && Hilary.scope) ? Hilary.scope('<%= scope %>') : window)));
