/*

  template helpers collection class

  scans the helpers directories, loads all valid helpers
  and gives them access to the crawled content tree

*/

define([

  '../core/FilesystemCollection',
  './TemplateHelperModel',
  'lodash',
  'path',
  'requirejs'

], function (FilesystemCollection, TemplateHelperModel, _, npath, requirejs) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'namespace': 'Helpers',

    'filetype': 'template helper',
    'extension': 'js',

    'model': TemplateHelperModel,

    'setUrl': function (url) {

      var self = this;
      self.trigger('setUrl', url);
    }
  });
});