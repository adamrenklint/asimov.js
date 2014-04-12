var UpdateHandler = require('./UpdateHandler');
var _super = UpdateHandler.prototype;
var _ = require('lodash');

module.exports = UpdateHandler.extend({

  'namespace': 'SiteDataHandler',

  'collection': function () {

    var self = this;
    return self.options.siteData;
  },

  'forceChange': function (model) {

    var self = this;
    _.defer(function () {
      model.trigger('change:raw', model);
    });
  }
});