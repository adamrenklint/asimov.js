/*

  asimov.js bootstrap

loads the framework loader or test runner

*/

var npath = require('path');

var path = __dirname;
var isModule = path.indexOf('node_modules/asimov.js/lib/') >= 0;
var frameworkDir = isModule ? 'node_modules/asimov.js/lib' : 'lib';

module.exports = function (options) {

  options = options || {};
  var args = process.argv || [];

  options.meta = require(npath.join(process.cwd(), 'package.json'));
  options.pkg = require('../package.json');

  options.isModule = isModule;
  options.frameworkDir = frameworkDir;

  var runnerPath = './runner/Runner';
  var loaderPath = './core/Loader';
  var indexOfTestCommand = args.indexOf('--test');
  var shouldRunTests = indexOfTestCommand >= 0;

  if (shouldRunTests) {
    options.filter = args[indexOfTestCommand + 1];
  }

  var Bootstrap = require(shouldRunTests ? runnerPath : loaderPath);
  var bootstrap = new Bootstrap(options);
};

var paths = ['core/Base', 'server/Middleware', 'core/Initializer', 'runner/Test', 'render/TemplateHelper'];

paths.forEach(function (loadPath) {
  var Constructor = require('./' + loadPath);
  var name = loadPath.split('/').pop();
  module.exports[name] = Constructor;
});