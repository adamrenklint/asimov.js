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

], function (Collection, PageNode, _, npath) {

  var _super = Collection.prototype;

  return Collection.extend({

    'namespace': 'PageNodesCollection',

    'filetype': 'page',

    'model': PageNode,

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'shouldReadPath': function (path) {

      var self = this;
      return self.filesystem.hasFileExtension(path, 'txt');
    }
  });
});