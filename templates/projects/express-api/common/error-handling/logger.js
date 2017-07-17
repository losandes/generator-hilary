module.exports.name = 'logger';
module.exports.singleton = true;
module.exports.dependencies = [];
module.exports.factory = {
    // NOTE: This is just a placeholder that wraps console logging in
    // a common interface. You can replace this with bunyan, or other
    // libraries you like
    debug: console.log,
    trace: console.log,
    info: console.log,
    warn: console.log,
    error: console.log,
    fatal: console.log
};
