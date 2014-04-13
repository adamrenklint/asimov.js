var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.ensureAsimovProject().done(function (path) {
      self.startMain(path);
    });
  },

  'started': function () {},

  'startMain': function (path) {

    var self = this;

    var main = self.main = child_process.fork(path);

    main.on('message', function (data) {

      if (data.done) {
        self.openPath('http://127.0.0.1:' + self.options.port);
        self.started(self.options.port);
      }
      else if (data.restart) {
        main.removeAllListeners();
        main.kill();

        main = self.startMain(path);
      }
    });
  }
});