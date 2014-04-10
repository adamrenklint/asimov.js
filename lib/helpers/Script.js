var Helper = require('./Helper');
var _super = Helper.prototype;
var ScriptNode = require('../nodes/ScriptNode');
var npath = require('path');
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name) {

    var self = this;
    var options = self.opts(arguments);
    var collection = self.options.scripts;
    var hash = options.hash;

    self.assert('string', name, 'Invalid name in script template helper: ' + name + ' @ ' + self.currentUrl);

    var model = collection.find(function (_model) {
      return _model.attributes.name === name;
    });

    if (!model) {

      model = collection.create({
        'name': name,
        'insertConstructor': hash.construct
      }, self.options);

      self.defer(model.fetch);
    }

    var attributes = model.attributes;

    hash.rel = attributes.type.toLowerCase();
    hash.type = attributes.contentType;
    hash.src = attributes.url;

    return self.html('script', hash);
  }
});