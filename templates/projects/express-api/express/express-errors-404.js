module.exports.name = 'express-errors-404';
module.exports.singleton = true;
module.exports.dependencies = [];
module.exports.factory = function (req, res, next) {
    'use strict';

    res.status(404).send({
        status: 404
    });
};
