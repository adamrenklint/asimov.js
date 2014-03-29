/*

  client application class

*/

define([

  // 'wunderbits-core/public/WBEventEmitter'

], function (WBEventEmitter) {

  return function Constructor () {
    console.log('I have been constructed, yay!');
  };
  // var _super = WBEventEmitter.prototype;

  // return WBEventEmitter.extend({

  //   'initialize': function (options) {

  //     var self = this;
  //     _super.initialize.apply(self, arguments);
  //     console.log('Client app loaded');
  //   }
  // });
});