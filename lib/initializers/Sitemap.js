var Initializer = require('./Initializer');
var _ = require('lodash');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'generate': function () {

    var self = this;
    var started = new Date();
    var baseUrl = 'http://' + self.options.domain_name;
    var count = 0;
    var xml = '';

    xml += '<?xml version="1.0" encoding="utf-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    self.options.pages.each(function (page) {

      if (!page.isHidden() && page.attributes.url !== '/') {

        count++;

        xml += '<url><loc>' + baseUrl + page.attributes.url + '</loc>';

        var modDate = new Date(page.attributes.modifiedAt);
        xml += '<lastmod>' + modDate.toISOString() + '</lastmod>';

        var depth = page.attributes.url.split('/').length / 10;
        var priority = 0.5 - depth;
        if (priority < 0.1) priority = 0.1;

        xml += '<priority>' + priority + '</priority>';

        xml += '</url>';
      }
    });

    xml += '</urlset>';

    var path = self.options.outputPath + '/sitemap.xml';
    self.filesystem.writeFile(path, xml);

    self.logger.since('sitemap', 'Indexed ' + count + ' url(s)', started);
  },

  'run': function (next) {

    var self = this;

    self.generate = _.debounce(self.generate, 1000);
    self.generate();

    self.bindTo(self.options.pages, 'add remove change', 'generate');

    next();
  }
});
