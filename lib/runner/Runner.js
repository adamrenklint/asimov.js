/*

  test runner bootstrap class

*/

define([

  '../core/Base',
  '../core/Signature',
  'lodash'

], function (Base, Signature,  _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Runner',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      var signature = new Signature(self.options);
      signature.animate(self.bootstrap);
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      self.logger.startTimer();

      var startString = 'Running tests for "' + meta.name + '" @ ' + meta.version;
      var starting = self.logger.info(self.namespace, startString.bold, false);
      self.logger.info(self.namespace, 'The time is ' + new Date(), false);

      // ...
    }
  });
});