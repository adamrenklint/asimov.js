var Asimov = require('./Asimov');
var child = require('child_process');

module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;

    if (self.running) return;
    self.running = true;

    if (!self.options.muteLog) {
      self.logAsimovHeader();

      self.logger.pending('start', 'Loading asimov.js @ ' + self.config('ASIMOV').version);
      self.logger.log('start', 'The time is ' + self.started);
    }

    self.spawnWorker();
  },

  'spawnWorker': function () {

    var self = this;

    var worker = self.worker = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker'
      }
    });

    worker.on('exit', self.restart);

    // setTimeout(function () {
    //   worker.kill();
    //  worker.disconnect() // won't work because of hanging loops, like render
    // }, 1000)

    // worker.on('error', function () {
    //   console.log('err', arguments)
    // });

    // worker.on('message', function (data) {
    //   console.log(data);
    // });

    return worker;
  },

  'restart': function () {

    var self = this;

    self.worker.removeAllListeners();
    self.spawnWorker();
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter + '\n');
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  }
});
