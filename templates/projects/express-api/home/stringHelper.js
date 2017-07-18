module.exports.name = 'home-stringHelper';
module.exports.dependencies = [];
module.exports.factory = () => {
    'use strict';

    return new StringHelper();

    function StringHelper () {
        var self = {
            replaceSingleQuotes: replaceSingleQuotes,
            replaceDoubleQuotes: replaceDoubleQuotes,
            getMethod: getMethod,
            getUrl: getUrl
        };

        function replaceSingleQuotes (input) {
            return input.replace(/(^|[^\\])'/g, "$1\\'");
        }

        function replaceDoubleQuotes (input) {
            return input.replace(/(^|[^\\])"/g, '$1\\"');
        }

        function getMethod (method) {
            if (!method) {
                return 'GET';
            }

            return method.toUpperCase();
        }

        function getUrl (config) {
            var url = config.url;

            if (!url && config.host) {
                url = (config.protocol || 'https') + '://' + config.host + config.path;
            } else if (!url && config.path) {
                url = config.path;
            }

            return url;
        }

        return self;
    }
};
