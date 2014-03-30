/*

  asimov.js bootstrap

loads the framework loader or test runner

*/

var npath = require('path');

var path = __dirname;
var isModule = path.indexOf('node_modules/asimov.js/lib') >= 0;
var frameworkDir = isModule ? 'node_modules/asimov.js/lib' : 'lib';

var port = 3003;
var args = process.argv || [];

args.forEach(function (arg) {
  if (arg.indexOf('--port ') === 0) {
    var _port = parseInt(arg.split(' ').pop(), 10);
    if (typeof _port === 'number') {
      port = _port;
    }
  }
});

module.exports = function (options) {

  options = options || {};
  options.meta = require(npath.join(process.cwd(), 'package.json'));
  options.pkg = require('../package.json');

  options.isModule = isModule;
  options.frameworkDir = frameworkDir;

  options.port = port;

  var loaderPath = './core/Loader';
  var Bootstrap = require(loaderPath);
  var bootstrap = new Bootstrap(options);
};

var paths = ['core/Base', 'server/Middleware', 'core/Initializer', 'render/TemplateHelper'];
if (port !== 3003) paths.push('runner/Test');

paths.forEach(function (loadPath) {
  var Constructor = require('./' + loadPath);
  var name = loadPath.split('/').pop();
  module.exports[name] = Constructor;
});