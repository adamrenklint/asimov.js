var Base = require('../core/Base');
var _ = require('lodash');
var _super = Base.prototype;

module.exports = Base.extend({

  'namespace': 'UpdateHandler',

  'before': function () { return true; },

  'forceChange': function (model) {

    var self = this;
    _.defer(function () {
      model.trigger('change:raw', model);
    });
  },

  'collection': function () {
    throw new Error('UpdateHandler must implement collection generator method');
  },

  'created': function (path) {

    var self = this;
    if (self.before(path)) {
      var collection = self.collection();
      collection && collection.fetch();
    }
  },

  'modified': function (path, graph) {

    var self = this;

    if (self.before(path, graph)) {
      _.each(graph, function (model) {

        var modelPath = model.attributes.path;

        if (modelPath.indexOf(path) >= 0) {
          model.fetch();
        }
        else {
          self.forceChange(model);
        }
      });
    }
  },

  'deleted': function (path, graph) {

    var self = this;
    if (self.before(path, graph)) {
      _.each(graph, function (model) {

        var modelPath = model.attributes.path;

        if (modelPath.indexOf(path) >= 0) {
          model.destroy();
        }
        else {
          self.forceChange(model);
        }
      });
    }
  }
});