/*globals Hilary, console*/
Hilary.scope('<%= scope %>').register({
    name: '<%= name %>',
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
