/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader

*/

// Setup requirejs
var requirejs = require('requirejs');
var uri = requirejs('URIjs');

module.exports = function (options) {

  options = options || {};
  options.pkg = require('./package.json');
  options.relativeDir = uri(__dirname).relativeTo(process.cwd());
  options.frameworkDir = __dirname;

  requirejs.config({
    'baseUrl': __dirname
  });

  requirejs([

    './lib/core/Loader'

  ], function (Loader) {

    var instance = new Loader(options);
  });
};