var FilesystemCollection = require('../core/FilesystemCollection');
var PageNode = require('./PageNode');
var _ = require('lodash');
var npath = require('path');

var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'page',
  'extension': 'txt',

  'comparator': 'sortablePath',

  'model': PageNode,

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.aliasIndex = {};
    self.bindTo(self, 'change:alias', 'indexAlias');
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

    return _super.filter.call(self, function (model) {

      if (!options.hidden && model.isHidden()) return false;

      return test(model);
    });
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

    var children = self.filter(function (model) {

      var url = model.attributes.url;
      if (parentUrl == url) return false;

      var slashesInParentUrl = parentUrl.split('/').length - 1;
      if (parentUrl === '/') slashesInParentUrl = 0;
      var slashesInChildUrl = url.split('/').length - 1;

      if (slashesInChildUrl > (slashesInParentUrl + 1)) return false;

      return url.indexOf(parentUrl) === 0;
    }, options);

    return new self.constructor(children, self.options);
  }
});