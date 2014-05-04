var Pages = require('./Pages');
var MetaNode = require('../models/MetaNode');
var _ = require('lodash');
var _super = Pages.prototype;

module.exports = Pages.extend({

  'filetype': 'site data file',

  'model': MetaNode.extend({
    'defaults': {
      'type': 'siteData'
    }
  }),

  'getJSON': function () {

    var self = this;
    var json = {};

    self.each(function (model) {
      _.each(model.attributes, function (value, key) {
        json[key] = value;
      });
    });

    json.root = "/";

    return json;
  }
});
