module.exports.name = 'Lego';
module.exports.singleton = true;
module.exports.dependencies = ['polyn'];
module.exports.factory = function(polyn) {
    'use strict';

    return new polyn.Immutable({
        __blueprintId: 'Lego',
        color: 'string',
        width: 'number',
        length: 'number',
        height: 'number'
    });
};
