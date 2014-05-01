var Klass = require('../../asimov-core').Klass;
var _super = Klass.prototype;
var child_process = require('child_process');

var Filesystem = require('../../asimov-core').Filesystem;
var filesystem = new Filesystem();

var npath = require('path');
var meta = require(npath.join(process.cwd(), 'package.json'));

module.exports = Klass.extend({

  'namespace': 'test',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.setup();
  },

  'setup': function () {

    var self = this;
  },

  'getFlags': function (args) {

    var self = this;
    var flags = [];

    var commandIndex = args.indexOf(self.namespace);
    var grep = args[commandIndex + 1];
    var reporterFlag, reporterFlagIndex;

    self.ignoreReporterFlag || args.forEach(function (arg, index) {
      if (arg.indexOf('--') === 0) {
        reporterFlagIndex = index;
        reporterFlag = arg.replace('--', '');
      }
    });
    if (reporterFlagIndex === commandIndex + 1) grep = null;
    if (reporterFlag) {
      flags = flags.concat(['-R', reporterFlag]);
    }

    return self.getTestPaths(null, grep, flags);
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
  },

  'run': function () {

    var self = this;
    self.logger.pending(self.namespace, 'Running tests for "' + meta.name + '" ' + meta.version);

    var flags = self.getFlags(process.argv);
    var path = __dirname + '/../node_modules/mocha/bin/mocha';

    if (!filesystem.pathExists(npath.join(process.cwd(), 'tests'))) {
      self.error([
        'No tests in /tests!'
      ]);
    }

    if (flags.length) {
      var child = child_process.fork(path, flags);
      child.on('exit', self.exit);
    }
  },

  'exit': function (code) {

    var self = this;
    // self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));
    // self.main.kill();
    process.exit(code);
  },
});