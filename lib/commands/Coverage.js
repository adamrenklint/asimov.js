var Test = require('./Test');
var _super = Test.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Test.extend({

  'installGroups': ['test', 'runner', 'coverage'],

  'runTests': function () {

    var self = this;
    var started = new Date();

    self.logger.pending(self.namespace, 'Generating test coverage report for "' + self.options.meta.name +'" ' + self.options.meta.version);

    var path = npath.join(process.cwd(), 'node_modules/istanbul/lib/cli.js');
    var mochaPath = npath.join(process.cwd(), 'node_modules/mocha/bin/_mocha');
    var flags = [
      'cover',
      mochaPath,
      '--',
      'tests/**/*.test.js',
      '-R',
      'dot'
    ];

    var coveragePath = npath.join(process.cwd(), 'coverage/lcov-report/index.html');

    var child = child_process.spawn(path, flags);
    child.on('exit', function (output) {

      if (typeof output === 'string' && output.indexOf('No coverage information was collected, exit without writing coverage information') >= 0) {
        self.exit();
      }

      console.log(' ');
      self.logger.since(self.namespace, 'Generated coverage report in ' + coveragePath, started);

      self.openPath(coveragePath);
      self.exit();
    });
  }
});