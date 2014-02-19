/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader

*/

// Setup requirejs
var requirejs = require('requirejs');

module.exports = function (options) {

  options = options || {};
  options.pkg = require('./package.json');

  requirejs.config({
    'baseUrl': __dirname
  });

  requirejs([

    './lib/core/Loader'

  ], function (Loader) {

    var instance = new Loader(options);
  });
};