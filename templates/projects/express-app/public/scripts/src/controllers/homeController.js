Hilary.scope('<%= scope %>').register({
    name: 'homeController',
    dependencies: ['newGidgetModule', 'locale', 'viewEngine'],
    factory: function ($this, locale, viewEngine) {
        'use strict';

        $this.get['/'] = function () {
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
