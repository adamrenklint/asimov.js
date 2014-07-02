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

  'getJSON': function (pageLangCode) {

    var self = this;
    var json = {};
    var models = [];

    self.each(function (model) {

      var parts = model.attributes.path.split('/').pop().split('.');
      var name = parts[0];

      if (parts.length === 2) {
        models.unshift(model);
      }
      else if (parts.length > 2) {
        var langCode = parts[parts.length - 2];

        if (langCode && langCode === pageLangCode) {
          models.push(model);
        }
      }
    });

    models.forEach(function (model) {
      _.each(model.attributes, function (value, key) {
        json[key] = value;
      });
    });

    json.root = "/";

    return json;
  }
});
