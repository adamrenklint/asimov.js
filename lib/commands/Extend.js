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

    self.ensureAsimovProject();
    self.logAsimovHeader();

    var commandIndex = self.options.args.indexOf('extend');
    var parent = self.options.args[commandIndex + 1];
    var path = self.options.args[commandIndex + 2];

    if (!path && parent) {
      path = parent;
      parent = 'Base';
    }

    if (!path || typeof path !== 'string') {

      self.logger.log(self.namespace, 'Invalid output path: ' + path);
      process.exit(1);
    }

    var templates = new Templates(null, self.options);
    templates.fetch(self.options.paths.templates).done(function () {
      self.createClass(parent, path);
    });
  },

  'createClass': function (parent, path) {

    var self = this;

    parent += '.js';

    var parentPath = self.filesystem.findFirstMatch(parent, self.options.paths.scripts);
    console.log('createClass', parent, path, parentPath);
  },

  'createDefaultClass': function (parent, path) {

    var self = this;
    var started = new Date();

    return !!_.find(self.defaults, function (_default) {
      if (_default.indexOf(parent) >= 0) {

        var _path = npath.join(__dirname, '../../site/templates/' + parent + '.js.tmpl');
        var raw = self.filesystem.readFile(_path).toString();

        if (path.indexOf('/') < 0) {
          var prefix = parent === 'Base' ? 'core' : parent.toLowerCase() + 's';
          path = prefix + '/' + path;
        }

        var root = parent === 'Test' ? 'tests' : 'lib';
        var outputPath = npath.join(process.cwd(), root, path + '.js');

        if (self.filesystem.pathExists(outputPath)) {
          self.logger.log(self.namespace, 'Path already exists @ ' + outputPath);
          process.exit(1);
        }

        var parts = outputPath.split('/');
        parts.pop();
        var outputFolder = parts.join('/');

        if (raw.indexOf('{{') >= 0 && raw.indexOf('}}') >= 0) {

          var template = handlebars.compile(raw);
          raw = template({
            'name': path
          });
        }

        self.filesystem.forceExists(outputFolder);
        self.filesystem.writeFile(outputPath, raw);

        self.logger.since(self.namespace, 'Created new subclass of asimov.js/' + parent + ' @ ' + outputPath.replace(process.cwd(), ''));

        return true;
      }
    });
  },

  'createCustomClass': function (parent, path) {

    var self = this;

    return !!_.find(self.defaults, function (_default) {

      var root = npath.join(process.cwd(), 'lib', parent + '.js');

      if (!self.filesystem.pathExists(root)) {

        // try to find first match in /lib...

        self.logger.log(self.namespace, 'Invalid parent class: ' + parent + ' @ ' + root);
        process.exit(1);
      }

      if (path.indexOf('/') < 0) {

        var parentParts = parent.split('/');
        parentParts.pop();
        path = parentParts.join('/') + '/' + path;
        console.log('p', path)
        process.exit(1);
      }

      var parts = root.split('/');
      parts.pop();
      var outputFolder = parts.join('/');
      var parentPath = npath.join(process.cwd(), 'lib', parent + '.js');
      parentPath = npath.resolve(parentPath, root);

      var templatePath = npath.join(__dirname, '../../site/templates/Class.js.tmpl');
      var raw = self.filesystem.readFile(templatePath).toString();
      var template = handlebars.compile(raw);
      raw = template({
        'parent': {
          'path': parentPath,
          'name': parent.split('/').pop()
        }
      });
      console.log('TODO: need to fix the path here, should be as short as possible', npath.resolve(outputFolder, parentPath))
      console.log(raw);process.exit(1);
    });
  }
});