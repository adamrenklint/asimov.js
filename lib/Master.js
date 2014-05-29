var Asimov = require('./Asimov');
var child = require('child_process');
var pusage = require('pidusage');

module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;

    if (self.running) return;
    self.running = true;

    self.writePID();

    if (!self.options.muteLog) {

      self.logAsimovHeader();
    }

    self.logAppStatus('Starting');

    process.on('exit', self.shutdownMaster);
    process.on('SIGINT', self.terminateMaster);
    process.on('SIGTERM', self.terminateMaster);
    process.on('SIGHUP', self.restartMaster);

    self.next = next;
    self.worker = self.spawnWorker();

    var temp = [];
    setInterval(function () {

      var n = 10000;
      while (n--) {
        console.log(n);
        temp.push('a90sdi89asdias089sa8d90as8d90as89d0sa');
      }

      console.log(process.pid);
      pusage(process.pid, function(err, stat) {

          console.log('% cpu: %s', stat.cpu);
          console.log('Mem: %s', stat.memory / 1024 / 1024); //those are bytes - no, now they're MB

      });
    }, 1000);
  },

  'getPIDPath': function () {

    return process.cwd() + '/process.pid';
  },

  'writePID': function () {

    var self = this;
    self.filesystem.writeFile(self.getPIDPath(), process.pid);
  },

  'restartMaster': function () {

    var self = this;

    console.log('');
    self.logger.pending(self.namespace, 'Received restart signal, restarting app process');
    self.logAppStatus('Restarting');

    self.restartWorker();
  },

  'terminateMaster': function () {

    var self = this;
    console.log('');
    self.logger.pending(self.namespace, 'Received termination signal, killing app process');
    process.exit(1);
  },

  'shutdownMaster': function () {

    var self = this;

    self.worker.kill();

    self.logAppStatus('Stopping');
    self.filesystem.recursiveDelete(self.getPIDPath());
  },

  'spawnWorker': function () {

    var self = this;

    self.started = new Date();

    var worker = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker',
        'ENV': process.env.ENV || 'development',
        'VERBOSE': process.env.VERBOSE
      }
    });

    worker.on('exit', self.onExit);
    worker.on('message', self.onMessage);

    return worker;
  },

  'restartWorker': function () {

    var self = this;

    // save ref to the old worker, to be killed
    // when the new one emits "app:started"
    self.oldWorker = self.worker;
    self.worker = self.spawnWorker();
  },

  'shutdownOldWorker': function () {

    var self = this;
    var oldWorker = self.oldWorker;
    self.oldWorker = null;

    if (oldWorker) {

      oldWorker.removeAllListeners();
      oldWorker.kill('SIGHUP');

      var killWorker = setTimeout(function () {
        oldWorker.kill();
      }, 30 * 1000);

      killWorker.unref();
    }
  },

  'onMessage': function (data) {

    var self = this;

    if (data.event === 'app:started') {

      self.shutdownOldWorker();
      self.next && self.next();

      if (!self.options.muteLog) {

        if (data.initializers) {
          self.logger.since(self.namespace, 'Executed ' + data.initializers + ' initializer(s)', data.started);
          self.logAppStatus('Started', self.started);
        }
        else {
          self.error('No initializers found');
        }
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

  'logAppStatus': function (status, started) {

    var self = this;
    if (self.options.muteLog) return;

    var pkg = self.config('PKG');
    var message = status + ' "' + pkg.name + '" @ ' + pkg.version;

    if (started) {
      self.logger.since(self.namespace, message, started);
    }
    else {
      self.logger.pending(self.namespace, message);
    }
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter + '\n');
    self.logLines(self.signature);
    console.log(self.lineDelimiter);

    self.logger.pending('start', 'Loading asimov.js @ ' + self.config('ASIMOV').version);
    self.logger.log('start', 'The time is ' + self.started);
  }
});
