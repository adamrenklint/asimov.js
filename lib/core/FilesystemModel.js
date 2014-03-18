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

    'cacheRaw': true,

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

      self.assert('defined string', path, 'Cannot fetch data without path');

      if (!self.filesystem.pathExists(path)) {
        throw new Error('Failed to fetch data from disk, path does not exist @ ' + path);
      }

      var info = self.filesystem.getStats(path);
      var modifiedAt = (new Date(info.mtime));

      var lastModifiedAt = self.attributes.modifiedAt || self.options.modifiedTracker && self.options.modifiedTracker.data[path] || 0;

      var file = {
        'path': path
      };

      // if (!self.cacheRaw || !lastModifiedAt || lastModifiedAt && modifiedAt > lastModifiedAt) {

        file.raw = self.filesystem.readFile(path);
        file.modifiedAt = modifiedAt;

        // self.logger.log('loading:' + path);

        self.mediator.trigger('saveModifiedAt', path, modifiedAt);
        self.set(file);
      // }
      // else {
      //   self.attributes = _.merge(self.attributes, file);
      // }

      self.log(logger, path);

      return deferred.resolve(self).promise();
    },

    'log': function (logger, path) {

      var self = this;
      var namespace = self.collection && self.collection.namespace || self.namespace || self.attributes.type;

      if (!logger) {
        logger = !self.options.muteLog && self.logger.wait(namespace, 'Loading ' + self.attributes.type + ' @ ' + path);
      }

      logger && logger.nextAndDone();
    },

    'isHidden': function () {

      var self = this;
      return self.attributes.path.indexOf('/_') > 0 || !self.attributes.position;
    }
  });
});