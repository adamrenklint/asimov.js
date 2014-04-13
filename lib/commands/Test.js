var Start = require('./Start');
var _super = Start.prototype;
var child_process = require('child_process');
var npath = require('path');

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

process.env.ENV = 'test';

module.exports = Start.extend({

  'ignoreGrep': false,
  'ignoreReporterFlag': false,

  'startMain': function () {

    var self = this;

    if (!self.mainStarted) {
      self.mainStarted = new Date();

      self.logAsimovHeader();
      self.logger.pending(self.namespace, 'Starting server for integration tests');

      process.env.MUTE = true;
    }
    
    return _super.startMain.apply(self, arguments);
  },

  'started': function (port) {

    var self = this;

    process.env.WATCH = false;
    process.env.MUTE = false;
    self.logger.since(self.namespace, 'Started server @ http://localhost:' + port, self.mainStarted);
    self.logger.pending(self.namespace, 'Running tests for "' + self.options.meta.name + '" ' + self.options.meta.version);

    self.runTests();
  },

  'runTests': function () {

    var self = this;
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

    var path = npath.resolve(__dirname, '../../node_modules/mocha/bin/mocha');
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