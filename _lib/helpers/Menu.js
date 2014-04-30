var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (url, params, block) {

    var self = this;
    var children = [];
    var langCode = 'en';

    if (typeof url !== 'string') {
      block = params;
      params = url;
      url = params.url || self.currentUrl;
    }

    var page = self.pages.get(url);
    self.assert('object', page, 'No page found for url ' + url);

    return self.html('ul', {

      'html': page.children().map(function (child) {

        self.registerDependency(page, child);
        var attributes = child.attributes;

        return self.html('li', {
          'class': attributes.url === self.currentUrl ? 'active' : '',
          'html': self.html('a', {
            'href': attributes.url,
            'html': block && block(attributes) || attributes.title
          })
        });
      }).join('')
    });
  }
});