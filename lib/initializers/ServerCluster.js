var Initializer = require('./Initializer');
var Server = require('../server/Server');
var _ = require('lodash');
var _super = Initializer.prototype;

var cluster = require('cluster');
var count = 2 * require('os').cpus().length;

module.exports = Initializer.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.workers = {};
  },

  'spawn': function () {

    var self = this;
    var worker = cluster.fork();
    self.workers[worker.process.pid] = worker;
    return worker;
  },

  'respawn': function (worker) {

    var self = this;
    console.log('worker %s died.', worker.process.pid);
    setTimeout(self.spawn, 100);
    delete self.workers[worker.process.pid];
  },

  'run': function (next) {

    var self = this;

    self.logger.pending(self.namespace, 'Starting server cluster with ' + count + ' workers');

    cluster.on('exit', self.respawn);

    for (var i = 0; i < count; i++) {
      self.spawn();
    }

    next();
  }
});