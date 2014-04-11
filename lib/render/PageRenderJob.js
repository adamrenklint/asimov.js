var Base = require('../core/Base');
var _ = require('lodash');
var marked = require('marked');
var handlebars = require('handlebars');
var _super = Base.prototype;

module.exports = Base.extend({

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
    var deferred = self.deferred();
    var options = self.options;
    var templates = options.templates;

    self.mediator.trigger('pre:render:page', model);

    var attributes = model.toJSON();
    attributes.page = attributes;

    var template = templates.get(attributes.template);

    if (!template) {
      throw new Error('Failed to render ' + attributes.path + ' - missing template "' + attributes.template + '"');
    }

    attributes.site = self.options.siteData.getJSON();
    attributes.pkg = self.options.meta;

    if (attributes.langCode !== options.localization.defaultLangCode && !attributes.inherits) {
      attributes.inherits = attributes.url.toString().replace('/' + attributes.langCode, '');
    }

    if (attributes.inherits) {
      var _super = options.pages.get(attributes.inherits);
      attributes['super'] = _super.attributes;
    }

    function renderValues (value, key, collection) {

      if (key === 'page') return;

      if (typeof value === 'string') {

        var renderedTemplate = false;
        var renderedMarkdown = false;
        var containsMarkup = false;

        if (value.indexOf('{{') >= 0 && value.indexOf('}}') > 0) {

          var template = handlebars.compile(value);
          value = template(attributes);
          renderedTemplate = true;
        }

        if (value.indexOf('\n') >= 0) {

          value = self.markdown(value);
          value = self.clean(value);
          renderedMarkdown = true;
        }

        if (value.indexOf('<') >= 0 && value.indexOf('>') >= 0) {
          containsMarkup = true;
        }

        if (containsMarkup) {
          value = new handlebars.SafeString(value);
        }

        collection[key] = value;
      }
      else if (_.isPlainObject(value)) {
        _.each(value, renderValues);
      }
    }

    _.each(attributes, renderValues);

    delete attributes.raw;

    var tmpl = template.attributes.compiled;
    attributes.rendered = tmpl(attributes).replace(/\s\s/g, ' ');

    model.set(attributes, { 'silent': true });

    self.mediator.trigger('post:render:page', model);
    model.trigger('change:rendered', model);

    deferred.resolve(model);

    return deferred;
  }
});