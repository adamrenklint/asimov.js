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

    self.next = next;
    self.worker = self.spawnWorker();
  },

  'spawnWorker': function () {

    var self = this;

    self.started = new Date();

    var worker = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker',
        'ENV': process.env.ENV
      }
    });

    worker.on('exit', self.onExit);
    worker.on('message', self.onMessage);

    return worker;
  },

  'onMessage': function (data) {

    var self = this;

    if (data.event === 'app:started') {
      self.next && self.next();

      if (!self.options.muteLog) {

        if (data.initializers) {
          self.logger.since(self.namespace, 'Executed ' + data.initializers + ' initializer(s)', data.started);
        }
        else {
          self.error('No initializers found');
        }

        self.logAppStatus('Started', self.started);
      }

      if (!data.initializers && process.env.ENV !== 'test') {
        process.exit();
      }
    }
  },

  'onExit': function (code) {

    var self = this;

    // if (code === 1) ? err
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
