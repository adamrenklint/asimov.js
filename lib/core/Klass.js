/*

  ▲ asimov.js skeleton class

  mostly just proxies Slimbo base, for now

*/

define([

  '../vendor/wunderbits.core/public/WBEventEmitter',
  '../vendor/wunderbits.core/public/mixins/WBUtilsMixin',
  '../vendor/wunderbits.core/public/mixins/WBDestroyableMixin',
  'lodash'

], function (WBEventEmitter, WBUtilsMixin, WBDestroyableMixin, _) {

  var _super = WBEventEmitter.prototype;

  return WBEventEmitter.extend({

    'mixins': [
      WBUtilsMixin,
      WBDestroyableMixin
    ],

    'idAttribute': 'obj',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
      _.bindAll(self);

      if (!self.id) {
        self.id = _.uniqueId(self.idAttribute);
      }
    }
  });
});