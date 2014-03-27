var DependencyParser = require('./DependencyParser');
var _ = require('lodash');
var _super = DependencyParser.prototype;

module.exports = DependencyParser.extend({

  'namespace': 'Parser',

  'parse': function (model, raw, dependencies) {

    var self = this;
    var attributes = model.attributes;
    raw = raw || attributes.rendered;

    // console.log('TODO: this regexp is completely wrong now');
    var matches = raw.match(/define\("(\w|\/|\_|\-|\.)+"/);
    var match = matches && matches[0];

    if (match && typeof match === 'string') {

      if (match.indexOf('/vendor/') < 0) {

        var filename = match.replace('define("', '').replace('"', '');
        if (filename.indexOf('.js') < 1) {
          filename += '.js';
        }
        var path = self.filesystem.findFirstMatch(filename, self.options.paths.scripts);

        if (!path) {
          throw new Error('ScriptParser could not locate dependency "' + filename + '"');
        }

        var file = self.filesystem.readFile(path);
        raw += file;

        self.add(model, path, dependencies);
      }

      raw = raw.replace(match, '');
      self.parse(model, raw, dependencies);
    }
    else {

      self.add(model, model.attributes.path, dependencies);
    }
  }
});