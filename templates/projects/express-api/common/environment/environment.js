module.exports.name = 'environment';
module.exports.dependencies = ['nconf'];
module.exports.factory = function (nconf) {
    'use strict';

    var useMemory;

    // NOTE: The order of precedence is top-to-bottom
    nconf
        .env()
        .argv()
        // Storing plain text secrets on the file system is not recommended,
        // nor does the file need to exist. Consider using args, encryption, etc.
        .file('secrets', './common/environment/secrets/secrets.json')
        .file('environment', './common/environment/environment.json');
        // ^^ Note that these are relative to root

    // check to see if the configuration turns memory off (default is true)
    useMemory = nconf.get('storeThisConfigInMemory');
    useMemory = useMemory !== undefined ? useMemory : true;

    if (useMemory) {
        nconf.use('memory');
    }

    return nconf;
};
