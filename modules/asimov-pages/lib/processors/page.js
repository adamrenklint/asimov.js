var asimov = require('../../../../index');
var _ = require('lodash');
var handlebars = require('handlebars');
var marked = require('marked');

var blacklist = ['page', 'raw', 'pkg', 'site', 'meta', 'inherits', 'parent'];

function markdown (raw) {

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
}

function clean (raw) {
  return raw.replace(/[^>]\n[^<]/g, function (match) {
    return match.replace('\n', '<br>');
  });
}

function getRenderer (attributes) {

  return function renderValue (value, key, collection) {

    if (blacklist.indexOf(key) >= 0) return;

    if (typeof value === 'string') {

      try {
        var renderedTemplate = false;
        var renderedMarkdown = false;
        var containsMarkup = false;

        if (value.indexOf('{{') >= 0 && value.indexOf('}}') > 0) {

          var template = handlebars.compile(value);
          value = template(attributes);
          renderedTemplate = true;
        }

        if (value.indexOf('\n') >= 0) {

          value = markdown(value);
          value = clean(value);
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
      catch (e) {
        throw [e.message, 'Failed to render page attribute "' + key + '" @ ' + attributes.url];
      }
    }
    else if (_.isPlainObject(value)) {
      _.each(value, renderValue);
    }
  };
}

module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'page') return next();

  var render = getRenderer(attributes);
  _.each(attributes, render);

  model.set(attributes, { 'silent': true });

  next();
};
