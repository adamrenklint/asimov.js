var Command = require('./Command');
var _super = Command.prototype;
var handlebars = require('handlebars');
var npath = require('path');
var cwd = process.cwd();

module.exports = Command.extend({

  'command': 'curl -L https://github.com/{{name}}/tarball/v{{version}} | tar zx',
  'name': 'adamrenklint/asimovjs-template-project',
  'version': '0.2.1',

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
      process.exit(1);
    }

    self.logger.pending(self.namespace, 'Cloning ' + self.name + '@' + self.version);

    self.child.execute(command)
      .done(function () {
        self.whenTemplateIsDownloaded(projectName);
      })
      .fail(function (err) {
        throw new Error('Failed to execute ' + command + ': ' + err);
      });
  },

  'renamePath': function (newName) {

    var self = this;
    var deferred = self.deferred();
    var path = npath.join(process.cwd(), newName);
    var currentFolder = self.getCurrentFolderPath();
    var command = 'mv ' + currentFolder + ' ' + path;

    self.child.execute(command).done(function () {
      deferred.resolve(path);
    });

    return deferred.promise();
  },

  'getCurrentFolderPath': function () {

    var self = this;
    var folderPath;

    self.filesystem.readDirectory(process.cwd(), function (path) {
      if (path.indexOf('adamrenklint-asimovjs-template-project') >= 0) {
        folderPath = path;
      }
    });

    return folderPath;
  },

  'whenTemplateIsDownloaded': function (name) {

    var self = this;

    self.renamePath(name).done(function (path) {
      self.logger.since(self.namespace, 'Created new project @ ' + path, self.started);
    });
  }
});