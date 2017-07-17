// Thanks @donpark: https://github.com/donpark/hbs/blob/master/examples/extend/app.js
module.exports.name = 'hbsBlocks';
module.exports.dependencies = [];
module.exports.singleton = true;
module.exports.factory = function (hbs) {
    'use strict';
    
    var blocks = {};

    hbs.registerHelper('extend', function(name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }

        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    });

    hbs.registerHelper('block', function(name) {
        var val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
    });
};
