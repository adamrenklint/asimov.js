var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (src, params) {

    var self = this;

    if (typeof src !== 'string') {
      params = src;
      src = params.src;
    }

    params.src = typeof src === 'string' ? src : params.src;

    if (params.src.indexOf('site') === 0) {
      params.src = '/' + params.src;
    }
    else {
      params.src = self.currentUrl === '/' ? self.currentUrl + params.src : self.currentUrl + '/' + params.src;
    }

    return self.html('img', params);
  }
});