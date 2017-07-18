module.exports.name = 'homeController';
module.exports.dependencies = ['router', 'home-docRenderer', 'environment'];
module.exports.factory = function(router, docRenderer, env) {
    'use strict';

    router.get('/', getHandler);
    router.get('/docs/:lang', getHandler);

    function getHandler (req, res, next) {
        var options = env.get('docs') || {};
        options.language = req.params.lang;

        docRenderer.render(options, function (err, rendered) {
            if (err) {
                return next(err);
            }

            res.render('docs', rendered);
        });
    }

    return router;
};
