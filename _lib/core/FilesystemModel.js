var Model = require('../core/Model');
var _ = require('lodash');
var npath = require('path');
var _super = Model.prototype;

module.exports = Model.extend({

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

  'fetch': function (path) {

    var self = this;
    path = path || self.attributes.path;
    var deferred = self.deferred();

    self.options.muteLog || self.logger.low(self.namespace, 'Loading ' + self.attributes.type + ' file @ ' + path);

    self.assert('defined string', path, 'Cannot fetch data without path');

    if (!self.filesystem.pathExists(path)) {
      throw new Error('Failed to fetch data from disk, path does not exist @ ' + path);
    }

    var info = self.filesystem.getStats(path);
    var modifiedAt = (new Date(info.mtime));

    // var lastModifiedAt = self.attributes.modifiedAt || self.options.modifiedTracker && self.options.modifiedTracker.data[path] || 0;

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

    return deferred.resolve(self).promise();
  },

  'isHidden': function () {

    var self = this;
    if (self.attributes.url === '/') return false;
    return self.attributes.path.indexOf('/_') > 0 || !self.attributes.position;
  },

  'isPage': function () {

    return this.attributes.type === 'page';
  },

  'getOutputPath': function () {

    var self = this;
    var path = self.attributes.url;
    if (self.isPage()) {
      path = (path + '/index.html').replace('//', '/');
    }

    return self.options.outputPath + path;
  }
});