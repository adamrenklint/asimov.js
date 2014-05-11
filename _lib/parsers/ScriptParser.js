var DependencyParser = require('./DependencyParser');
var _ = require('lodash');
var _super = DependencyParser.prototype;
var npath = require('path');

module.exports = DependencyParser.extend({

  'namespace': 'Parser',

  'parse': function (model, raw, dependencies) {

    var self = this;
    var attributes = model.attributes;
    raw = raw || attributes.unminified;

    var folderPath = attributes.path.split('/');
    folderPath.pop();
    folderPath = folderPath.join('/');

    var regExp = /require\(('|")(.\/(\w|\/)+)('|")\);/;
    var matches = raw.match(regExp);
    var match = matches && matches[0];

    if (match && typeof match === 'string') {

      var filename = match.replace(regExp, function (full, whatever, name) {
        return name;
      });

      if (filename.indexOf('.js') < 1) {
        filename += '.js';
      }

      var path = npath.join(folderPath, filename);

      _.each(self.options.paths.scripts, function (scriptPath) {
        path = path.replace(npath.join(process.cwd(), scriptPath), '').replace(scriptPath, '');
      });

      path = self.filesystem.findFirstMatch(path, self.options.paths.scripts);

      if (!path) {
        throw new Error('ScriptParser could not locate dependency "' + filename + '"');
      }

      var file = self.filesystem.readFile(path);
      raw += file;

      self.add(model, path, dependencies);

      raw = raw.replace(match, '');
      self.parse(model, raw, dependencies);
    }
    else {

      self.add(model, model.attributes.path, dependencies);
    }
  }
});