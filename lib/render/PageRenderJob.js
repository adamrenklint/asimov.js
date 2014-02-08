/*
  
  ▲ asimov.js page render job class

*/

define([

  '../core/Base',
  '../core/SiteData',
  'lodash',
  'marked',
  'handlebars'

], function (Base, SiteData, _, marked, handlebars) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Render',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.siteData = new SiteData(self.options);
    },

    'markdown': function (raw) {

      var self = this;
      var processed = marked(raw).trim();

      // Remove wrapping <p> paragraphs
      var lastIndex = processed.length - 4;
      var startsWithParagraph = processed.indexOf('<p>') === 0;
      var endsWithParagraph = processed.indexOf('</p>') === lastIndex;

      if (startsWithParagraph && endsWithParagraph) {
        processed = processed.substr(0, lastIndex);
        processed = processed.substr(3);
      }

      if (processed === raw) {
        return raw;
      }

      return processed;
    },

    'clean': function (raw) {
      
      var self = this;
      
      raw = raw.replace(/[^>]\n[^<]/g, function (match) {
        return match.replace('\n', '<br>');
      });

      return raw;
    },

    'run': function (data) {

      var self = this;
      var options = self.options;
      var templates = options.templates;
      var pages = {};

      _.each(data.meta, function (node, langCode) {

        var meta = _.clone(node.meta);
        var template = templates.models[meta.template];
        var url = data.url;
        
        if (langCode !== options.localization.defaultLangCode) {
          url += '/' + langCode;
        }

        node.url = url;
        meta.page = meta;
        meta.site = self.siteData.json;
        meta.pkg = self.options.meta;

        _.each(meta, function (value, key) {

          if (typeof value === 'string') {

            var template = handlebars.compile(value);
            var result = template(meta);
            var markdown = self.markdown(result);
            markdown = new handlebars.SafeString(self.clean(markdown));

            meta[key] = markdown;
          }
        });

        self.trigger('rendering', url, meta);

        var result = template.content(meta);
        pages[url] = result;
      });

      data.logger && data.logger.nextAndDone && data.logger.nextAndDone();
      return pages;
    }
  });
});