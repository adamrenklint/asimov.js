/*
  
  client application class

*/

define([

  'wunderbits-core/public/WBEventEmitter'

], function (WBEventEmitter) {

  var _super = WBEventEmitter.prototype;

  return WBEventEmitter.extend({

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    }
  });
});