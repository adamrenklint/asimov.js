module.exports = function (next, asimov) {

	asimov.use(require('../../../asimov-watcher'));

	asimov.dependencyParser('page', require('../parsers/page'));
	//...

	asimov.updateHandler(require('../handlers/page'));
	//...

	next();
};
