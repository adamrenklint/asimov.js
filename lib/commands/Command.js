var Base = require('../core/Base');
var _super = Base.prototype;
var fs = require('fs');
var child_process = require('child_process');
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
    var deferred = self.deferred();

    var path = npath.join(process.cwd(), 'main.js');

    if (!self.filesystem.pathExists(path)) {
      self.logger.log(self.namespace, 'The "' + self.options.command + '" command can only be run in asimov.js projects');
      var message = 'Couldn\'t find main.js in ' + process.cwd();
      console.log('[' + self.namespace + '] ' + message);
      process.exit(1);
    }

    function log (data) {
      data = data.toString().replace('/\n/g', '').trim();
      if (data.length < 10 || data.indexOf('npm') === 0) return;

      self.logger.log('install', data);
    }

    var modulePath = npath.join(process.cwd(), 'node_modules');
    var moduleFolderExists = fs.existsSync(modulePath);

    if (!moduleFolderExists) {

      var child = child_process.spawn('npm', ['install']);

      child.on('exit', function () {
        deferred.resolve(path);
      });

      child.stdout.on('data', log);
      child.stderr.on('data', log);
    }
    else {
      deferred.resolve(path);
    }

    return deferred.promise();
  },

  'logAsimovHeader': function () {

    var self = this;
    self.logger.pending('cli', 'Loading asimov.js @ ' + self.options.pkg.version);
  },

  'openPath': function (path) {

    var self = this;
    var commandIndex = self.options.args.indexOf(self.options.command);
    var subCommand = self.options.args[commandIndex + 1];
    if (subCommand === '--open') return self.child.execute('open ' + path);
  }
});