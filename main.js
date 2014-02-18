/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader

*/

// Setup requirejs
var requirejs = require('requirejs');
var uri = require('URIjs');

module.exports = function (options) {

  options = options || {};
  // options.frameworkDir = options.frameworkDir || 'node_modules/asimov-framework';
  options.pkg = require('./package.json');

  requirejs.config({
    'baseUrl': __dirname
  //   'paths': {
  //     'asimov-core': __dirname + '/node_modules/asimov-core/lib',
  //     'vendor/wunderbits.core': __dirname + '/node_modules/asimov-core/vendor/wunderbits.core'
  //   }
  });

// URI("/foo/bar/baz.html")
//   .relativeTo("/foo/bar/world.html");

  requirejs([

    './lib/core/Loader'

  ], function (Loader) {

    var instance = new Loader(options);
  });
};