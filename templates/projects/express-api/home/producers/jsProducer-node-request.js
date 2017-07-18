module.exports.name = 'home-producers-jsProducer-node-request';
module.exports.dependencies = ['home-stringHelper'];
module.exports.factory = (stringHelper) => {
    'use strict';

    var BEGIN =     '```node\n',
        TEMPLATE =  'var request = require("request"),\n' +
                    '    options;\n' +
                    '\n' +
                    'options = {{options}};\n' +
                    '\n' +
                    'request(options, function (err, response, body) {\n' +
                    '    if (err) {\n' +
                    '        return console.log(err);\n' +
                    '    }\n' +
                    '\n' +
                    '    console.log(body);\n' +
                    '});',
        END =       '\n```\n\n';

    return new Producer();

    function Producer() {
        var self = {
            produce: produce
        };

        function produce (config, callback) {
            var options = {}, output;

            options.method = stringHelper.getMethod(config.method);
            options.url = stringHelper.getUrl(config);

            if (config.headers) {
                options.headers = config.headers;
            }

            if (config.body) {
                options.body = config.body;
            }

            output = TEMPLATE
                .replace(/{{options}}/, JSON.stringify(options, null, 4));

            callback(null, BEGIN + output + END);
        }

        return self;
    }
};
