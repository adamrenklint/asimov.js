var FilesystemModel = require('../core/FilesystemModel');
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemModel.prototype;

module.exports = FilesystemModel.extend({

  'defaults': {

    'type': 'helper',
    'path': null,
    'name': null
  },

  // 'initialize': function () {

  //   var self = this;
  //   _super.initialize.apply(self, arguments);

  //   // if (typeof self.run !== 'function') {
  //   //   throw new Error('Cannot register template helper without callback:' + JSON.stringify(self.attributes));
  //   // }
  // },

  'fetch': function (path, logger) {

    var self = this;
    var deferred = self.deferred();
    var parts = path.split('/');
    var name = parts[parts.length - 1].replace('.js', '').toLowerCase();

    if (name === 'helper') return deferred.resolve().promise();

    self.logger.low(self.namespace, 'Loading ' + self.attributes.type + ' file @ ' + path);

    var requirePath = path.replace(name + '.js', name);

    var Helper = require(npath.relative(__dirname, requirePath));
    var helper;

    try {

      helper = new Helper(_.merge({}, self.options, {
        'path': path,
        'requirePath': requirePath,
        'name': name
      }));
    }
    catch (e) {

      throw new Error('Invalid template helper @ ' + path + ': '+ e);
    }

    self.set({
      'helper': helper,
      'path': path,
      'name': name
    });

    deferred.resolve(self);

    return deferred.promise();
  }
});