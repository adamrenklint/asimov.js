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
  },

  '_triggerEvent': function (name, params) {

    var self = this;
    self._originalTriggerEvent.apply(self, arguments);

    if (name !== 'all') {
      params.unshift(name);
      params.unshift('all');
      self.trigger.apply(self, params);
    }

    return self;
  },

  'assert': function (type, o, message) {

    var self = this;
    message = message || 'Invalid type: expected ' + type + ', got ' + o.toString();

    if (type.indexOf(' ') > 0) {
      var types = type.split(' ');
      return _.each(types, function (_type) {
        self.assert(_type, o, message);
      });
    }

    var chars = _.toArray(type);
    chars[0] = chars[0].toUpperCase();
    var methodName = 'is' + chars.join('');
    var method = _[methodName];

    if (type == 'defined' && !!!o || typeof method === 'function' && !method(o)) {

      if (typeof message === 'function') {
        message();
      }
      else {
        throw new Error(message);
      }
    }
  }
});