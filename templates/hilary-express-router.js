module.exports.name = '<%= name %>';
module.exports.dependencies = ['router'];
module.exports.factory = function (router) {
    'use strict';

    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', { title: '<%= name %>' });
    });

    return router;
};
