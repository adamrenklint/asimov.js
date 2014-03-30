// var path = '../../node_modules/wunderbits.core/public/';
var WBEventEmitter = require('wunderbits.core').WBEventEmitter;
var WBUtilsMixin = require('wunderbits.core').mixins.WBUtilsMixin;
var WBDestroyableMixin = require('wunderbits.core').mixins.WBDestroyableMixin;
var _ = require('lodash');

var _super = WBEventEmitter.prototype;

module.exports = WBEventEmitter.extend({

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