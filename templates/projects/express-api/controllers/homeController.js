module.exports.name = 'homeController';
module.exports.dependencies = ['router', 'fs', 'aglio', 'environment'];
module.exports.factory = function (router, fs, aglio, env) {
    'use strict';

    var aglioOptions, readDocIndex;

    aglioOptions = {
        themeTemplate: './views/docs.jade',
        locals: {
            languages: env.get('docs:languages')
        }
    };

    readDocIndex = function (filepath, callback) {
        fs.readFile(filepath, function (err, blueprint) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, blueprint + '');
        });
    };

    /* GET home page. */
    router.get('/', function (req, res, next) {
        readDocIndex('./docs/index.apib', function (err, blueprint) {
            aglio.render(blueprint, aglioOptions, function (err, html, warnings) {
                if (err) {
                    console.log('aglio error:', err);
                    next(err);
                    return;
                }
                if (warnings) {
                    console.log('aglio warning:', warnings);
                }

                res.send(html);
            });
        });
    });

    /* Throw an example error. */
    router.get('/hilary/example/error', function (req, res, next) {
        next('threw example error');
    });

    return router;
};
