module.exports = [
    require('./home/docRenderer.js'),
    require('./home/homeController.js'),
    require('./home/mdParser.js'),
    require('./home/stringHelper.js'),
    require('./home/producers/curlProducer.js'),
    require('./home/producers/goProducer.js'),
    require('./home/producers/jsProducer-browser-fetch.js'),
    require('./home/producers/jsProducer-node-request.js'),
    require('./legos/Lego.js'),
    require('./legos/legoController.js')
];
