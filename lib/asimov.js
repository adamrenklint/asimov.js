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

  options.port = 3003;

  args.forEach(function (arg) {
    if (arg.indexOf('--port ') === 0) {
      var port = parseInt(arg.split(' ').pop(), 10);
      if (typeof port === 'number') {
        options.port = port;
      }
    }
  });

  var loaderPath = './core/Loader';
  var Bootstrap = require(loaderPath);
  var bootstrap = new Bootstrap(options);
};

var paths = ['core/Base', 'server/Middleware', 'core/Initializer', 'runner/Test', 'render/TemplateHelper'];

paths.forEach(function (loadPath) {
  var Constructor = require('./' + loadPath);
  var name = loadPath.split('/').pop();
  module.exports[name] = Constructor;
});