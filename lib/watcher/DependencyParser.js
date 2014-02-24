/*

  dependency parser base class

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'DependencyParser',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'parse': function (raw, dependencies) {

      throw new Error('DependencyParser must implement parse(string raw, collection dependencies)');
    }
  });
});