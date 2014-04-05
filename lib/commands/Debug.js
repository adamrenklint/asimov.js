// A tiny proxy to start in verbose/debug mode

process.env.VERBOSE = true;

var Start = require('./Start');
module.exports = Start;