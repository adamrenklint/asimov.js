/*

  minimal bootstrap

*/

// Override env flags
// process.env.DEBUG = true;
// process.env.ENV = 'development';

var options = {};
options.frameworkDir = 'lib';
// options.baseDir = __dirname;
options.logVerbose = process.env.VERBOSE || false;
options.meta = require('./package.json');

// var port = process.env.PORT || 3003;
var asimov = require('./lib/asimov')(options);