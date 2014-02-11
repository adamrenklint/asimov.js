/*
  
  base class proxy

*/

define([

  'asimov-core/Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
    }
  });
});