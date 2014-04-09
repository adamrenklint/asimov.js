var Initializer = require('./Initializer');
var Server = require('../server/Server');
var _ = require('lodash');
var _super = Initializer.prototype;

var cluster = require('cluster');
var count = require('os').cpus().length;

function numberWithCommas (x) {
  return (x || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = Initializer.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.workers = {};
    self.requestCounts = {};
    self.totalRequestCount = 0;

    self.bindTo(self.options.pages, 'change:rendered', 'transmitPageChange');
  },

  'transmitPageChange': function (keys, model) {

    var self = this;
    model = keys.attributes ? keys : model;
    var data = {};

    self.options.attributes.middleware.page.forEach(function (attr) {
      data[attr] = model.attributes[attr] || null;
    });

    _.each(self.workers, function (worker, pid) {
      worker.send(data);
    });
  },

  'onMessage': function (data) {

    var self = this;
    var timeout = self.options.server.workerLogInterval;
    var limit = 60 / timeout;

    var counts = self.requestCounts[data.pid] || [];
    counts.push(data.requestCount || 0);
    counts = _.last(counts, limit);
    self.requestCounts[data.pid] = counts;

    self.totalRequestCount += data.requestCount || 0;
  },

  'spawn': function () {

    var self = this;
    var worker = cluster.fork();
    self.workers[worker.process.pid] = worker;

    worker.on('message', self.onMessage);

    // self.options.pages.on('change:rendered', function (page) {
    //   var attributes = page.attributes;
    //   worker.send({
    //     'title': attributes.title
    //   });
    // });
    // console.log(!!);
    // worker.send()
    return worker;
  },

  'respawn': function (worker) {

    var self = this;
    worker.removeAllListeners();

    self.logger.pending(self.namespace, 'Worker process ' + worker.process.pid + ' died, respawning');

    setTimeout(self.spawn, 100);
    delete self.workers[worker.process.pid];
  },

  'logRunning': function () {

    var self = this;
    var timeout = self.options.server.logDelay;
    var total = 0;

    _.each(self.workers, function (worker, pid) {
      _.each(self.requestCounts[pid], function (count) {
        total += count;
      });
    });

    var now = (new Date()).valueOf();
    var delta = (now - self.started) / 1000;
    var days = Math.floor(delta / 86400);
    var hours = Math.floor(delta / 3600) % 24;
    var minutes = Math.floor(delta / 60) % 60;
    var seconds = Math.round(delta % 60);

    var time = '';
    days && (time += days + 'd ');
    hours && (time += hours + 'h ');
    minutes && (time += minutes + 'm ');
    seconds && (time += seconds + 's ');

    self.logger.log(self.namespace, 'Running ' + time.trim() + ', received ' + numberWithCommas(self.totalRequestCount) + ' requests, throughput ' + numberWithCommas(total) + ' requests per minute');

    setTimeout(self.logRunning, timeout * 1000);
  },

  'run': function (next) {

    var self = this;
    var timeout = self.options.server.logDelay;
    self.started = new Date();

    self.logger.pending(self.namespace, 'Starting server cluster with ' + count + ' workers');

    cluster.on('exit', self.respawn);

    for (var i = 0; i < count; i++) {
      self.spawn();
    }

    setTimeout(self.logRunning, timeout * 1000);

    next();
  }
});