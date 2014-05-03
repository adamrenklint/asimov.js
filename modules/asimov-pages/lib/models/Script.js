var FileModel = require('asimov-collection').FileModel;
var _super = FileModel.prototype;
var _ = require('lodash');
var npath = require('path');

module.exports = FileModel.extend({

	'idAttribute': 'url',

	'defaults': {
		'type': 'script',
		'contentType': 'text/javascript',
		'name': null,
		'raw': null,
		'path': null,
		'url': null,
		'bundle': false,
		'classId': null
	},

	'initialize': function () {

		var self = this;
		_super.initialize.apply(self, arguments);

		self.bindTo(self, 'change:name', 'parseName');
		self.attributes.name && self.parseName();
	},

	'parseName': function () {

		var self = this;
		var attributes = self.attributes;

		var name = attributes.name;
		name = self.filesystem.hasFileExtension(name, 'js') ? name : name + '.js';

		attributes.path = self.filesystem.findFirstMatch(name, self.options.paths.scripts);

		self.assert('string', attributes.path, 'Invalid script node path @ ' + attributes.name);

		if (attributes.path.indexOf(process.cwd()) < 0) {
			attributes.path = npath.join(process.cwd(), attributes.path);
		}

		attributes.url = attributes.path.replace(process.cwd(), '');
		attributes.classId = attributes.name.replace(/\//g, '_');

		self.set(attributes);
	}
});
