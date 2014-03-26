/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader or test runner

*/

// var requirejs = require('requirejs');

module.exports = function (options) {

  options = options || {};
  var args = process.argv || [];

  options.pkg = require('../package.json');
  options.logVerbose = process.env.VERBOSE || false;
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