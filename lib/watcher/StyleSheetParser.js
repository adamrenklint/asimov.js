/*

  style sheet dependency parser class

*/

define([

  './DependencyParser',
  'lodash'

], function (DependencyParser, _) {

  var _super = DependencyParser.prototype;

  return DependencyParser.extend({

    'namespace': 'Parser',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.assert('array', self.options.paths && self.options.paths.styles, 'Cannot create StyleSheetParser without an array of paths to search for stylesheets');
    },

    'parse': function (model, raw, dependencies) {

      var self = this;

      var attributes = model.attributes;
      self.assert('object', attributes, 'Cannot parse dependencies, invalid model');

      raw = typeof raw === 'string' ? raw : attributes.raw;
      self.assert('string', raw, 'Cannot parse dependencies, invalid raw data');

      self.assert('string', attributes.path, 'Cannot parse dependencies of model without attributes.path');

      var matches = raw.match(/@import "(\w|\.)+"/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {

        var filename = match.replace('@import "', '').replace('"', '');
        if (filename.indexOf('.styl') < 1) {
          filename += '.styl';
        }
        var path = self.filesystem.findFirstMatch(filename, self.options.paths.styles);

        if (!path) {
          throw new Error('StyleSheetParser could not locate dependency "' + filename + '"');
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
});