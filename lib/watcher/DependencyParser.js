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

    'parse': function (target, raw, dependencies) {

      throw new Error('DependencyParser must implement parse(model target, collection dependencies)');
    },

    'add': function (target, path, dependencies) {

      var self = this;

      if (path.indexOf(process.cwd()) < 0) {
        path = npath.join(process.cwd(), path);
      }

      var graph = dependencies.get(path) || [];
      var existing = _.find(graph, function (model) {
        return model.id === target.id;
      });

      if (!existing) {
        self.logger.log('ADDING ' + path);
        graph.push(target);
        dependencies.set(path, graph);
      }
    }
  });
});