var npath = require('path');
var path = __dirname;
var cluster = require('cluster');

var isModule = path.indexOf('node_modules/asimov.js/bin') >= 0 || path.indexOf('node_modules/asimov.js/lib') >= 0;
var frameworkDir = path.replace('/bin', '').replace('/lib', '');

module.exports = function (options) {

  options = options || {};
  options.meta = require(npath.join(process.cwd(), 'package.json'));
  options.pkg = require('../package.json');

  options.isModule = isModule;
  options.frameworkDir = frameworkDir;

  var loaderPath = cluster.isMaster ? './core/Loader' : './server/Server';
  var Bootstrap = require(loaderPath);
  var bootstrap = new Bootstrap(options);

  return bootstrap.getExports && bootstrap.getExports();
};

var paths = ['core/Base', 'middleware/Middleware', 'initializers/Initializer', 'helpers/Helper', 'commands/Command'];

if (process.env.ENV !== 'production') {
  paths.push('runner/Test');
}

paths.forEach(function (loadPath) {
  var Constructor = require('./' + loadPath);
  var name = loadPath.split('/').pop();
  module.exports[name] = Constructor;
});