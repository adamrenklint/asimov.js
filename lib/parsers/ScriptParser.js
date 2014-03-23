/*

  script dependency parser class

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
      self.add(model, model.attributes.path, dependencies);
    }
  });
});