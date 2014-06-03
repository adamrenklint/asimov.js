// Public interface and bootstrap

process.env.ROLE = process.env.ROLE || 'master';
var isMaster = process.env.ROLE === 'master';
var Asimov = isMaster ? require('./lib/Master') : require('./lib/Worker');
var asimov = global.asimov = module.exports = global.asimov || (new Asimov()).publicInterface();

// Export public classes
module.exports.Asimov = Asimov;
['Base', 'Master', 'Worker', 'Sequencer', 'CommandLineInterface'].forEach(function (name) {
  module.exports[name] = require('./lib/' + name);
});

module.exports.mixins = {
  'Configurable': require('./lib/mixins/Configurable')
};

module.parent || asimov.start();
