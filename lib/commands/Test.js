var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'allowGrep': true,

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();

    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();
      self.logger.pending(self.namespace, self.getHeader());

      var commandIndex = self.options.args.indexOf('test');
      var grep = self.options.args[commandIndex + 1];

      var reporterFlagIndex, reporterFlag;
      self.options.args.forEach(function (arg, index) {
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
    });
  },

  'getHeader': function () {

    var self = this;
    return 'Running tests for "' + self.options.meta.name + '" ' + self.options.meta.version;
  },

  'exit': function (code) {

    var self = this;
    self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));
    process.exit(code);
  },

  'getTestPaths': function (path, grep, paths) {

    var self = this;
    if (!grep || !self.allowGrep) return ['tests/**/*.test.js'];

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