// Public interface and bootstrap

var Asimov = require('./lib/Asimov');
var asimov = global.asimov = module.exports = global.asimov || (new Asimov()).publicInterface();

// Export public classes
module.exports.Asimov = Asimov;
module.exports.Base = require('./lib/Base');
module.exports.Sequencer = require('./lib/Sequencer');
module.exports.CommandLineInterface = require('./lib/CommandLineInterface');

module.exports.mixins = {
  'Configurable': require('./lib/mixins/Configurable')
};

module.parent || asimov.start();
