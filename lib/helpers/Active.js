var TemplateHelper = require('../render/TemplateHelper');
var _super = TemplateHelper.prototype;

module.exports = TemplateHelper.extend({

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