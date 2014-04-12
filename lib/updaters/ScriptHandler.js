var UpdateHandler = require('./UpdateHandler');
var _ = require('lodash');

module.exports = UpdateHandler.extend({

  'namespace': 'ScriptHandler',

  'collection': function () {

    var self = this;
    return false;
  },

  // 'before': function (path, graph) {

  //   var self = this;
  //   console.log('before', path)
  // }

  // 'created': function (path) {

  //   var self = this;
  //   var collection = self.collection();
  //   collection && collection.fetch();
  // },

  // 'modified': function (path, graph) {

  //   var self = this;

  //   _.each(graph, function (model) {

  //     var modelPath = model.attributes.path;

  //     if (modelPath.indexOf(path) >= 0) {
  //       model.fetch();
  //     }
  //     else {
  //       self.forceChange(model);
  //     }
  //   });
  // },

  // 'deleted': function (path, graph) {

  //   var self = this;

  //   _.each(graph, function (model) {

  //     var modelPath = model.attributes.path;

  //     if (modelPath.indexOf(path) >= 0) {
  //       model.destroy();
  //     }
  //     else {
  //       self.forceChange(model);
  //     }
  //   });
  // }
  // }
});