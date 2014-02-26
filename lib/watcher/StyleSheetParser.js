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

    'parse': function (model, raw, dependencies) {

      var self = this;
      var attributes = model.attributes;
      raw = raw || attributes.raw;
      var matches = raw.match(/@import "(\w|\.)+"/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {

        var filename = match.replace('@import "', '').replace('"', '');
        var path = self.filesystem.findFirstMatch(filename, self.options.paths.styles);

        if (!path) {
          throw new Error('StyleSheetParser could not locate dependency "filename"');
        }

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