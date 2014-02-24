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

    // 'parse': function (raw, dependencies) {

    //   var self = this;
    //   //
    // }
  });
});