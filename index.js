// Public interface and bootstrap

process.env.PORT = process.env.PORT || 3003;

var Asimov = require('./lib/Asimov');
var asimov = module.exports = (new Asimov()).publicInterface();

// Export public classes
module.exports.Asimov = Asimov;
module.exports.Base = require('./lib/Base');
module.exports.Sequencer = require('./lib/Sequencer');
module.exports.CommandLineInterface = require('./lib/CommandLineInterface');

asimov.use(require('./modules/asimov-pages'));

module.parent || asimov.start();
