module.exports.name = 'throttleHandler';
module.exports.dependencies = ['environment', 'throttle'];
module.exports.factory = function (env, throttle) {
    'use strict';

    var throttleConfig = env.get('throttle') || {
        rate: 0, // defaults to unlimited
        burst: 0
    };

    // throttle config
    // see https://github.com/thisandagain/micron-throttle for more info
    // Name | Default Type | Description
    // rate | 10 | Number Steady state number of requests/second to allow
    // burst | 25 |	Number If available, the amount of requests to burst to
    // ip | true |  Boolean	Do throttling on a /32 (source IP)
    // xff | false | Boolean Do throttling on a /32 (X-Forwarded-For)
    // username | false | Boolean Do throttling on req.username
    // overrides | null | Object Per "key" overrides
    // tokensTable | n/a | Object Storage engine; must support set/get
    // maxKeys | 10000 | Number If using the built-in storage table, the maximum distinct throttling keys to allow at a time

    return throttle(throttleConfig);

};
