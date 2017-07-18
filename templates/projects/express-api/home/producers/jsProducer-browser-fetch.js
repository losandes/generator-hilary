module.exports.name = 'producers-jsProducer-browser-fetch';
module.exports.dependencies = ['stringHelper'];
module.exports.factory = (stringHelper) => {
    'use strict';

    var BEGIN =     '```js\n',
        TEMPLATE =  'var options = {{options}};\n' +
                    '\n' +
                    'fetch(\'{{url}}\', options)\n' +
                    '   .then(function (res) {\n' +
                    '        return res.json();\n' +
                    '    }).then(function (res) {\n' +
                    '        console.log(res);\n' +
                    '    });\n',
        END =       '\n```\n\n';

    return new Producer();

    function Producer() {
        var self = {
            produce: produce
        };

        function produce (config, callback) {
            var options = {}, output;

            options.method = stringHelper.getMethod(config.method);
            options.mode = 'cors';

            if (config.headers) {
                options.headers = config.headers;
            }

            if (config.body) {
                options.body = config.body;
            }

            output = TEMPLATE
                .replace(/{{url}}/, stringHelper.getUrl(config))
                .replace(/{{options}}/, JSON.stringify(options, null, 4));

            callback(null, BEGIN + output + END);
        }

        return self;
    }
};
