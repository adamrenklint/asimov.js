/*

  menu template helper class

  iterates over the children of the current
  or defined page, and returns a list of links,
  default to text, or whatever the inner template returns

*/

define([

  '../render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

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
          return self.html('li', {
            'html': self.html('a', {
              'href': child.attributes.url,
              'html': options.fn && options.fn(child.attributes) || child.attributes.title
            })
          });
        }).join('')
      });
    }
  });
});