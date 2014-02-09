/*
  
  ▲ asimov.js bootstrap

*/

// Setup requirejs
var requirejs = require('requirejs');

module.exports = function (options) {

  options = options || {};
  options.frameworkDir = options.frameworkDir || 'node_modules/asimov-framework';
  options.pkg = require('./package.json');

  requirejs.config({
    'paths': {
      'asimov-core': options.frameworkDir + '/node_modules/asimov-core/lib',
      'vendor/wunderbits.core': options.frameworkDir + '/node_modules/asimov-core/vendor/wunderbits.core'
    }
  });

  // And start the beast
  requirejs([

    options.frameworkDir + '/lib/core/Loader'

  ], function (Loader) {
    
    var instance = new Loader(options);
  });
};