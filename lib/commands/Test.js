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
    // var mochaPath = __dirname + ;
    child_process.fork(path, [
      'tests/**/*.test.js'
    ]);

    // var path = npath.join('main.js');

    // if (!self.filesystem.pathExists(path)) {
    //   self.logger.log(self.namespace, 'The "start" command can only be run in asimov.js projects');
    //   var message = 'Couldn\'t find main.js in ' + process.cwd();
    //   console.log('[' + self.namespace + '] ' + message);
    //   process.exit(1);
    // }

    // child_process.fork(path);
  }
});