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

    'namespace': 'PageNodesCollection',

    'filetype': 'page',
    'extension': 'txt',

    'model': PageNode,

    'ensureErrorPages': function () {

      var self = this;
      var notFoundUrl = '/404';
      var notFoundPage = self.get(notFoundUrl);

      if (!notFoundPage) {

        self.add({
          'raw': '404',
          'title': 'Not Found',
          'template': '404',
          'url': notFoundUrl,
          'path': npath.join(process.cwd(), self.options.frameworkDir, 'pages/404.txt')
        }, self.options);
      }
    }
  });
});

// meta[self.options.localization.defaultLangCode] = {
//     'meta': {
//       'template': '404'
//     }
//   };

//   self.map[notFoundUrl] = {
//     'nodeType': 'page',
//     'url': notFoundUrl,
//     'meta': meta
//   };