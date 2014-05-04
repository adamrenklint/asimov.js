var Initializer = require('./Initializer');
var Watcher = require('../watcher/Watcher');
var Queue = require('../render/Queue');
var OutputWriter = require('../render/OutputWriter');
var _ = require('lodash');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

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

      self.bindTo(collection, 'add change:raw forced:change', queue.add);
      self.bindTo(collection, 'change:rendered', output.write);
      self.bindTo(collection, 'change:rendered', watcher.watch);
      self.bindTo(collection, 'remove', output.clear);
    });

    self.bindTo(options.templates, 'add change:raw', watcher.watch);

    self.options = options;
    next();
  }
});