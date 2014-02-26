/*

  dependency parser base class

*/

define([

  '../core/Base',
  'lodash',
  'path'

], function (Base, _, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'DependencyParser',

    'parse': function (model, raw, dependencies) {

      throw new Error('DependencyParser must implement parse(model target, collection dependencies)');
    },

    'add': function (model, path, dependencies) {

      var self = this;

      self.assert('object', model.attributes, 'Cannot add dependencies without a valid model');

      if (path.indexOf(process.cwd()) < 0) {
        path = npath.join(process.cwd(), path);
      }

      var graph = dependencies.get(path) || [];
      var existing = _.find(graph, function (node) {
        return node.id === model.id;
      });

      if (!existing) {
        graph.push(model);
        dependencies.set(path, graph);
      }
    }
  });
});