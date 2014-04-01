var Command = require('./Command');
var _super = Command.prototype;
var handlebars = require('handlebars');
var npath = require('path');
var cwd = process.cwd();

module.exports = Command.extend({

  'command': 'curl -L https://github.com/{{name}}/tarball/{{version}} | tar zx',
  'name': 'adamrenklint/asimovjs-template-project',
  'version': 'master',
  // 'version': 'v0.2.1',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();

    var command = handlebars.compile(self.command);
    command = command({
      'name': self.name,
      'version': self.version
    });

    var commandIndex = self.options.args.indexOf('create');
    var projectName = self.options.args[commandIndex + 1];

    if (!projectName || typeof projectName !== 'string') {

      self.logger.log(self.namespace, 'Invalid project name: ' + projectName);
      self.logger.log(self.namespace, 'To get usage instructions, type ' + 'asimov.js help'.bold);
      process.exit(1);
    }

    self.logger.pending(self.namespace, 'Cloning ' + self.name + '@' + self.version);

    self.child.execute(command)
      .done(function (err) {
        if (err && err.indexOf('Could not resolve host') > 0) {
          self.logger.log(self.namespace, 'Failed to clone ' + self.name);
          process.exit(1);
        }
        else {
          var path = npath.join(process.cwd(), projectName);
          self.whenTemplateIsDownloaded(path);
        }
      })
      .fail(function (err) {
        throw new Error('Failed to execute ' + command + ': ' + err);
      });
  },

  'renamePath': function (path) {

    var self = this;
    var deferred = self.deferred();
    var currentFolder = self.getCurrentFolderPath();
    var command = 'mv ' + currentFolder + ' ' + path;

    self.child.execute(command).done(function () {
      deferred.resolve(path);
    });

    return deferred.promise();
  },

  'overwriteWithTemplates': function (path) {

    var self = this;
    var deferred = self.deferred();

    // deferred.resolve();

    return deferred.promise();
  },

  'getCurrentFolderPath': function () {

    var self = this;
    var folderPath;

    self.filesystem.readDirectory(process.cwd(), function (path) {
      if (path.indexOf(self.name.replace('/', '-')) >= 0) {
        folderPath = path;
      }
    });

    return folderPath;
  },

  'whenTemplateIsDownloaded': function (path) {

    var self = this;

    if (self.filesystem.pathExists(path)) {

      self.logger.log(self.namespace, 'Path already exists @ ' + path);
      process.exit(1);
    }
    else {

      self.renamePath(path).done(function (path) {
        self.overwriteWithTemplates(path).done(function () {
          self.logger.since(self.namespace, 'Created new project @ ' + path, self.started);
        });
      });
    }
  }
});