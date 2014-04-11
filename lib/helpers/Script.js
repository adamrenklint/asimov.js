var Helper = require('./Helper');
var _super = Helper.prototype;
var ScriptNode = require('../nodes/ScriptNode');
var npath = require('path');
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name, params) {

    var self = this;
    var collection = self.scripts;

    if (typeof name !== 'string') {
      params = name;
      name = params.name;
    }

    self.assert('string', name, 'Invalid name in script template helper: ' + name + ' @ ' + self.currentUrl);

    var model = collection.findWhere({
      'name': name
    });

    if (!model) {

      model = collection.create({
        'name': name,
        'insertConstructor': params.construct
      }, self.options);

      self.defer(model.fetch);
    }

    var attributes = model.attributes;

    params.rel = attributes.type.toLowerCase();
    params.type = attributes.contentType;
    params.src = attributes.url;

    return self.html('script', params);
  }
});