/*

  page render job class

*/

define([

  '../core/Base',
  'lodash',
  'marked',
  'handlebars'

], function (Base, _, marked, handlebars) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Render',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
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

    'run': function (model) {

      var self = this;
      var deferred = self.deferred()
      var options = self.options;
      var templates = options.templates;
      var attributes = model.toJSON();
      var template = templates.get(attributes.template);

      if (!template) {
        throw new Error('Failed to render ' + attributes.path + ' - missing template "' + attributes.template + '"');
      }

      attributes.page = attributes;
      // attributes.site = self.siteData.json;
      attributes.pkg = self.options.meta;

      self.trigger('rendering', model);

      _.each(attributes, function (value, key) {

        if (typeof value === 'string') {

          var tmpl = handlebars.compile(value);
          var result = tmpl(attributes);
          var markdown = self.markdown(result);
          var clean = self.clean(markdown);

          clean = new handlebars.SafeString(clean);
          attributes[key] = clean;
        }
      });

      var result = template.attributes.compiled(attributes);

      model.set({
        'rendered': result,
        'renderedAt': new Date()
      });

      model.logger.nextAndDone();
      deferred.resolve(model);

      return deferred.promise();
    }
  });
});