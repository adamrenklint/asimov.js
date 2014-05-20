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

    // var started = new Date();
    var pkg = self.config('PKG');
    var template = '$ "' + pkg.name + '" @ ' + pkg.version;

    self.options.muteLog || self.logger.pending(self.namespace, template.replace('$', 'Starting'));

    self.spawnWorker();
  },

  'spawnWorker': function () {

    var self = this;

    var worker = self.worker = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker'
      }
    });

    worker.on('exit', self.onExit);
    worker.on('message', self.onMessage);

    return worker;
  },

  'onMessage': function (data) {

    console.log('data from worker', data);
  },

  'onExit': function () {

    var self = this;

    // console.log(arguments)
    // TODO: if an error is throw in the worker,
    // watch the entire structure for changes
    // when it changes, remove the watcher and
    // start the process again

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
