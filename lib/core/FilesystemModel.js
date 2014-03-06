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
      var namespace = self.collection && self.collection.namespace || self.namespace || self.attributes.type;
      var deferred = self.deferred();

      self.assert('defined string', path, 'Cannot fetch data without path');

      if (!self.filesystem.pathExists(path)) {
        throw new Error('Failed to fetch data from disk, path does not exist @ ' + path);
      }

      var raw = self.filesystem.readFile(path);

      var file = {
        'path': path,
        'raw': raw
      };

      self.set(file);

      if (!logger) {
        logger = !self.options.muteLog && self.logger.wait(namespace, 'Loading ' + self.attributes.type + ' @ ' + path);
      }

      logger && logger.nextAndDone();

      return deferred.resolve(self).promise();
    },

    'isHidden': function () {

      var self = this;
      return self.attributes.path.indexOf('/_') > 0;
    }
  });
});