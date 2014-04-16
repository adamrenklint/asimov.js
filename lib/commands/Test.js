var Start = require('./Start');
var _super = Start.prototype;
var child_process = require('child_process');
var npath = require('path');

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Start.extend({

  'ignoreOpenSignal': true,
  'ignoreGrep': false,
  'ignoreReporterFlag': false,

  'installGroups': ['test'],

  'startFlags': ['--runner'],

  'startMain': function (path) {

    var self = this;
    var args = arguments;
    self.startCount = self.startCount || 0;

    if (self.startCount < 3) {

      self.startCount++;

      self.updateDependencies().done(function () {

        self.mainStarted = self.mainStarted || new Date();

        if (self.startCount > 1) {

          self.logAsimovHeader();
          self.startFlags = [];
          self.logger.pending(self.namespace, 'Starting server for integration tests');
          process.env.MUTE = true;
          process.env.ENV = 'test';
        }

        _super.startMain.apply(self, args);
      });
    }
  },

  'logBefore': function (name, version) {

    var self = this;

    process.send && process.send({
      'installing': 'Installing ' + name + ' @ ' + version
    });

    return true;
  },

  'started': function (port) {

    var self = this;

    process.env.MUTE = false;
    self.logger.since(self.namespace, 'Started server @ http://127.0.0.1:' + port, self.mainStarted);

    self.runTests();
  },

  'runTests': function () {

    var self = this;
    self.logger.pending(self.namespace, 'Running tests for "' + self.options.meta.name + '" ' + self.options.meta.version);

    var commandIndex = self.options.args.indexOf('test');
    var grep = self.options.args[commandIndex + 1];
    var reporterFlag, reporterFlagIndex;

    self.ignoreReporterFlag || self.options.args.forEach(function (arg, index) {
      if (arg.indexOf('--') === 0) {
        reporterFlagIndex = index;
        reporterFlag = arg.replace('--', '');
      }
    });
    if (reporterFlagIndex === commandIndex + 1) grep = null;

    var path = self.options.frameworkDir + '/node_modules/mocha/bin/mocha';
    var flags = self.getTestPaths(null, grep, []);

    if (reporterFlag) {
      flags = flags.concat(['-R', reporterFlag]);
    }

    if (flags.length) {
      var child = child_process.fork(path, flags);
      child.on('exit', self.exit);
    }
  },

  'exit': function (code) {

    var self = this;
    self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));
    self.main.kill();
    process.exit(code);
  },

  'getTestPaths': function (path, grep, paths) {

    var self = this;
    if (!grep || self.ignoreGrep) return ['tests/**/*.test.js'];

    paths = paths || [];
    path = path || npath.join(process.cwd(), 'tests');

    self.filesystem.readDirectory(path, function (subPath) {
      if (subPath.indexOf('.test.js') > 0 && subPath.toLowerCase().indexOf(grep.toLowerCase()) >= 0) {
        paths.push(subPath);
      }
      else if (self.filesystem.isDirectory(subPath)) {
        paths = self.getTestPaths(subPath, grep, paths);
      }
    });

    return paths;
  }
});