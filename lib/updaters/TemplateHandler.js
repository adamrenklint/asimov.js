var UpdateHandler = require('./UpdateHandler');
var _ = require('lodash');
var _super = UpdateHandler.prototype;

module.exports = UpdateHandler.extend({

  'namespace': 'TemplateHandler',

  'collection': function () {

    var self = this;
    return self.options.templates;
  },

  'forceChange': function (model) {

    var self = this;
    _.defer(function () {

      if (self.filesystem.hasFileExtension(model.attributes.path, 'tmpl')) {
        model.trigger('force:change', model);
      }
      else {
        model.trigger('change:raw', model);
      }
    });
  },
});