/*

  template dependency parser class

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

      // self.assert('array', self.options.paths && self.options.paths.styles, 'Cannot create StyleSheetParser without an array of paths to search for stylesheets');
    },

    'parse': function (model, raw, dependencies) {

      var self = this;
      var attributes = model.attributes;
      raw = self.assertAttributes(attributes, raw);

      var matches = raw.match(/\{\{(#)?import "(\w)+/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {

        var filename = match.split('"')[1];

        if (filename.indexOf('.tmpl') < 1) {
          filename += '.tmpl';
        }
        var path = self.filesystem.findFirstMatch(filename, self.options.paths.templates);

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
});