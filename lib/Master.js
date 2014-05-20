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

    self.logAppStatus('Starting');

    self.worker = self.spawnWorker();
  },

  'spawnWorker': function () {

    var self = this;

    var worker = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker'
      }
    });

    worker.on('exit', self.onExit);
    worker.on('message', self.onMessage);

    return worker;
  },

  'onMessage': function (data) {

    if (data.started && !data.initializers) {
      process.exit();
    }
  },

  'onExit': function (code) {

    var self = this;

    // if (code === 1)
    // TODO: if an error is throw in the worker,
    // watch the entire structure for changes
    // when it changes, remove the watcher and
    // start the process again

    var status = code === 1 ? 'Crashed, restarting' : 'Restarting';
    console.log(' ');
    self.logAppStatus(status);

    self.worker.removeAllListeners();
    self.worker = self.spawnWorker();
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter + '\n');
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  }
});
