var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    var started = new Date();

    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();
      self.logger.pending(self.namespace, 'Generating test coverage report for "' + self.options.meta.name +'" ' + self.options.meta.version);

      var path = npath.resolve(__dirname, '../../node_modules/istanbul/lib/cli.js');
      var mochaPath = npath.resolve(__dirname, '../../node_modules/mocha/bin/_mocha');
      var flags = [
        'cover',
        mochaPath,
        '--',
        'tests/**/*.test.js',
        '-R',
        'dot'
      ];

      var coveragePath = npath.join(process.cwd(), 'coverage/lcov-report/index.html');

      var child = child_process.fork(path, flags);
      child.on('exit', function (output) {
        self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));

        if (typeof output === 'string' && output.indexOf('No coverage information was collected, exit without writing coverage information') >= 0) {
          process.exit();
        }

        console.log(' ');
        self.logger.since(self.namespace, 'Generated coverage report in ' + coveragePath, started);

        self.openPath(coveragePath);
        process.exit(code);
      });
    });
  }
});