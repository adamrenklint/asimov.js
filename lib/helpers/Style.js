var Helper = require('./Helper');
var _super = Helper.prototype;
var StyleSheetNode = require('../nodes/StyleSheetNode');
var npath = require('path');
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name, params) {

    var self = this;
    var collection = self.options.styleSheets;

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

    params.rel = attributes.type.toLowerCase();
    params.type = attributes.contentType;
    params.href = attributes.url;

    return self.html('link', params);
  }
});