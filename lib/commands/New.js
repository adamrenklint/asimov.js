var Command = require('./Command');
var _super = Command.prototype;
var Templates = require('../render/TemplatesCollection');
// var fs = require('fs');
// var handlebars = require('handlebars');
var npath = require('path');
// var _ = require('lodash');
// var cwd = process.cwd();

module.exports = Command.extend({

  // 'command': 'curl -L https://github.com/{{name}}/tarball/{{version}} | tar zx',
  // 'name': 'adamrenklint/asimovjs-template-project',
  // 'version': 'master',
  // // 'version': 'v0.2.1',

  // 'templates': [
  //   'package.json.tmpl'
  // ],

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();
    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();

      var commandIndex = self.options.args.indexOf(self.options.command.toLowerCase());
      var type = self.options.args[commandIndex + 1];
      var callback = self[type];

      self.assert('function', callback, function () {
        self.error(['Invalid type: ' + type]);
      });

      var templates = self.templates = new Templates(null, self.options);
      templates.fetch(self.options.paths.templates).done(callback);
    });
  },

  'page': function () {

    var self = this;
    var typeIndex = self.options.args.indexOf('page');
    var url = self.options.args[typeIndex + 1];

    self.assert('string', url, function () {
      self.error(['Invalid output path: ' + url]);
    });

    var templateName = self.options.args[typeIndex + 2];

    self.assert('string', templateName, function () {
      self.error(['Invalid template name: ' + templateName]);
    });

    var template = self.templates.get(templateName);
    self.assert('object', template, function () {
      self.error(['Template does not exist: ' + templateName]);
    });

    var outputFolder = npath.join(self.options.paths.content, url);
    var outputPath = npath.join(outputFolder, templateName + '.txt');
    var outputTemplate = self.templates.get('new.page');
    var output = self.renderTemplate(outputTemplate.attributes.compiled);

    if (self.filesystem.pathExists(outputPath)) {
      self.error(['Path already exists: ' + outputPath]);
    }

    self.filesystem.forceExists(outputFolder);
    self.filesystem.writeFile(outputPath, output);

    self.logger.since(self.namespace, 'Created new page @ ' + outputPath, self.started);
  },

  'renderTemplate': function (template) {

    var self = this;
    return template({});
  }

  //   var command = handlebars.compile(self.command);
  //   command = command({
  //     'name': self.name,
  //     'version': self.version
  //   });

  //   var commandIndex = self.options.args.indexOf('create');
  //   var projectName = self.projectName = self.options.args[commandIndex + 1];

  //   self.assert('string', projectName, function () {
  //     self.error([
  //       'Invalid project name: ' + projectName,
  //       'To get usage instructions, type ' + 'asimov.js help'.bold
  //     ]);
  //   });

  //   self.logger.pending(self.namespace, 'Cloning ' + self.name + '@' + self.version);

  //   self.child.execute(command)
  //     .done(function (err) {
  //       if (err && err.indexOf('Could not resolve host') > 0) {
  //         self.logger.log(self.namespace, 'Failed to clone ' + self.name);
  //         process.exit(1);
  //       }
  //       else {
  //         var path = npath.join(process.cwd(), projectName);
  //         self.whenTemplateIsDownloaded(path);
  //       }
  //     })
  //     .fail(function (err) {
  //       throw new Error('Failed to execute ' + command + ': ' + err);
  //     });
  // },

  // 'renamePath': function (path) {

  //   var self = this;
  //   var deferred = self.deferred();
  //   var currentFolder = self.getCurrentFolderPath();
  //   var command = 'mv ' + currentFolder + ' ' + path;

  //   self.child.execute(command).done(function () {
  //     deferred.resolve(path);
  //   });

  //   return deferred.promise();
  // },

  // 'getTemplates': function (names, root) {

  //   var self = this;
  //   var templates = {};

  //   names.forEach(function (name) {
  //     var path = npath.join(root, name);
  //     var raw = self.filesystem.readFile(path).toString();
  //     templates[name] = handlebars.compile(raw);
  //   });

  //   return templates;
  // },

  // 'renderTemplate': function (template) {

  //   var self = this;
  //   var hash = {
  //     'name': self.projectName,
  //     // 'version': '~' + self.options.pkg.version
  //     'version': 'latest'
  //   };

  //   return template(hash);
  // },

  // 'overwriteWithTemplates': function (path) {

  //   var self = this;
  //   var deferred = self.deferred();
  //   var templatesPath = npath.join(__dirname, '../../site/templates');
  //   var templates = self.getTemplates(self.templates, templatesPath);

  //   _.each(templates, function (template, name) {
  //     var filename = name.replace('.tmpl', '');
  //     var outputPath = npath.join(path, filename);
  //     var value = self.renderTemplate(template);
  //     self.filesystem.writeFile(outputPath, value);
  //   });

  //   return deferred.resolve().promise();
  // },

  // 'getCurrentFolderPath': function () {

  //   var self = this;
  //   var folderPath;

  //   self.filesystem.readDirectory(process.cwd(), function (path) {
  //     if (path.indexOf(self.name.replace('/', '-')) >= 0) {
  //       folderPath = path;
  //     }
  //   });

  //   return folderPath;
  // },

  // 'whenTemplateIsDownloaded': function (path) {

  //   var self = this;

  //   if (self.filesystem.pathExists(path)) {

  //     self.assert('string', projectName, function () {
  //       self.error([
  //         'Invalid project name: ' + projectName,
  //         'To get usage instructions, type ' + 'asimov.js help'.bold
  //       ]);
  //     });
  //     self.error(['Path already exists @ ' + path]);
  //   }
  //   else {

  //     self.renamePath(path).done(function (path) {
  //       self.overwriteWithTemplates(path).done(function () {

  //         fs.unlinkSync(npath.join(path, 'CHANGELOG.md'));

  //         self.logger.since(self.namespace, 'Created new project @ ' + path, self.started);
  //       });
  //     });
  //   }
});