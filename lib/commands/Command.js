var Base = require('../core/Base');
var _super = Base.prototype;
var npath = require('path');

module.exports = Base.extend({

  'lineDelimiter': '\n\n',
  'lines': [],
  'padding': '      ',

  'logLines': function () {

    var self = this;
    self.lines.forEach(function (line) {
      console.log(self.padding + line);
    });
  },

  'ensureAsimovProject': function () {

    var self = this;
    var path = npath.join(process.cwd(), 'main.js');

    if (!self.filesystem.pathExists(path)) {
      self.logger.log(self.namespace, 'The "' + self.options.command + '" command can only be run in asimov.js projects');
      var message = 'Couldn\'t find main.js in ' + process.cwd();
      console.log('[' + self.namespace + '] ' + message);
      process.exit(1);
    }
  },

  'logAsimovHeader': function () {

    var self = this;
    self.logger.pending('cli', 'Loading asimov.js @ ' + self.options.pkg.version);
  },

  'error': function (lines) {

    var self = this;
    lines.forEach(function (line) {
      self.logger.log('error', line);
    });
    process.exit(1);
  }
});