// A tiny proxy to start in verbose/debug mode

process.env.VERBOSE = true;

module.exports = require('./start');
