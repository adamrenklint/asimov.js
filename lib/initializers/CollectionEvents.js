/*

  base initializer class

*/

define([

  '../core/Initializer',
  '../watcher/Watcher',
  '../render/Queue',
  '../render/OutputWriter',
  'lodash'

], function (Initializer, Watcher, Queue, OutputWriter, _) {

  var _super = Initializer.prototype;

  return Initializer.extend({

    'run': function (next) {

      var self = this;
      var options = self.options;

      var watcher = new Watcher(null, options);
      var queue = new Queue(null, options);
      var output = new OutputWriter(options);

      var collections = [
        options.pages,
        options.styleSheets,
        options.scripts
      ];

      _.each(collections, function (collection) {

        self.bindTo(collection, 'change:raw', queue.add);
        self.bindTo(collection, 'change:rendered', output.write);
        self.bindTo(collection, 'change:rendered', watcher.watch);
        self.bindTo(collection, 'remove', output.clear);
      });

      self.bindTo(options.templates, 'change:raw', watcher.watch);

      self.options = options;
      next();
    }
  });
});