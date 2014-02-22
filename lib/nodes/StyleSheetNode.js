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

    'defaults': {
      'type': 'styleSheet',
      'raw': null,
      'path': null,
      'url': null,
      'updatedAt': null,
      'renderedAt': null
    },

    // 'parseRaw': function () {

    //   // var self = this;
    //   // var attributes = self.attributes;

    //   // attributes = self.parseRawMeta(attributes.raw, attributes);
    //   // attributes.updatedAt = new Date();

    //   // self.set(attributes);
    // }
  });
});