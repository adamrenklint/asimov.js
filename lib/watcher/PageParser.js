/*

  page dependency parser class

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

      self.assert('array', self.options.templates && self.options.templates.models, 'Cannot create PageParser without a template collection');
    },

    'parse': function (model, raw, dependencies) {

      var self = this;
      var attributes = model.attributes;
      self.assertAttributes(attributes);

      // self.add(model, model.attributes.path, dependencies);

      // var matches = raw.match(/@import "(\w|\.)+"/);
      // var match = matches && matches[0];

      // if (match && typeof match === 'string') {

      //   var filename = match.replace('@import "', '').replace('"', '');
      //   if (filename.indexOf('.styl') < 1) {
      //     filename += '.styl';
      //   }
      //   var path = self.filesystem.findFirstMatch(filename, self.options.paths.styles);

      //   if (!path) {
      //     throw new Error('StyleSheetParser could not locate dependency "' + filename + '"');
      //   }

      //   var file = self.filesystem.readFile(path);
      //   raw += file;

      //   self.add(model, path, dependencies);

      //   raw = raw.replace(match, '');
      //   self.parse(model, raw, dependencies);
      // }
      // else {

      //   self.add(model, model.attributes.path, dependencies);
      // }
    }
  });
});