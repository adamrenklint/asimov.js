function registerPathSetter (asimov, type) {

	var name = type + 'Path';

	asimov.config.paths = asimov.config.paths || {};
	asimov.config.paths[type] = asimov.config.paths[type] || [];

	asimov.register(name, function (path, namespace) {
		namespace = namespace || 'pages';
		asimov.logPending(namespace, 'Adding path for asimov.' + type + ' @ ' + path);
		asimov.config.paths[type].push(path);
	});
}

module.exports = function (next, asimov) {

	['pages', 'templates', 'helpers', 'siteData'].forEach(function (type) {
		registerPathSetter(asimov, type);
	});

	next();
};
