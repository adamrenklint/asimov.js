var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var path = npath.join(process.cwd(), 'main.js');

    if (!self.filesystem.pathExists(path)) {
      self.logger.log(self.namespace, 'The "start" command can only be run in asimov.js projects');
      var message = 'Couldn\'t find main.js in ' + process.cwd();
      console.log('[' + self.namespace + '] ' + message);
      process.exit(1);
    }

    child_process.fork(path);
  }
});