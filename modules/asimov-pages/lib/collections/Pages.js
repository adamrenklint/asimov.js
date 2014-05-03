var FileCollection = require('asimov-collection').FileCollection;
var _ = require('lodash');
var npath = require('path');
var Page = require('../models/Page');

var _super = FileCollection.prototype;

module.exports = FileCollection.extend({

	'filetype': 'page',
	'extension': 'txt',

	'comparator': 'sortablePath',

	'model': Page,

	'initialize': function () {

		var self = this;
		_super.initialize.apply(self, arguments);

		self.aliasIndex = {};
		self.bindTo(self, 'add change:alias', 'indexAlias');
	},

	'indexAlias': function (model) {

		var self = this;
		var alias = model.attributes.alias;
		if (typeof alias === 'string') alias = [alias];

		alias && alias.forEach(function (url) {
			self.aliasIndex[url] = model.attributes.url;
		});
	},

	'defaultPages': function (urls) {

		var self = this;
		var count = 0;

		_.each(urls, function (url) {

			var page =  self.get(url);
			if (!page) {

				count++;

				var path = npath.join(self.options.frameworkDir, 'lib/pages' + url + '/error.txt');
				// self.logger.pending(self.namespace, 'Loading default 404 Not Found page @ ' + path);
				page = new self.model(null, self.options);

				page.fetch(path).done(function () {

					var models = _.flatten(_.toArray(arguments));
					self.add(models);
				});
			}
		});

		return count;
	},

	'ensureErrorPages': function () {

		var self = this;
		var started = new Date();
		var defaultCount = self.defaultPages(['/404', '/error']);
		defaultCount && self.logger.since(self.namespace, 'Loaded ' + defaultCount + ' default page(s)', started);
	},

	'filter': function (test, options) {

		var self = this;
		options || (options = {});

		self.assert('function', test, 'Cannot filter collection without a function to test each models attributes with');

		var models = _super.filter.call(self, function (model) {

			if (!options.hidden && model.isHidden()) return false;

			return test(model);
		});

		options.comparator = options.sortBy || self.comparator;
		options = _.merge({}, self.options, options);

		options.offset = options.offset || 0;
		options.limit = options.limit || models.length;

		if (options.order === 'DESC' || options.reverse) {
			var comparator = options.comparator;
			options.comparator = function (a, b) {
				if (a.attributes[comparator] > b.attributes[comparator]) return -1;
				if (b.attributes[comparator] > a.attributes[comparator]) return 1;
				return 0;
			};
		}

		var collection = new self.constructor(models, options);

		if (options.offset || options.limit) {
			models = collection.models.slice(options.offset, options.offset + options.limit);
			collection.reset(models);
		}

		return collection;
	},

	'getUrlForAlias': function (url) {

		var self = this;
		return self.aliasIndex[url];
	},

	'childrenOf': function (parentUrl, options) {

		var self = this;
		options || (options = {});

		self.assert('defined string', parentUrl, 'Invalid parentUrl');

		var parent = self.get(parentUrl);
		self.assert('object', parent, 'No parent page exists with url ' + parentUrl);

		return self.filter(function (model) {

			var url = model.attributes.url;
			if (parentUrl == url) return false;

			var slashesInParentUrl = parentUrl.split('/').length - 1;
			if (parentUrl === '/') slashesInParentUrl = 0;
			var slashesInChildUrl = url.split('/').length - 1;

			if (slashesInChildUrl > (slashesInParentUrl + 1)) return false;

			return url.indexOf(parentUrl) === 0;
		}, options);
	}
});
