var Command = require('./Command');
var _super = Command.prototype;
var child_process = require('child_process');
var npath = require('path');

module.exports = Command.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    var started = new Date();

    self.installEnv = 'complexity';

    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();
      self.logger.pending(self.namespace, 'Generating complexity report for "' + self.options.meta.name +'" ' + self.options.meta.version);

      var path = npath.resolve(__dirname, '../../node_modules/plato/bin/plato');

      var flags = [
        '-d',
        'complexity',
        '-r',
        'lib'
      ];

      var child = child_process.spawn(path, flags);
      child.on('exit', function (output) {
        var outputPath = process.cwd() + '/complexity/index.html';
        self.logger.since(self.namespace, 'Saved complexity report @ ' + outputPath, started);
        self.openPath(outputPath);
      });
    });
  }
});