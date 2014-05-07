var asimov = require('../../../../index');

module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'page') return next();

  var template = asimov.templates.get(attributes.template);

  if (!template) {
    throw ['Failed to render page attributes @ ' + attributes.path, 'Missing template"' + attributes.template + '"'];
  }

  var tmpl = template.attributes.compiled;

  try {
    attributes.processed = tmpl(attributes).replace(/\s\s/g, ' ');
  }
  catch (e) {
    throw [e.message, 'Failed to render page @ ' + attributes.path];
  }

  model.set(attributes, { 'silent': true });

  next();
};
