/*

  middleware class

  base for all framework and application middleware
  provides abstractions for common tasks
  and interface to url map for lookups

*/

define([

  '../core/Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'server',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.urls = self.options.urls;
      self.server = self.options.server;
    }
  });
});