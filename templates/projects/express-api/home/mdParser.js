module.exports.name = 'home-mdParser';
module.exports.dependencies = [
    'logger',
    'home-producers-curlProducer',
    'home-producers-goProducer',
    'home-producers-jsProducer-node-request',
    'home-producers-jsProducer-browser-fetch'
];
module.exports.factory = (logger, curlProducer, goProducer, nodeRequestProducer, browserFetchProducer) => {
    'use strict';

    var IDX_START_HANDLE = '```endpoint',
        IDX_END_HANDLE = '```',
        IDX_START_OFFSET = IDX_START_HANDLE.length,
        IDX_END_OFFSET = IDX_END_HANDLE.length - 1;

    return {
        parse: parse
    };

    function parse (md, callback) {
        var idxStart,
            idxEnd,
            json,
            makeHandler,
            examples;

        md = md + '';   // stringify the buffer
        idxStart = md.indexOf(IDX_START_HANDLE);

        if (idxStart === -1) {
            // there is nothing to replace
            return callback(null, md);
        }

        makeHandler = function (name) {
            return function (err, markdown) {
                if (err) {
                    logger.warn({
                        message: 'Failed to parse using the ' + name + ' producer',
                        error: err
                    });
                    return;
                }

                examples += markdown;
            };
        };

        while (idxStart > -1) {
            try {
                examples = '';
                idxStart = idxStart + IDX_START_OFFSET;
                idxEnd = md.indexOf(IDX_END_HANDLE, idxStart);
                json = JSON.parse(md.substring(idxStart, idxEnd));
                curlProducer.produce(json, makeHandler('curl'));
                nodeRequestProducer.produce(json, makeHandler('node-request'));
                browserFetchProducer.produce(json, makeHandler('browser-fetch'));
                goProducer.produce(json, makeHandler('go'));

                md = md.substring(0, idxStart - 11) + examples + md.substring(idxEnd + 3);
                idxStart = md.indexOf(IDX_START_HANDLE, (idxEnd + IDX_END_OFFSET));
            } catch (e) {
                idxStart = -1;
                return callback(e);
            }
        }

        callback(null, md);
    }
};
