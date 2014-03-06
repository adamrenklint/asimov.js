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

    'namespace': 'Pages',

    'filetype': 'page',
    'extension': 'txt',

    'model': PageNode,

    'ensureErrorPages': function () {

      var self = this;
      var notFoundUrl = '/404';
      var notFoundPage = self.get(notFoundUrl);

      if (!notFoundPage) {

        var path = npath.join(process.cwd(), self.options.frameworkDir, 'pages/404.txt');
        var logger = self.logger.wait(self.namespace, 'Loading default 404 Not Found page @ ' + path);
        notFoundPage = new self.model(null, self.options);

        notFoundPage.fetch(path, logger).done(function () {

          var models = _.flatten(_.toArray(arguments));
          self.add(models);
        });
      }
    },

    'getChildrenOf': function (url) {

      var self = this;
      self.assert('defined string', url, 'Invalid url');

      var parent = self.get(url);
      self.assert('object', parent, 'Invalid parent page url, doesn\'t exist');

      var children = self.filter(function (model) {

        var _url = model.attributes.url;
        if (url == _url) return false;

        var slashesInParentUrl = url.split('/').length - 1;
        if (url === '/') slashesInParentUrl = 0;
        var slashesInChildUrl = _url.split('/').length - 1;

        if (slashesInChildUrl > (slashesInParentUrl + 1)) return false;

        return _url.indexOf(url) === 0;
      });

      return new self.constructor(children, self.options);
    }
  });
});