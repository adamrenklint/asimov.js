var Watcher = require('./lib/Watcher');

module.exports = function (asimov, options) {

	options = options || {};

	var watcher = new Watcher(options);

	asimov.register('dependencyParser', watcher.addParser);
	asimov.register('updateHandler', watcher.addHandler);
};

module.exports.Watcher = Watcher;
