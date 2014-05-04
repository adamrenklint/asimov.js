var FileModel = require('asimov-collection').FileModel;
var _ = require('lodash');
var npath = require('path');
var _super = FileModel.prototype;
var uncache = require('require-uncache');

module.exports = FileModel.extend({

  'namespace': 'pages',
  
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
    path = path || self.attributes.path;
    var deferred = self.deferred();
    var parts = path.split('/');
    var name = parts[parts.length - 1].replace('.js', '');
    name = name[0].toLowerCase() + name.substr(1);

    if (name === 'helper') return deferred.resolve().promise();

    self.logger.low(self.namespace, 'Loading ' + self.attributes.type + ' file @ ' + path);

    var requirePath = path.replace(name + '.js', name);

    if (self.attributes.helper) {
      uncache(requirePath);
    }

    var Helper = require(npath.relative(__dirname, requirePath));
    var helper;

    try {

      helper = new Helper(_.merge({}, self.options, {
        'path': path,
        'requirePath': requirePath,
        'name': name,
        'model': self
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
