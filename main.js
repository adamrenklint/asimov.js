/*

  minimal bootstrap

*/

// Override env flags
// process.env.DEBUG = true;
// process.env.ENV = 'development';

var options = {};
module.exports = require('./lib/asimov')(options);