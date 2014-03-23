/*

  page nodes collection class

  knows how to crawl a directory and populate
  a set of set of page node models

*/

define([

  '../core/FilesystemCollection',
  './PageNode',
  'lodash',
  'path'

], function (FilesystemCollection, PageNode, _, npath) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'filetype': 'page',
    'extension': 'txt',

    'comparator': 'sortablePath',

    'model': PageNode,

    'defaultPages': function (urls) {

      var self = this;
      var count = 0;

      _.each(urls, function (url) {

        var page =  self.get(url);
        if (!page) {

          count++;

          var path = npath.join(process.cwd(), self.options.frameworkDir, 'pages' + url + '/error.txt');
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
});