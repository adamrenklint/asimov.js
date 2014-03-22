/*

  page file update handler base class

*/

define([

  './UpdateHandler',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'PageHandler',

    'created': function (path) {

      var self = this;
      self.options.pages.fetch();
    },

    'modified': function (path, graph) {

      var self = this;

      _.each(graph, function (model) {

        var modelPath = model.attributes.path;

        if (modelPath.indexOf(path) >= 0) {
          model.fetch();
        }
        else {
          _.defer(function () {
            self.forceChange(modelPath);
          });
        }
      });
    },

    'deleted': function (path, graph) {

      var self = this;

      _.each(graph, function (model) {

        var modelPath = model.attributes.path;

        if (modelPath.indexOf(path) >= 0) {
          model.destroy();
        }
        else {
          _.defer(function () {
            self.forceChange(modelPath);
          });
        }
      });
    }
  });
});