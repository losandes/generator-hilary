module.exports.name = 'environment';
module.exports.dependencies = ['nconf'];
module.exports.factory = function (nconf) {
    'use strict';

    nconf.env().file('./environment/environment.json');

    return nconf;
};
