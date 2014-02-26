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
    }
  });
});