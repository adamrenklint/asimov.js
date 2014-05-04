var PageNodesCollection = require('../nodes/PageNodesCollection');
var MetaNode = require('../nodes/MetaNode');
var _ = require('lodash');
var _super = PageNodesCollection.prototype;

module.exports = PageNodesCollection.extend({

  'filetype': 'site data file',

  'model': MetaNode.extend({
    'defaults': {
      'type': 'siteData'
    }
  }),

  'initialize': function (options) {

    var self = this;
    _super.initialize.apply(self, arguments);
  },

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