module.exports.name = 'producers-goProducer';
module.exports.dependencies = ['stringHelper'];
module.exports.factory = (stringHelper) => {
    'use strict';

    var BEGIN = '```go\n',
        TEMPLATE =  'package main\n' +
                    '\n' +
                    'import (\n' +
                    '  "fmt"\n' +
                    '  "strings"\n' +
                    '  "net/http"\n' +
                    '  "io/ioutil"\n' +
                    ')\n' +
                    '\n' +
                    'func main() {\n' +
                    '\n' +
                    '  url := "{{url}}"\n' +
                    '{{body}}' +
                    '  req, _ := http.NewRequest("{{method}}", url, payload)\n' +
                    '\n' +
                    '{{headers}}\n' +
                    '  res, _ := http.DefaultClient.Do(req)\n' +
                    '  defer res.Body.Close()\n' +
                    '  body, _ := ioutil.ReadAll(res.Body)\n' +
                    '\n' +
                    '  fmt.Println(res)\n' +
                    '  fmt.Println(string(body)) \n' +
                    '}',
        HEADER = '  req.Header.Add("{{key}}", "{{value}}")\n',
        BODY = '  payload := strings.NewReader("{{body}}")\n',
        END = '\n```\n\n';

    return new Producer();

    function Producer() {
        var self = {
            produce: produce
        };

        function produce (config, callback) {
            var output =  TEMPLATE
                .replace(/{{method}}/, stringHelper.getMethod(config.method))
                .replace(/{{url}}/, stringHelper.getUrl(config));

            if (config.headers) {
                output = output.replace(/{{headers}}/, getHeaders(config.headers));
            } else {
                output = output.replace(/{{headers}}/, '');
            }

            if (config.body) {
                output = output.replace(/{{body}}/, getBody(config.body));
            } else {
                output = output.replace(/{{body}}/, '');
            }

            callback(null, BEGIN + output + END);
        }

        function getHeaders(headers) {
            var output = '', key;

            if (!headers) {
                return output;
            }

            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    output += HEADER
                        .replace(/{{key}}/, key)
                        .replace(/{{value}}/, headers[key]);
                }
            }

            return output;
        }

        function getBody(body) {
            var output = '';

            if (!body) {
                return output;
            }

            return BODY.replace(/{{body}}/, stringHelper.replaceDoubleQuotes(body));
        }

        return self;
    }

};
