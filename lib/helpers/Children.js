var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (url) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;
    var children = [];
    var langCode = 'en';

    self.assert('function', options.fn, 'Inner template callback must be a function');

    url = typeof url === 'string' && url || hash.url || self.currentUrl;
    var page = self.options.pages.get(url);

    self.assert('object', page, 'No page found for url ' + url);

    return page.children(hash).map(function (child) {
      return options.fn(child.attributes);
    }).join('');
  }
});