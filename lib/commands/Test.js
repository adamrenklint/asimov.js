var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    self.ensureAsimovProject();

    self.logger.pending(self.namespace, 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.pending(self.namespace, 'Running tests for "' + self.options.meta.name +'" ' + self.options.meta.version);

    var commandIndex = self.options.args.indexOf('test');
    var grep = self.options.args[commandIndex + 1];

    var path = npath.resolve(__dirname, '../../node_modules/mocha/bin/mocha');
    var paths = self.getTestPaths(null, grep, []);
    paths.length && child_process.fork(path, paths);
  },

  'getTestPaths': function (path, grep, paths) {

    var self = this;
    if (!grep) return ['tests/**/*.test.js'];

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