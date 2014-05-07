var asimov = require('../../../../index');
var FileModel = require('asimov-collection').FileModel;
var _ = require('lodash');
var npath = require('path');
var _super = FileModel.prototype;
var uncache = require('require-uncache');
var handlebars = require('handlebars');

module.exports = FileModel.extend({

  'namespace': 'pages',

  'defaults': {

    'type': 'helper',
    'path': null,
    'name': null
  },

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

    var helper = require(npath.relative(__dirname, requirePath));

    if (typeof helper !== 'function') {
      asimov.error(['Invalid template helper @ ' + path]);
      return deferred.resolve(self);
    }


    handlebars.registerHelper(name, helper);

    self.set({
      'helper': helper,
      'path': path,
      'name': name
    });

    deferred.resolve(self);

    return deferred.promise();
  }
});
