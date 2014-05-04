var Watcher = require('./lib/Watcher');

module.exports = function (asimov, options) {

	options = options || {};

	var watcher = new Watcher(options);

	asimov.register('dependencyParser', watcher.addParser, 'watcher');
	asimov.register('updateHandler', watcher.addHandler, 'watcher');
};

module.exports.Watcher = Watcher;
