module.exports = function (next, asimov) {

	asimov.use(require('../../../asimov-watcher'));

	asimov.dependencyParser('page', require('../parsers/page'), 'pages');

	asimov.updateHandler(require('../handlers/page'));
	
	next();
};
