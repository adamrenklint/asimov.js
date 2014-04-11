var Helper = require('./Helper');
var _super = Helper.prototype;

module.exports = Helper.extend({

  'run': function (url, value, params, block) {

    var self = this;

    if (!url || typeof url !== 'string') {
      throw new TypeError('Url to compare with current url must be a string @ '+ self.currentUrl);
    }

    // TODO: if hash.matchAncestor = true...

    if (url !== self.currentUrl) {
      return '';
    }

    if (typeof value !== 'string') {
      block = params;
      params = value;
      value = block();
    }

    return value;
  }
});