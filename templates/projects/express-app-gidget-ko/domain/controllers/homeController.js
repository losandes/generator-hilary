module.exports.name = 'homeController';
module.exports.dependencies = ['router'];
module.exports.factory = function (router) {
    'use strict';

    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', { title: '<%= projectName %>' });
    });

    /* Throw an example error. */
    router.get('/hilary/example/error', function (req, res, next) {
        next(new Error('threw example error'));
    });

    return router;
};
