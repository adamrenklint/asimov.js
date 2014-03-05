/*

  children template helper class

  iterates over the children of the current
  or defined page, nested or shallow

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
      var html = '';

      self.assert('function', options.fn, 'Inner template callback must be a function');

      url = typeof url === 'string' && url || hash.url || self.currentUrl;
      var page = self.options.pages.get(url);

      self.assert('object', page, 'No page found for url ' + url);

      page.children().each(function (child) {
        html += options.fn(child.attributes);
      });

      console.log(html);

      // _.each(self.map, function (page, url) {
      //   if (url.indexOf(targetUrl) === 0 && url !== targetUrl && url.indexOf('.css') < 0 && url.indexOf('.js') < 0 && url.indexOf('404') < 0) {
      //     children.push(url);
      //   }
      // });

      // _.each(children, function (url) {

      //   var child = self.map[url];

      //   if (!child || !child.position) {
      //     return;
      //   }

      //   var meta = child.meta;
      //   var data = meta && meta[langCode] && meta[langCode].meta || {};

      //   data.url = url;

      //   var urlPieces = self.currentUrl.split('/');
      //   var childPieces = url.split('/');

      //   data.isDirectChild = urlPieces.length === childPieces.length - 1;
      //   html += options.fn(data);
      // });

      return html;
    }
  });
});