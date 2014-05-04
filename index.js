// Public interface and bootstrap

process.env.PORT = process.env.PORT || 3003;

var Asimov = require('./lib/Asimov');
var asimov = module.exports = (new Asimov()).publicInterface();

asimov.use(require('./modules/asimov-pages'));

// Export public classes
exports.Asimov = Asimov;
exports.Base = require('./lib/Base');
exports.CommandLineInterface = require('./lib/CommandLineInterface');

module.parent || asimov.start();
