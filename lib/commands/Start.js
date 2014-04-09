var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.ensureAsimovProject().done(function (path) {

      child_process.fork(path).on('message', function (data) {
        if (data.started) {
          self.openPath('http://127.0.0.1:' + self.options.port);
        }
      });
    });
  }
});