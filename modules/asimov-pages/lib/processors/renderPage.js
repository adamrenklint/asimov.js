var asimov = require('../../../../index');

module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'page') return next();

  var template = asimov.templates.get(attributes.template);

  if (!template) {
    asimov.logError('Failed to render page attributes @ ' + attributes.url, 'Missing template"' + attributes.template + '"');
  }

  var tmpl = template.attributes.compiled;

  try {
    attributes.processed = tmpl(attributes).replace(/\s\s/g, ' ');
  }
  catch (e) {
    return asimov.logError('Failed to render page @ ' + attributes.url, e.toString());
  }

  model.set(attributes, { 'silent': true });

  next();
};
