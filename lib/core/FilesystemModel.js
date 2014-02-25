/*

  filesystem model class

*/

define([

  '../core/Model',
  'lodash',
  'path'

], function (Model, _, npath) {

  var _super = Model.prototype;

  return Model.extend({

    'idAttribute': 'path',

    'defaults': {

      'type': 'file',
      'path': null
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.on('change:raw', self.parseRaw);
      self.attributes.raw && self.parseRaw();
    },

    'parseRaw': function () {},

    'fetch': function (path, logger) {

      var self = this;
      path = path || self.attributes.path;

      var deferred = self.deferred();
      var raw = self.filesystem.readFile(path);

      var file = {
        'path': path,
        'raw': raw
      };

      self.set(file);

      logger.nextAndDone();

      return deferred.resolve(self).promise();
    }
  });
});