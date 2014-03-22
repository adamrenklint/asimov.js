/*

  update handler base class

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'UpdateHandler',

    'forceChange': function (path) {

      var self = this;
      _.defer(function () {
        self.options.watcher.handleChange(path, {}, {}, 'modified');
      });
    },

    'collection': function () {
      throw new Error('UpdateHandler must implement collection generator method');
    },

    'created': function (path) {

      var self = this;
      self.collection().fetch();
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