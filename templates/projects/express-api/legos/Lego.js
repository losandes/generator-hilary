module.exports.name = 'Lego';
module.exports.dependencies = ['polyn { Immutable }'];
module.exports.factory = function(Immutable) {
    'use strict';

    return new Immutable({
        __blueprintId: 'Lego',
        color: 'string',
        width: 'number',
        length: 'number',
        height: 'number'
    });
};
