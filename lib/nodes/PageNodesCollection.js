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

    'ensureErrorPages': function () {

      var self = this;
      var notFoundUrl = '/404';
      var notFoundPage = self.get(notFoundUrl);

      if (!notFoundPage) {

        var path = npath.join(process.cwd(), self.options.frameworkDir, 'pages/404/error.txt');
        var logger = self.logger.wait(self.namespace, 'Loading default 404 Not Found page @ ' + path);
        notFoundPage = new self.model(null, self.options);

        notFoundPage.fetch(path, logger).done(function () {

          var models = _.flatten(_.toArray(arguments));
          self.add(models);
        });
      }

      var errorUrl = '/error';
      var errorPage = self.get(errorUrl);

      if (!errorPage) {

        var path = npath.join(process.cwd(), self.options.frameworkDir, 'pages/error/error.txt');
        var logger = self.logger.wait(self.namespace, 'Loading default 501 Internal Server Error page @ ' + path);
        errorPage = new self.model(null, self.options);

        errorPage.fetch(path, logger).done(function () {

          var models = _.flatten(_.toArray(arguments));
          self.add(models);
        });
      }
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