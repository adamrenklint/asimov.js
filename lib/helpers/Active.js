var Helper = require('../render/Helper');
var _super = Helper.prototype;

module.exports = Helper.extend({

  'run': function (url, value) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;

    if (!url || typeof url !== 'string') {
      throw new TypeError('Url to compare with current url must be a string');
    }

    if (url !== self.currentUrl) {
      return '';
    }

    if (typeof value !== 'string' && typeof options.fn === 'function') {
      value = options.fn(self.currentPage);
    }

    return value;
  }
});