define([

  './WBController'

], function (WBController, undefined) {

  'use strict';

  var _super = WBController.prototype;

  return WBController.extend({

    'routes': {},

    'initialize': function (options) {

      var self = this;
      options || (options = {});
      _super.initialize.apply(self, arguments);

      self.outlet = options.outlet;
      self.router = options.router;
    },
  });
});