'use strict';

var util = require('util'),
    SubGenerator = require('../SubGenerator.js'),
    NamedGenerator;

NamedGenerator = function () {
	SubGenerator.apply(this, arguments);
};

util.inherits(NamedGenerator, SubGenerator);

NamedGenerator.prototype.createNamedItem = function () {
	this.generateTemplateFile(
		'html.html',
		this.name + '.html',
		{ name: this.name }
	);
};

module.exports = NamedGenerator;
