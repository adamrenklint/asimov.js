var Command = require('./Command');
var Templates = require('../render/TemplatesCollection');
var _super = Command.prototype;
var child_process = require('child_process');
var handlebars = require('handlebars');
var npath = require('path');
var _ = require('lodash');

module.exports = Command.extend({

  'defaults': [
    'core/Base',
    'server/Middleware',
    'core/Initializer',
    'render/Helper',
    'runner/Test'
  ],

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();

      var commandIndex = self.options.args.indexOf('extend');
      var parent = self.options.args[commandIndex + 1];
      var path = self.options.args[commandIndex + 2];

      if (!path && parent) {
        path = parent;
        parent = 'Base';
      }

      self.assert('string', path, function () {
        self.error(['Invalid output path: ' + path]);
      });

      var templates = self.templates = new Templates(null, self.options);
      templates.fetch(self.options.paths.templates).done(function () {
        self.createClass(parent, path);
      });
    });
  },

  'createClass': function (parent, path) {

    var self = this;
    var started = new Date();

    parent += '.js';

    var parentPath = self.filesystem.findFirstMatch(parent, self.options.paths.scripts);

    self.assert('string', parentPath, function () {
      self.error(['Could not create ' + path + ', failed to find superclass: ' + parent]);
    });

    var outputPath = self.getOutputPath(parentPath, path);

    self.assert('string', outputPath, function () {
      self.error(['Could not create ' + path + ', failed to define output path']);
    });

    var output = self.getOutput(parentPath, outputPath);

    var outputFolder = self.getFolder(outputPath);

    if (self.filesystem.pathExists(outputPath)) {
      self.error(['Path already exists @ ' + outputPath]);
    }

    self.filesystem.forceExists(outputFolder);
    self.filesystem.writeFile(outputPath, output);

    self.logger.since(self.namespace, 'Created new subclass of /' + parent + ' @ ' + outputPath, started);

    self.createTestForClass(parentPath, outputPath);
  },

  'getFolder': function (path) {

    var self = this;
    var parts = path.split('/');
    parts.pop();
    return parts.join('/');
  },

  'createTestForClass': function (parentPath, outputPath) {

    var self = this;
    var started = new Date();
    var template = self.templates.get('Class.test.js');
    var name = outputPath.split('/').pop().replace('.js', '');

    var testPath = outputPath
      .replace('/lib/', '/tests/')
      .replace(/\.js$/, '.test.js');

    var output = template.attributes.compiled({
      'name': name,
      'path': npath.relative(self.getFolder(testPath), outputPath)
    });

    var outputFolder = self.getFolder(testPath);

    self.filesystem.forceExists(outputFolder);
    self.filesystem.writeFile(testPath, output);

    self.logger.since(self.namespace, 'Created new test for ' + name + ' @ ' + testPath, started);
  },

  'getOutput': function (parentPath, outputPath) {

    var self = this;
    var parentName = parentPath.split('/').pop().replace('.js', '');

    var template = self.templates.find(function (template) {
      var name = template.attributes.name;
      if (parentPath.indexOf('/' + name) >= 0) {
        return true;
      }
    }) || self.templates.get('Class.js');

    return template.attributes.compiled({
      'parent': {
        'name': parentName,
        'path': npath.relative(self.getFolder(parentPath), outputPath)
      }
    });
  },

  'getOutputPath': function (parentPath, path) {

    var self = this;
    parentPath = parentPath.replace(self.options.frameworkDir, process.cwd());
    var root = parentPath.indexOf('Test') >= 0 ? 'tests' : 'lib';

    if (path.indexOf('/') > 0) {
      return npath.join(process.cwd(), root, path + '.js');
    }
    else if (parentPath.indexOf('node_modules') < 0) {
      var parentParts = parentPath.split('/');
      parentParts.pop();
      return npath.join(parentParts.join('/'), path + '.js');
    }
  }
});