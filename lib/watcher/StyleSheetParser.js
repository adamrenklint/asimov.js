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

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'parse': function (target, raw, dependencies) {

      var self = this;
      var attributes = target.attributes;
      raw = raw || attributes.raw;
      var matches = raw.match(/@import "(\w|\.)+"/);
      var match = matches && matches[0];

      self.logger.log('PARSING ' + target.attributes.path);

      if (match && typeof match === 'string') {

        var filename = match.replace('@import "', '').replace('"', '');
        var path = self.filesystem.findFirstMatch(filename, self.options.paths.styles);

        if (!path) {
          throw new Error('StyleSheetParser could not locate dependency "filename"');
        }

        self.add(target, path, dependencies);

        raw = raw.replace(match, '');
        self.parse(target, raw, dependencies);
      }
      else {

        self.logger.log('addSelf '  + target.attributes.path);
        self.add(target, target.attributes.path, dependencies);
      }
    }
  });
});


// 'watchStyleSheet': function (url, data) {

//       var self = this;
//       var dependencies = [];
//       url = url.replace(/\/\//g, '/');

//       function findNextStyleSheet (haystack, filename) {

//
//       }

//       var file = self.getStyleSheet(url);
//       findNextStyleSheet(file.data, file.name);

//       self.register(url, 'styleSheet', dependencies);
//     },