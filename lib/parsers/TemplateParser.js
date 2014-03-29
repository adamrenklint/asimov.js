var DependencyParser = require('./DependencyParser');
var _ = require('lodash');
var _super = DependencyParser.prototype;
var npath = require('path');

module.exports = DependencyParser.extend({

  'namespace': 'Parser',

  'parse': function (model, raw, dependencies) {

    var self = this;
    var attributes = model.attributes;
    raw = self.assertAttributes(attributes, raw);
    var regExp = /\{\{(#)?import "((\w|\/)+)"/;
    var paths = self.options.paths.templates.slice(0);

    var matches = raw.match(regExp);
    var match = matches && matches[0];

    if (match && typeof match === 'string') {

      var filename = match.split('"')[1];

      if (filename.indexOf('.tmpl') < 1) {
        filename += '.tmpl';
      }

      var path = self.filesystem.findFirstMatch(filename, paths);

      if (!path) {
        throw new Error('TemplateParser could not locate dependency "' + filename + '"');
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