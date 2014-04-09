var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var port = self.port = self.options.port || parseInt(process.env.PORT, 10) || 3003;

    self.ensureAsimovProject().done(function (path) {

      child_process.fork(path);

      // TODO: this needs to wait for the server to be ready, not
      // just for a stupid timeout
      setTimeout(function () {
        self.openPath('http://127.0.0.1:' + port);
      }, 1000);
    });
  }
});