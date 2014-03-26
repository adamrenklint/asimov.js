/*

  base initializer class

*/

define([

  './Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'init',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.assert('function', self.run, 'Initializer class must implement a run method');
    }
  });
});