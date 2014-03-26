/*

  minimal bootstrap

*/

// Override env flags
// process.env.DEBUG = true;
// process.env.ENV = 'development';

var options = {};
options.frameworkDir = 'lib';
options.meta = require('./package.json');

var asimov = require('./lib/asimov')(options);