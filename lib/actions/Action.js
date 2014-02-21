/*
  
  ▲ cli base action class

*/

define([

  '../core/Base'

], function (Base) {

  var _super = Base.prototype;
  
  return Base.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      if (typeof self.run !== 'function') {
        throw new Error('Cannot create action without run callback');
      }

      self.run();
    }
  });
});