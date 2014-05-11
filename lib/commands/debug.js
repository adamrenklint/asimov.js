// A tiny proxy to start in verbose/debug mode

process.env.VERBOSE = true;
process.env.CRASH = true;

module.exports = require('./start');
