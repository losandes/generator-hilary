'use strict';

var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    SubGenerator;

SubGenerator = function () {
    yeoman.generators.NamedBase.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, './templates/'));
};

util.inherits(SubGenerator, yeoman.generators.NamedBase);

SubGenerator.prototype.generateTemplateFile = function (templateFile, targetFile, templateData) {
    this.log('You called the hilary subgenerator with the arg ' + this.name);
    if (templateData !== null) {
        this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile), templateData);
    } else {
        this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile));
    }
    this.log(targetFile + ' created.');
};

module.exports = SubGenerator;

///*jslint node: true*/
//"use strict";
//
//var util = require('util'),
//    path = require('path'),
//    yeoman = require('yeoman-generator'),
//    NamedGenerator;
//
//NamedGenerator = function () {
//    yeoman.generators.NamedBase.apply(this, arguments);
//    this.sourceRoot(path.resolve(__dirname, '../templates/'));
//};
//
//util.inherits(NamedGenerator, yeoman.generators.NamedBase);
//
//NamedGenerator.prototype.generateTemplateFile = function (name) {
//    var templateFile = 'hilary-module-node.js',
//        targetFile = name + '.js';
//
//    this.log('You called the subgenerator with the arg ' + name);
//    this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile), { name: name});
//    this.log(targetFile + ' created.');
//};
//
//module.exports = NamedGenerator;
