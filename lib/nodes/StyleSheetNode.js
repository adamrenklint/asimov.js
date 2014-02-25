/*

  stylesheet node model class

*/

define([

  '../core/FilesystemModel',
  'lodash',
  'path'

], function (FilesystemModel, _, npath) {

  var _super = FilesystemModel.prototype;

  return FilesystemModel.extend({

    'idAttribute': 'url',

    'defaults': {
      'type': 'styleSheet',
      'raw': null,
      'path': null,
      'url': null
    },

    'parseRaw': function () {

      var self = this;
      var attributes = self.attributes;

      attributes.url = attributes.url.replace('.styl', '.css');

      self.set(attributes);
    }
  });
});