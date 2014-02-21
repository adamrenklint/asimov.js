/*

  page render job class

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
          url = langCode + '/' + url;
        }

        if (!template) {
          throw new Error('Failed to render ' + url + ' - missing template "' + meta.template + '"');
        }

        node.url = url;
        meta.page = meta;
        meta.site = self.siteData.json;
        meta.pkg = self.options.meta;

        self.trigger('rendering', url, meta);

        _.each(meta, function (value, key) {

          if (typeof value === 'string') {

            var tmpl = handlebars.compile(value);
            var result = tmpl(meta);
            var markdown = self.markdown(result);
            var clean = self.clean(markdown);

            clean = new handlebars.SafeString(clean);
            meta[key] = clean;
          }
        });

        var result = template.content(meta);
        pages[url] = result;
      });

      data.logger.nextAndDone();
      return pages;
    }
  });
});