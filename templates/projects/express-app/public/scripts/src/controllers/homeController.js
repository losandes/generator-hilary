Hilary.scope('<%= scope %>').register({
    name: 'homeController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine'],
    factory: function ($this, GidgetRoute, locale, viewEngine) {
        'use strict';

        var logLifecycle = function (message, params) {
            console.log(message, {
                params: params
            });
        };

        $this.get['/'] = function () {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body
                },
                after: function (vm) {
                    console.log(vm);
                }
            });
        };

        // route with `before` and `after` pipelines, using GidgetRoute
        $this.get['/gidget/example'] = new GidgetRoute({
            routeHandler: function () {
                viewEngine.setVM({
                    template: 't-empty',
                    data: {
                        heading: locale.pages.home.empty.heading,
                        body: '/gidget/example'
                    }
                });
            },
            before: function (params) {
                logLifecycle('before example 1 route', params);
            },
            after: function (params) {
                logLifecycle('after example 1 route', params);
            }
        });

        // route with parameters
        $this.get['/gidget/foos/:foo/bars/:bar'] = function (params) {
            var body = '<p>/gidget/foos/:foo/bars/:bar</p><p>foos: {foo}</p><p>bars: {bar}</p>'
                .replace('{foo}', params.foo)
                .replace('{bar}', params.bar);

            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: body
                }
            });
        };

        return $this;
    }
});
