/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader or test runner

*/

var requirejs = require('requirejs');
var uri = requirejs('URIjs');

module.exports = function (options) {

  options = options || {};
  var args = process.argv || [];

  // this needs to work both when in a prod app and the framework pkg is in a subfolder, and when running the framework repo/demo app, when the package is in the root
  options.pkg = require('../package.json');

  // options.relativeDir = uri(__dirname).relativeTo(process.cwd());
  options.frameworkDir = options.frameworkDir || 'node_modules/asimov.js/lib';

  requirejs.config({
    'baseUrl': process.cwd()
  });

  var runnerPath = options.frameworkDir + '/runner/Runner';
  var loaderPath = options.frameworkDir + '/core/Loader';
  var indexOfTestCommand = args.indexOf('--test');
  var shouldRunTests = indexOfTestCommand >= 0;

  if (shouldRunTests) {
    options.filter = args[indexOfTestCommand + 1];
  }

  requirejs([

    shouldRunTests ? runnerPath : loaderPath

  ], function (Bootstrap) {

    var bootstrap = new Bootstrap(options);
  });
};