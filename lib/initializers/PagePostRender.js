var Initializer = require('./Initializer');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    self.bindTo(self.mediator, 'post:render:page', 'postRender');

    next();
  },

  'postRender': function (page) {

    var self = this;
    var rendered = page.attributes.rendered;

    if (process.env.ENV !== 'production') {
      rendered = rendered.replace('</head>', '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':' + self.options.reloadPort + '/livereload.js"></\' + \'script>\')</script></head>');
    }

    if (rendered.indexOf('favicon') < 0 || rendered.indexOf('shortcut icon') < 0 ) {
      rendered = rendered.replace('</head>', '<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" /></head>');
    }

    rendered = self.localizeUrls(page, rendered);

    page.set({ 'rendered': rendered }, { 'silent': true });
  },

  'localizeUrls': function (page, rendered) {

    var self = this;
    var langCode = page.attributes.langCode;
    var pages = self.options.pages;

    if (langCode !== self.options.localization.defaultLangCode) {

      pages.forEach(function (page) {

        var localizedUrl = '/' + langCode + (page.attributes.url === '/' ? '' : page.attributes.url);
        var localizedPage = pages.get(localizedUrl);

        if (localizedPage) {
          var url = '"' + page.attributes.url + '"';
          var newUrl = '"' + localizedUrl + '"';
          var expr = new RegExp(url, 'g');
          rendered = rendered.replace(expr, localizedUrl);
        }
      });
    }

    return rendered;
  }
});
