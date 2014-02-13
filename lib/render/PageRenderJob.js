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

    'renderMeta': function (node, langCode) {

      var self = this;
      var options = self.options;
      var templates = options.templates;
      var meta = _.clone(node.meta);
      var template = templates.models[meta.template];
      var url = node.url;

      if (langCode !== options.localization.defaultLangCode) {
        url = langCode + '/' + url;
      }

      meta.langCode = node.langCode = langCode;
      meta.url = url;
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

      node = _.merge({}, node, {
        'nodeType': 'page'
      });

      return self.deferred().resolve(url, result, node);
    },

    'run': function (data) {

      var self = this;
      var pages = [];

      // self.logger.log('=====');
      // self.logger.json(data);

      if (data.meta) {
        _.each(data.meta, function (node, langCode) {
          pages.push(self.renderMeta(node, langCode));
        });
      }
      else if (data.langCode) {
        pages.push(data, data.langCode);
      }
      else {
        throw new Error('Invalid data for processing page render job');
      }

      data.logger.nextAndDone();

      return pages;
    }
  });
});