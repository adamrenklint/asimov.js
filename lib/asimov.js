/*

  asimov.js bootstrap

  sets up requirejs and some configuration defaults
  then loads the framework loader

*/

var requirejs = require('requirejs');
var uri = requirejs('URIjs');

module.exports = function (options) {

  options = options || {};

  // this needs to work both when in a prod app and the framework pkg is in a subfolder, and when running the framework repo/demo app, when the package is in the root
  options.pkg = require('../package.json');

  // options.relativeDir = uri(__dirname).relativeTo(process.cwd());
  options.frameworkDir = options.frameworkDir || 'node_modules/asimov/lib';

  requirejs.config({
    'baseUrl': process.cwd()
  });

  requirejs([

    options.frameworkDir + '/core/Loader'

  ], function (Loader) {

    var instance = new Loader(options);
  });
};