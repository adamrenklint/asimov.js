var path = '../../node_modules/wunderbits.core/public/';
var WBEventEmitter = require(path + 'WBEventEmitter');
var WBUtilsMixin = require(path + 'mixins/WBUtilsMixin');
var WBDestroyableMixin = require(path + 'mixins/WBDestroyableMixin');
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