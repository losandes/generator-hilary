module.exports.name = 'homeController';
module.exports.dependencies = ['router', 'fs', 'async', 'marked', 'highlight.js', 'environment'];
module.exports.factory = function(router, fs, async, marked, highlight, env) {
    'use strict';

    var readDocs, makeReader, getHandler;

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function(code, lang, callback) {
            var content = highlight.highlightAuto(code).value;
            callback(null, content);
        }
    });

    makeReader = function(filepath) {
        return function(callback) {
            fs.readFile(filepath, function(err, markdown) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, markdown + '');
            });
        };
    };

    readDocs = function(callback) {
        var files = env.get('docs:files'),
            fileReaders = [],
            i;

        for (i = 0; i < files.length; i += 1) {
            fileReaders.push(makeReader(files[i]));
        }

        async.parallel(fileReaders, function(err, result) {
            if (err) {
                callback(err);
                return;
            }

            var markdown = '',
                i;

            for (i = 0; i < result.length; i += 1) {
                markdown += result[i];
            }

            callback(null, markdown);
        });
    };

    getHandler = function(req, res, next) {
        readDocs(function(err, markdown) {
            if (err) {
                next(err);
                return;
            }

            marked(markdown, function (err, html) {
                if (err) {
                    next(err);
                    return;
                }

                var docOptions = env.get('docs') || {};

                res.render('docs', {
                    title: '<%= projectName %>',
                    content: html,
                    language: req.params.lang || 'any',
                    languages: JSON.stringify(docOptions.languages),
                    useHeadingAlerts: docOptions.useHeadingAlerts !== false
                });
            });
        });
    };

    /* GET home page. */
    router.get('/', getHandler);
    router.get('/docs/:lang', getHandler);

    return router;
};
