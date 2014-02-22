/*

  minimal bootstrap

*/

// Override env flags
process.env.DEBUG = true;
process.env.ENV = 'development';
// process.env.LOG_LEVEL = 'verbose';
// process.env.LOG_LEVEL = 'silent';

var options = {};
options.frameworkDir = 'lib';
// options.baseDir = __dirname;
// options.logVerbose = true;
options.meta = require('./package.json');

// var port = process.env.PORT || 3003;
var asimov = require('./lib/asimov')(options);


// create basic "struct in struct" and test when installed
// ensure basic functionality
// add models and collections, take from backbone
// refactor, change everything that makes sense to models and collections
// start over with the watchers and work back to where I was before