/*

  template file update handler class

*/

define([

  './UpdateHandler',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'TemplateHandler',

    'collection': function () {

      var self = this;
      return self.options.templates;
    },

    'forceChange': function (model) {

      var self = this;
      _.defer(function () {

        if (self.filesystem.hasFileExtension(model.attributes.path, 'tmpl')) {
          self.logger.log('force change '+  model.attributes.path);
          model.trigger('force:change', model);
        }
        else {
          model.trigger('change:raw', model);
        }
      });
    },
  });
});