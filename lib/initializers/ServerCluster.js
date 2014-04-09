var Initializer = require('./Initializer');
var Server = require('../server/Server');
var _ = require('lodash');
var _super = Initializer.prototype;

var cluster = require('cluster');
var workers = {};
var count = 2 * require('os').cpus().length;
console.log(count);

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;

    function spawn() {
      var worker = cluster.fork();
      workers[worker.process.pid] = worker;
      return worker;
    }

    function onDeath(worker) {
      console.log('worker %s died.', worker.process.pid);
      setTimeout(spawn, 100);
      delete workers[worker.process.pid];
    }

    // if (cluster.isMaster) {
      cluster.on('exit', onDeath);
      for (var i = 0; i < count; i++) {
        spawn();
      }
    // } else {
    //   var http = require('http');
    //   var server = http.createServer(function (req, res) {
    //     setTimeout(function () {
    //       res.end('{}\n');
    //     }, 1000);
    //   });
    //   server.listen(8000);
    // }

    next();
  }
});