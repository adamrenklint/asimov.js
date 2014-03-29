/*

  asimov.js bootstrap

loads the framework loader or test runner

*/

module.exports = function (options) {

  options = options || {};
  var args = process.argv || [];

  options.pkg = require('../package.json');
  options.frameworkDir = options.frameworkDir || 'node_modules/asimov.js/lib';

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