var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.ensureAsimovProject().done(function (path) {
      var path = npath.join(process.cwd(), 'main.js');
      child_process.fork(path);
    });
  }
});