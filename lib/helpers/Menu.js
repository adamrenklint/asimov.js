var TemplateHelper = require('../render/TemplateHelper');
var _ = require('lodash');
var _super = TemplateHelper.prototype;

module.exports = TemplateHelper.extend({

  'run': function (url) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;
    var children = [];
    var langCode = 'en';

    url = typeof url === 'string' && url || hash.url || self.currentUrl;
    var page = self.options.pages.get(url);

    self.assert('object', page, 'No page found for url ' + url);

    return self.html('ul', {

      'html': page.children().map(function (child) {

        var attributes = child.attributes;

        return self.html('li', {
          'class': attributes.url === self.currentUrl ? 'active' : '',
          'html': self.html('a', {
            'href': attributes.url,
            'html': options.fn && options.fn(attributes) || attributes.title
          })
        });
      }).join('')
    });
  }
});