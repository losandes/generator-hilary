module.exports.name = 'docRenderer';
module.exports.singleton = true;
module.exports.dependencies = ['fs', 'async', 'marked', 'highlight.js', 'environment'];
module.exports.factory = function(fs, async, marked, highlight, env) {
    'use strict';

    var readDocs, makeReader, render, rendered, projectName;

    projectName = env.get('projectName');

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

    render = function(options, next) {
        var tasks = [];

        if (rendered) {
            // we already rendered the documentation, keep using it
            return next(null, rendered);
        }

        options = options || {};

        tasks.push(readDocs);
        tasks.push(function (markdown, callback) {
            marked(markdown, callback);
        });
        tasks.push(function (html, callback) {
            rendered = {
                title: projectName,
                content: html,
                language: options.language || 'any',
                languages: JSON.stringify(options.languages),
                useHeadingAlerts: options.useHeadingAlerts !== false
            };

            callback(null, rendered);
        });

        async.waterfall(tasks, next);
    };

    return {
        render: render
    };
};
