Hilary.scope('<%= scope %>').register({
    name: 'homeController',
    dependencies: ['newGidgetModule', 'locale', 'viewEngine'],
    factory: function ($this, locale, viewEngine) {
        'use strict';

        $this.get['/'] = function () {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.heading,
                    body: locale.pages.home.body,
                    nav: locale.nav
                }
            });
        };

        $this.post['/error'] = function (err, req) {
            var data;

            if (req.payload.status === 403) {
                data = locale.pages.errors.e403;
            } else if (req.payload.status === 404) {
                data = locale.pages.errors.e404;
            } else {
                data = locale.pages.errors.e500;
            }

            data.body = data.body.replace(/{{path}}/, req.payload.uri.source);
            data.nav = locale.nav;

            viewEngine.setVM({
                template: 't-error',
                data: data
            });
        };

        return $this;
    }
});
