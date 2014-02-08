/*
  
  ▲ asimov.js base class

  empowers the skeleton class with logging

*/

define([

  './Klass',
  '../logger/Logger'

], function (Klass, Logger) {

  var _super = Klass.prototype;
  var logger = new Logger();

  return Klass.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger = logger;
    }
  });
});