var Mixin = require('wunderbits.core').WBMixin;
var _ = require('lodash');

module.exports = Mixin.extend({

  'config': function (attribute, value) {

    var self = this;
    if (!self._config) self._config = {};

    if (!attribute) return _.clone(self._config);

    if (_.isPlainObject(attribute)) {
      return Object.keys(attribute).forEach(function (key) {
        self.config(key, attribute[key]);
      });
    }

    if (!value) return self._config[attribute];

    var old = self._config[attribute];

    if (attribute.toUpperCase() === attribute && old) {
      throw new Error('Constant value for asimov.config.' + attribute + ' already defined as "' + old + '"');
    }

    if (old !== value) {
      self._config[attribute] = value;
      self.trigger('config:attribute', value, old);
    }

    return value;
  }
});
