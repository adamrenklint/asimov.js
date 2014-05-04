var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'startFlags': [],

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

    var main = self.main = child_process.fork(path, self.startFlags);

    main.on('message', function (data) {

      if (data.installing) {
        self.logger.pending('npm', data.installing);
      }
      else if (data.done) {
        self.ignoreOpenSignal || self.openPath('http://127.0.0.1:' + process.env.PORT);
        self.started(process.env.PORT);
      }
      else if (data.restart) {
        main.removeAllListeners();
        main.kill();

        main = self.startMain(path);
      }
    });
  }
});