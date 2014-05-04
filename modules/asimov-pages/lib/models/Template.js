var FileModel = require('asimov-collection').FileModel;
var _ = require('lodash');
var npath = require('path');
var handlebars = require('handlebars');
var _super = FileModel.prototype;

module.exports = FileModel.extend({

	'idAttribute': 'name',

	'cacheRaw': false,

	'defaults': function () {

		var self = this;

		return {
			'type': 'template',
			'name': null,
			'path': null,
			'raw': null,
			'compiled': null
		};
	},

	'parseRaw': function () {

		var self = this;
		var attributes = self.attributes;

		attributes.name = self.getName(attributes.path);

		try {

			attributes.compiled = handlebars.compile(attributes.raw);
		}
		catch (e) {

			throw new Error('Invalid template @ ' + attributes.path);
		}

		self.set(attributes);
	},

	'getName': function (path) {

		var self = this;

		_.each(self.options.paths.templates, function (templatePath) {
			path = path.replace(templatePath + '/', '').replace('.tmpl', '');
		});

		return path;
	}
});
