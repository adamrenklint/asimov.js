var Helper = require('../render/Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (src) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;

    hash.src = typeof src === 'string' ? src : hash.src;

    if (hash.src.indexOf('site') === 0) {
      hash.src = '/' + hash.src;
    }
    else {
      hash.src = self.currentUrl === '/' ? self.currentUrl + hash.src : self.currentUrl + '/' + hash.src;
    }

    return self.html('img', hash);
  }
});