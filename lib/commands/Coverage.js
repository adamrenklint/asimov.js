var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();
      self.logger.pending(self.namespace, 'Generating test coverage report for "' + self.options.meta.name +'" ' + self.options.meta.version);

      //istanbul cover _mocha -- tests/*/**.test.js -R dot

      // var commandIndex = self.options.args.indexOf('test');
      // var grep = self.options.args[commandIndex + 1];

      // var reporterFlagIndex = self.options.args.indexOf('-R');
      // if (reporterFlagIndex === commandIndex + 1) grep = null;
      // var reporterFlag = ~reporterFlagIndex && self.options.args[reporterFlagIndex + 1];

      // var path = npath.resolve(__dirname, '../../node_modules/mocha/bin/mocha');
      // var flags = self.getTestPaths(null, grep, []);

      // if (reporterFlag) {
      //   flags = flags.concat(['-R', reporterFlag]);
      // }

      // if (flags.length) {
      //   var child = child_process.fork(path, flags);
      //   child.on('exit', function (code) {
      //     self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));
      //     process.exit(code);
      //   });
      // }
    });
  }
});