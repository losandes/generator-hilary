module.exports.name = 'corsOptions';
module.exports.dependencies = ['environment'];
module.exports.factory = function (env) {
    'use strict';

    const options = Object.assign({}, env.get('CORS'));

    return {
        mode: options.mode || 'off',
        originWhiteList: options.originWhiteList,
        allowCredentials: options.allowCredentials,
        allowMethods: options.allowMethods,
        allowHeaders: options.allowHeaders,
        exposeHeaders: options.exposeHeaders,
        cacheDuration: options.cacheDuration,
        denialMessage: options.denialMessage || '',
        areValid: () => {
            // TODO
            return true;
        },
        validationErrors: () => {
            // TODO
            return 'The CORS options are invalid. See the README in the environment folder for more information.';
        }
    };
};
