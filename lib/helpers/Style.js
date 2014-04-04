var Helper = require('./Helper');
var _super = Helper.prototype;
var StyleSheetNode = require('../nodes/StyleSheetNode');
var npath = require('path');
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name) {

    var self = this;
    var options = self.opts(arguments);
    var collection = self.options.styleSheets;
    var hash = options.hash;

    var model = collection.find(function (_model) {
      return _model.attributes.name === name;
    });

    if (!model) {

      model = collection.create({
        'name': name
      }, self.options);

      self.defer(model.fetch);
    }

    var attributes = model.attributes;

    hash.rel = attributes.type.toLowerCase();
    hash.type = attributes.contentType;
    hash.href = attributes.url;

    return self.html('link', hash);
  }
});