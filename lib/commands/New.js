var Command = require('./Command');
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

    var commandIndex = self.options.args.indexOf('new');
    var parent = self.options.args[commandIndex + 1];
    var path = self.options.args[commandIndex + 2];

    self.assert('string', parent, 'Could not create class, invalid parent');
    self.assert('string', path, 'Could not create class, invalid path');

    self.createDefaultClass(parent, path) || self.createCustomClass(parent, path);
  },

  'createDefaultClass': function (parent, path) {

    var self = this;

    return !!_.find(self.defaults, function (_default) {
      if (_default.indexOf(parent) >= 0) {

        var _path = npath.join(__dirname, '../../site/templates/' + parent + '.js.tmpl');
        var raw = self.filesystem.readFile(_path).toString();
        var outputPath = npath.join(process.cwd(), 'lib', path + '.js');

        var parts = outputPath.split('/');
        parts.pop();
        var outputFolder = parts.join('/');
        self.filesystem.forceExists(outputFolder);
        self.filesystem.writeFile(outputPath, raw);

        return true;
      }
    });
  },

  'createCustomClass': function (parent, path) {

    var self = this;
  }
});