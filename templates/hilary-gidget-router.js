Hilary.scope('<%= scope %>').register({
    name: '<%= name %>',
    dependencies: ['GidgetModule', 'locale', 'viewEngine'],
    factory: function (GidgetModule, locale, viewEngine) {
        'use strict';

        var $this = new GidgetModule();

        $this.get['/'] = function () {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body
                }
            });
        };

        $this.get['/foo/:id'] = function (params) {
            var id = params.splat[0];

            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body + ' ' + id
                }
            });
        };

        return $this;
    }
});
