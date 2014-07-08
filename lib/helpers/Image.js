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

    self.assert('string', params.src, 'Invalid source url');

    var currentUrl = self.currentUrl;

    if (self.currentPage.attributes.langCode !== self.options.localization.defaultLangCode) {
      currentUrl = currentUrl.replace('/' + self.currentPage.attributes.langCode, '');
    }

    if (params.src.indexOf('site') === 0) {
      params.src = '/' + params.src;
    }
    else {
      params.src = currentUrl === '/' ? currentUrl + params.src : currentUrl + '/' + params.src;
    }

    delete params.page;

    return self.html('img', params);
  }
});
